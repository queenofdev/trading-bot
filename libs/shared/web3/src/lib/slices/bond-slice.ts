import { BigNumber, ethers } from "ethers";
import { contractForRedeemHelper, getMarketPrice, getTokenPrice } from "../helpers";
import { error, info } from "./messages-slice";
import { clearPendingTxn, fetchPendingTxns } from "./pending-txns-slice";
import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { masterChefAbi as masterchefAbi } from "../abi";

import {
  IApproveBondAsyncThunk,
  IBaseAsyncThunk,
  IBondAssetAsyncThunk,
  ICalcBondDetailsAsyncThunk,
  ICancelBondAsyncThunk,
  IInvestUsdbNftBondAsyncThunk,
  IJsonRPCError,
  IMintNFTAsyncThunk,
  IRedeemAllBondsAsyncThunk,
  IRedeemBondAsyncThunk,
  IRedeemSingleSidedBondAsyncThunk,
} from "./interfaces";
import { segmentUA } from "../helpers/user-analytic-helpers";

import { getBondCalculator } from "../helpers/bond-calculator";
import { networks } from "../networks";
import { waitUntilBlock } from "../helpers/network-helper";
import { calculateUserBondDetails, getBalances } from "./account-slice";
import { BondType, PaymentToken } from "../lib/bond";
import { addresses } from "../constants";
import { mintBackedNft } from "../lib/api";
/**
 * - fetches the FHM Price from CoinGecko (via getTokenPrice)
 * - falls back to fetch marketPrice from ohm-dai contract
 * - updates the App.slice when it runs
 */
const loadMarketPrice = createAsyncThunk(
  "networks/loadMarketPrice",
  async ({ networkId }: IBaseAsyncThunk) => {
    let marketPrice: number;
    try {
      marketPrice = await getMarketPrice(networkId);
    } catch (e) {
      marketPrice = await getTokenPrice("fantohm");
    }
    return { marketPrice };
  }
);

/**
 * checks if networks.slice has marketPrice already for this network
 * if yes then simply load that state
 * if no then fetches via `loadMarketPrice`
 *
 * `usage`:
 * ```
 * const originalPromiseResult = await dispatch(
 *    findOrLoadMarketPrice({ networkId: networkId }),
 *  ).unwrap();
 * originalPromiseResult?.whateverValue;
 * ```
 */
export const findOrLoadMarketPrice = createAsyncThunk(
  "networks/findOrLoadMarketPrice",
  async ({ networkId }: IBaseAsyncThunk, { dispatch, getState }) => {
    const state: any = getState();
    let marketPrice;
    // check if we already have loaded market price
    if (networkId in state.networks && state.networks[networkId].marketPrice != null) {
      // go get marketPrice from networks.state
      marketPrice = state.networks[networkId].marketPrice;
    } else {
      // we don't have marketPrice in networks.state, so go get it
      try {
        const originalPromiseResult = await dispatch(
          loadMarketPrice({ networkId })
        ).unwrap();
        marketPrice = originalPromiseResult?.marketPrice;
      } catch (rejectedValueOrSerializedError) {
        // handle error here
        console.error("Returned a null response from dispatch(loadMarketPrice)");
        return;
      }
    }
    return { marketPrice };
  }
);

export const changeApproval = createAsyncThunk(
  "bonding/changeApproval",
  async (
    { address, bond, provider, networkId }: IApproveBondAsyncThunk,
    { dispatch }
  ) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const reserveContract = bond.getContractForReserveForWrite(networkId, signer);
    const bondAddr = bond.getAddressForBond(networkId);

    let approveTx;
    const bondAllowance = await reserveContract["allowance"](address, bondAddr);

    // return early if approval already exists
    if (bondAllowance.gt(BigNumber.from("0"))) {
      dispatch(info("Approval completed."));
      dispatch(calculateUserBondDetails({ address, bond, networkId }));
      return;
    }

    try {
      approveTx = await reserveContract["approve"](
        bondAddr,
        ethers.utils.parseUnits("1000000000", "ether").toString()
      );
      dispatch(
        fetchPendingTxns({
          txnHash: approveTx.hash,
          text: "Approving " + bond.displayName,
          type: "approve_" + bond.name,
        })
      );
      await approveTx.wait();
    } catch (e: any) {
      if (e.error === undefined) {
        let message;
        if (e.message === "Internal JSON-RPC error.") {
          message = e.data.message;
        } else {
          message = e.message;
        }
        if (typeof message === "string") {
          dispatch(error(`Unknown error: ${message}`));
        }
      } else {
        dispatch(error(`Unknown error: ${e.error.message}`));
      }
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
        dispatch(calculateUserBondDetails({ address, bond, networkId }));
      }
    }
  }
);

export interface IBondDetails {
  bond: string;
  bondType: BondType;
  bondDiscount: number;
  debtRatio: number;
  bondQuote: number;
  purchased: number;
  vestingTerm: number;
  vestingTermSeconds: number;
  maxBondPrice: number;
  bondPrice: number;
  marketPrice: number;
  isRiskFree: boolean;
  isFhud: boolean;
  bondDiscountFromRebase?: number;
  isCircuitBroken?: boolean;
}
export const calcBondDetails = createAsyncThunk(
  "bonding/calcBondDetails",
  async (
    { bond, value, networkId }: ICalcBondDetailsAsyncThunk,
    { dispatch }
  ): Promise<IBondDetails> => {
    if (!value) {
      value = "0";
    }
    const amountInWei = ethers.utils.parseEther(value);

    // Contracts
    const bondContract = await bond.getContractForBond(networkId);
    const bondCalcContract = await getBondCalculator(networkId);

    async function getBondQuoteAndValuation() {
      let bondQuote,
        valuation = 0;
      if (Number(value) === 0) {
        // if inputValue is 0 avoid the bondQuote calls
        bondQuote = 0;
      } else if (bond.isLP) {
        [valuation, bondQuote] = await Promise.all([
          bondCalcContract["valuation"](
            bond.getAddressForReserve(networkId),
            amountInWei
          ),
          bondContract["payoutFor"](valuation),
        ]);
        if (!amountInWei.isZero() && bondQuote < 100000) {
          bondQuote = 0;
          const errorString = "Amount is too small!";
          dispatch(error(errorString));
        } else {
          bondQuote = bondQuote / Math.pow(10, 9);
        }
      } else {
        // RFV = DAI
        bondQuote = await bondContract["payoutFor"](amountInWei);

        if (!amountInWei.isZero() && bondQuote < 100000000000000) {
          bondQuote = 0;
          const errorString = "Amount is too small!";
          dispatch(error(errorString));
        } else {
          bondQuote = bondQuote / Math.pow(10, 18);
        }
      }

      return { bondQuote, valuation };
    }

    // Contract interactions
    const [
      fhmMarketPrice,
      terms,
      maxBondPrice,
      debtRatio,
      bondPrice,
      purchased,
      valuation,
      bondQuote,
    ] = await Promise.all([
      dispatch(findOrLoadMarketPrice({ networkId: networkId })).unwrap(),
      bondContract["terms"](),
      bondContract["maxPayout"](),
      0, //bondContract["standardizedDebtRatio"]().catch((reason: any) => (console.log("error getting standardizedDebtRatio", reason), 0)),
      bondContract["bondPriceInUSD"]().catch(
        (reason: any) => (console.log("error getting bondPriceInUSD", reason), 0)
      ),
      bond.getTreasuryBalance(networkId),
      getBondQuoteAndValuation(),
    ]).then(
      ([
        fhmMarketPrice,
        terms,
        maxBondPrice,
        debtRatio,
        bondPrice,
        purchased,
        { valuation, bondQuote },
      ]) => [
        fhmMarketPrice?.marketPrice || 0,
        terms,
        maxBondPrice / Math.pow(10, 9),
        debtRatio / Math.pow(10, 9),
        bondPrice / Math.pow(10, bond.decimals),
        purchased,
        valuation,
        bondQuote,
      ]
    );

    const paymentTokenMarketPrice =
      bond.paymentToken === PaymentToken.USDB ? 1 : fhmMarketPrice;

    const bondDiscount =
      bondPrice > 0 ? (paymentTokenMarketPrice - bondPrice) / bondPrice : 0; // 1 - bondPrice / (bondPrice * Math.pow(10, 9));

    // Circuit breaking for FHUD bonds
    let isCircuitBroken = false;
    let actualMaxBondPrice = maxBondPrice;
    if (bond.type === BondType.BOND_USDB) {
      const soldBondsLimitUsd = terms.soldBondsLimitUsd / Math.pow(10, 18);
      const circuitBreakerCurrentPayoutUsd =
        (await bondContract["circuitBreakerCurrentPayout"]()) / Math.pow(10, 18);
      const payoutAvailableUsd = soldBondsLimitUsd - circuitBreakerCurrentPayoutUsd;
      // If payoutAvailable is less than $500 display it as "Sold Out"
      // Note: both FHUD contracts calculate based on USD, not on payout token
      isCircuitBroken = payoutAvailableUsd < 500;
      const payoutAvailable = payoutAvailableUsd / paymentTokenMarketPrice;
      actualMaxBondPrice = Math.min(maxBondPrice, payoutAvailable);
    }

    // Display error if user tries to exceed maximum.
    if (value !== "0" && !!value && parseFloat(bondQuote.toString()) > maxBondPrice) {
      const errorString =
        "You're trying to bond more than the maximum payout available! The maximum bond payout is " +
        maxBondPrice.toFixed(2).toString() +
        ` ${bond.paymentToken}.`;
      dispatch(error(errorString));
    }

    return {
      bond: bond.name,
      bondType: bond.type,
      bondDiscount,
      debtRatio,
      bondQuote,
      purchased,
      vestingTerm: Number(terms.vestingTerm),
      vestingTermSeconds: terms["vestingTermSeconds"]
        ? Number(terms.vestingTermSeconds)
        : 0,
      maxBondPrice: actualMaxBondPrice,
      bondPrice,
      marketPrice: paymentTokenMarketPrice,
      isFhud: bond.type === BondType.BOND_USDB,
      isRiskFree: bond.isRiskFree,
      isCircuitBroken,
    };
  }
);

export const bondAsset = createAsyncThunk(
  "bonding/bondAsset",
  async (
    { value, address, bond, networkId, provider, slippage }: IBondAssetAsyncThunk,
    { dispatch }
  ) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }
    const depositorAddress = address;
    const acceptedSlippage = slippage / 100 || 0.005; // 0.5% as default
    // parseUnits takes String => BigNumber
    const valueInWei = ethers.utils.parseUnits(value.toString(), bond.decimals);
    let balance;
    // Calculate maxPremium based on premium and slippage.
    // const calculatePremium = await bonding.calculatePremium();
    // console.log('bond: ', bond);

    const signer = provider.getSigner();

    const bondContractForRead = await bond.getContractForBond(networkId);
    const bondContractForWrite = bond.getContractForBondForWrite(networkId, signer);
    const calculatePremium = await bondContractForRead["bondPrice"]();
    const maxPremium = Math.round(calculatePremium * (1 + acceptedSlippage));
    // Deposit the bond
    let bondTx;
    const uaData = {
      address: address,
      value: value,
      type: "Bond",
      bondName: bond.displayName,
      approved: true,
      txHash: null,
    };
    try {
      bondTx = await bondContractForWrite["deposit"](
        valueInWei,
        maxPremium,
        depositorAddress
      );
      dispatch(
        fetchPendingTxns({
          txnHash: bondTx.hash,
          text: "Bonding " + bond.displayName,
          type: "deposit_" + bond.name,
        })
      );
      uaData.txHash = bondTx.hash;
      const minedBlock = (await bondTx.wait()).blockNumber;

      const userBondDetails = await dispatch(
        calculateUserBondDetails({ address, bond, networkId })
      ).unwrap();
      if (userBondDetails && userBondDetails.userBonds.length > 0) {
        const latestBond =
          userBondDetails.userBonds[userBondDetails.userBonds.length - 1];
        // If the maturation block is the next one. wait until the next block and then refresh bond details
        if (
          latestBond.bondMaturationBlock &&
          latestBond.bondMaturationBlock - minedBlock === 1
        ) {
          waitUntilBlock(provider, minedBlock + 1).then(() =>
            dispatch(calculateUserBondDetails({ address, bond, networkId }))
          );
        }
      }
    } catch (e: any) {
      if (e.error === undefined) {
        let message;
        if (e.message === "Internal JSON-RPC error.") {
          message = e.data.message;
        } else {
          message = e.message;
        }
        if (typeof message === "string") {
          dispatch(error(`Unknown error: ${message}`));
        }
      } else if (
        e.error.code === -32603 &&
        e.error.message.indexOf("CIRCUIT_BREAKER_ACTIVE") >= 0
      ) {
        dispatch(error("Maximum daily limit for bond reached."));
      } else {
        dispatch(error(`Unknown error: ${e.error.message}`));
      }
    } finally {
      if (bondTx) {
        segmentUA(uaData);
        await dispatch(clearPendingTxn(bondTx.hash));
        await dispatch(getBalances({ address, networkId }));
      }
    }
  }
);

export const redeemSingleSidedBond = createAsyncThunk(
  "bonding/redeemSingleSidedBond",
  async (
    { value, address, bond, networkId, provider }: IRedeemSingleSidedBondAsyncThunk,
    { dispatch }
  ) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }
    const signer = provider.getSigner();
    const bondContract = bond.getContractForBondForWrite(networkId, signer);

    let redeemTx;
    const uaData = {
      value: value,
      address: address,
      type: "Redeem",
      bondName: bond.displayName,
      approved: true,
      txHash: null,
    };
    try {
      redeemTx = await bondContract["redeem"](
        address,
        ethers.utils.parseUnits(value, 18),
        0
      );
      const pendingTxnType = "deposit_" + bond.name;
      uaData.txHash = redeemTx.hash;
      dispatch(
        fetchPendingTxns({
          txnHash: redeemTx.hash,
          text: "Redeeming " + bond.displayName,
          type: pendingTxnType,
        })
      );

      const minedBlock = (await redeemTx.wait()).blockNumber;

      const userBondDetails = await dispatch(
        calculateUserBondDetails({ address, bond, networkId })
      ).unwrap();
      if (userBondDetails && userBondDetails.userBonds.length > 0) {
        const latestBond =
          userBondDetails.userBonds[userBondDetails.userBonds.length - 1];
        // If the maturation block is the next one. wait until the next block and then refresh bond details
        if (
          latestBond.bondMaturationBlock &&
          latestBond.bondMaturationBlock - minedBlock === 1
        ) {
          waitUntilBlock(provider, minedBlock + 1).then(() =>
            dispatch(calculateUserBondDetails({ address, bond, networkId }))
          );
        }
      }

      dispatch(getBalances({ address, networkId }));
    } catch (e: any) {
      uaData.approved = false;
      if (e.error === undefined) {
        let message;
        if (e.message === "Internal JSON-RPC error.") {
          message = e.data.message;
        } else {
          message = e.message;
        }
        if (typeof message === "string") {
          dispatch(error(`Unknown error: ${message}`));
        }
      } else {
        dispatch(error(`Unknown error: ${e.error.message}`));
      }
    } finally {
      if (redeemTx) {
        segmentUA(uaData);
        dispatch(clearPendingTxn(redeemTx.hash));
        dispatch(info("Withdrawal completed."));
      }
    }
  }
);

export const redeemSingleSidedILProtection = createAsyncThunk(
  "bonding/redeemSingleSidedILProtection",
  async ({ address, bond, networkId, provider }: IRedeemBondAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const bondContract = bond.getContractForBondForWrite(networkId, signer);

    let redeemTx;
    const uaData = {
      address: address,
      type: "Redeem",
      bondName: bond.displayName,
      approved: true,
      txHash: null,
    };
    try {
      redeemTx = await bondContract["ilProtectionRedeem"](address);
      const pendingTxnType = "deposit_" + bond.name;
      uaData.txHash = redeemTx.hash;
      dispatch(
        fetchPendingTxns({
          txnHash: redeemTx.hash,
          text: "Redeeming " + bond.displayName,
          type: pendingTxnType,
        })
      );

      await redeemTx.wait();
      await dispatch(calculateUserBondDetails({ address, bond, networkId }));

      dispatch(getBalances({ address, networkId }));
    } catch (e: any) {
      uaData.approved = false;
      if (e.error === undefined) {
        let message;
        if (e.message === "Internal JSON-RPC error.") {
          message = e.data.message;
        } else {
          message = e.message;
        }
        if (typeof message === "string") {
          dispatch(error(`Unknown error: ${message}`));
        }
      } else if (
        e.error.code === -32603 &&
        e.error.message.indexOf("CIRCUIT_BREAKER_ACTIVE") >= 0
      ) {
        dispatch(error("Maximum daily limit for bond reached."));
      } else {
        dispatch(error(`Unknown error: ${e.error.message}`));
      }
    } finally {
      if (redeemTx) {
        segmentUA(uaData);
        dispatch(clearPendingTxn(redeemTx.hash));
        dispatch(info("IL Redeem completed."));
      }
    }
  }
);

export const redeemBondUsdb = createAsyncThunk(
  "bonding/redeemBondUsdb",
  async ({ address, bond, networkId, provider }: IRedeemBondAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const bondContract = bond.getContractForBondForWrite(networkId, signer);

    let redeemTx;
    const uaData = {
      address: address,
      type: "Redeem",
      bondName: bond.displayName,
      approved: true,
      txHash: null,
    };
    try {
      redeemTx = await bondContract["redeem"](address, true);
      const pendingTxnType = "redeem_" + bond.name;
      uaData.txHash = redeemTx.hash;
      dispatch(
        fetchPendingTxns({
          txnHash: redeemTx.hash,
          text: "Redeeming " + bond.displayName,
          type: pendingTxnType,
        })
      );

      await redeemTx.wait();
      await dispatch(calculateUserBondDetails({ address, bond, networkId }));

      dispatch(getBalances({ address, networkId }));
    } catch (e: any) {
      uaData.approved = false;
      if (e.error === undefined) {
        let message;
        if (e.message === "Internal JSON-RPC error.") {
          message = e.data.message;
        } else {
          message = e.message;
        }
        if (typeof message === "string") {
          dispatch(error(`Unknown error: ${message}`));
        }
      } else if (
        e.error.code === -32603 &&
        e.error.message.indexOf("CIRCUIT_BREAKER_ACTIVE") >= 0
      ) {
        dispatch(error("Maximum daily limit for bond reached."));
      } else {
        dispatch(error(`Unknown error: ${e.error.message}`));
      }
    } finally {
      if (redeemTx) {
        segmentUA(uaData);
        dispatch(clearPendingTxn(redeemTx.hash));
        dispatch(info("Redeem completed."));
      }
    }
  }
);

export const claimSingleSidedBond = createAsyncThunk(
  "bonding/redeemBond",
  async (
    { value, address, bond, networkId, provider }: IRedeemSingleSidedBondAsyncThunk,
    { dispatch }
  ) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const masterchefContract = new ethers.Contract(
      addresses[networkId]["MASTERCHEF_ADDRESS"],
      masterchefAbi,
      signer
    );

    let redeemTx;
    const uaData = {
      value: value,
      address: address,
      type: "Redeem",
      bondName: bond.displayName,
      approved: true,
      txHash: null,
    };
    try {
      const poolId = await masterchefContract["getPoolIdForLpToken"](
        addresses[networkId]["USDB_DAI_LP_ADDRESS"]
      );
      redeemTx = await masterchefContract["harvest"](poolId, address);
      const pendingTxnType = "bond_" + bond.name;
      uaData.txHash = redeemTx.hash;
      dispatch(
        fetchPendingTxns({
          txnHash: redeemTx.hash,
          text: "Redeeming " + bond.displayName,
          type: pendingTxnType,
        })
      );

      await redeemTx.wait();
      await dispatch(calculateUserBondDetails({ address, bond, networkId }));

      dispatch(getBalances({ address, networkId }));
    } catch (e: any) {
      uaData.approved = false;
      if (e.error === undefined) {
        let message;
        if (e.message === "Internal JSON-RPC error.") {
          message = e.data.message;
        } else {
          message = e.message;
        }
        if (typeof message === "string") {
          dispatch(error(`Unknown error: ${message}`));
        }
      } else {
        dispatch(error(`Unknown error: ${e.error.message}`));
      }
    } finally {
      if (redeemTx) {
        segmentUA(uaData);
        dispatch(clearPendingTxn(redeemTx.hash));
        dispatch(info("Claim completed."));
      }
    }
  }
);

export const redeemOneBond = createAsyncThunk(
  "bonding/redeemBond",
  async (
    { address, bond, networkId, provider, autostake }: IRedeemBondAsyncThunk,
    { dispatch }
  ) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const bondContract = bond.getContractForBondForWrite(networkId, signer);

    let redeemTx;
    const uaData = {
      address: address,
      type: "Redeem",
      bondName: bond.displayName,
      autoStake: autostake,
      approved: true,
      txHash: null,
    };
    try {
      if (bond.type === BondType.TRADFI) {
        redeemTx = await bondContract["redeemOne"](address);
      } else if (bond.type === BondType.BOND_USDB) {
        redeemTx = await bondContract["redeem"](address, true);
      } else {
        dispatch(error(`Unknown Bond Type`));
      }

      const pendingTxnType = "redeem_bond_" + bond.name + (autostake ? "_autostake" : "");
      uaData.txHash = redeemTx.hash;
      dispatch(
        fetchPendingTxns({
          txnHash: redeemTx.hash,
          text: "Redeeming " + bond.displayName,
          type: pendingTxnType,
        })
      );

      await redeemTx.wait();
      await dispatch(calculateUserBondDetails({ address, bond, networkId }));

      dispatch(getBalances({ address, networkId }));
    } catch (e: any) {
      uaData.approved = false;
      if (e.error === undefined) {
        let message;
        if (e.message === "Internal JSON-RPC error.") {
          message = e.data.message;
        } else {
          message = e.message;
        }
        if (typeof message === "string") {
          dispatch(error(`Unknown error: ${message}`));
        }
      } else {
        dispatch(error(`Unknown error: ${e.error.message}`));
      }
    } finally {
      if (redeemTx) {
        segmentUA(uaData);
        dispatch(clearPendingTxn(redeemTx.hash));
      }
    }
  }
);

export const redeemAllBonds = createAsyncThunk(
  "bonding/redeemAllBonds",
  async (
    { bonds, address, networkId, provider, autostake }: IRedeemAllBondsAsyncThunk,
    { dispatch }
  ) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const redeemHelperContract = contractForRedeemHelper({ networkId, signer: signer });

    let redeemAllTx;

    try {
      redeemAllTx = await redeemHelperContract["redeemAll"](address, autostake);
      const pendingTxnType =
        "redeem_all_bonds" + (autostake === true ? "_autostake" : "");

      await dispatch(
        fetchPendingTxns({
          txnHash: redeemAllTx.hash,
          text: "Redeeming All Bonds",
          type: pendingTxnType,
        })
      );

      await redeemAllTx.wait();

      bonds &&
        bonds.forEach(async (bond) => {
          dispatch(calculateUserBondDetails({ address, bond, networkId }));
        });

      dispatch(getBalances({ address, networkId }));
    } catch (e: any) {
      if (e.error === undefined) {
        let message;
        if (e.message === "Internal JSON-RPC error.") {
          message = e.data.message;
        } else {
          message = e.message;
        }
        if (typeof message === "string") {
          dispatch(error(`Unknown error: ${message}`));
        }
      } else {
        dispatch(error(`Unknown error: ${e.error.message}`));
      }
    } finally {
      if (redeemAllTx) {
        dispatch(clearPendingTxn(redeemAllTx.hash));
      }
    }
  }
);

export const cancelBond = createAsyncThunk(
  "bonding/cancelBond",
  async (
    { bond, address, networkId, provider, index }: ICancelBondAsyncThunk,
    { dispatch }
  ) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const contract = bond.getContractForBondForWrite(networkId, signer);

    let cancelTx;

    try {
      cancelTx = await contract["cancelBond"](address, index);
      const pendingCancelTxnType = `cancel_bond_${bond.name}_${index}`;

      await dispatch(
        fetchPendingTxns({
          txnHash: cancelTx.hash,
          text: "Cancelling " + bond.displayName,
          type: pendingCancelTxnType,
        })
      );

      await cancelTx.wait();

      dispatch(calculateUserBondDetails({ address, bond, networkId }));
    } catch (e: any) {
      if (e.error === undefined) {
        let message;
        if (e.message === "Internal JSON-RPC error.") {
          message = e.data.message;
        } else {
          message = e.message;
        }
        if (typeof message === "string") {
          dispatch(error(`Unknown error: ${message}`));
        }
      } else {
        dispatch(error(`Unknown error: ${e.error.message}`));
      }
    } finally {
      if (cancelTx) {
        dispatch(clearPendingTxn(cancelTx.hash));
      }
    }
  }
);

export const investUsdbNftBond = createAsyncThunk(
  "bonding/investUsdbNftBond",
  async (
    {
      tokenId,
      value,
      address,
      bond,
      networkId,
      provider,
      navigate,
    }: IInvestUsdbNftBondAsyncThunk,
    { dispatch }
  ) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }
    const signer = provider.getSigner();
    const bondContract = bond.getContractForBondForWrite(networkId, signer);
    const depositorAddress = address;
    const valueInWei = ethers.utils.parseUnits(value.toString(), bond.decimals);
    const slippage = 1;
    const acceptedSlippage = slippage / 100 || 0.005; // 0.5% as default

    let investTx;
    const uaData = {
      address: address,
      value: value,
      type: "Bond",
      bondName: bond.displayName,
      approved: true,
      txHash: null,
    };
    try {
      const calculatePremium = await bondContract["bondPrice"]();
      const maxPremium = Math.round(calculatePremium * (1 + acceptedSlippage));

      const overrides = {
        value: ethers.utils.parseEther("0.001"),
      };
      investTx = await bondContract["deposit"](
        valueInWei,
        maxPremium,
        depositorAddress,
        overrides
      );
      dispatch(
        fetchPendingTxns({
          txnHash: investTx.hash,
          text: "Invest " + bond.displayName,
          type: "invest_" + bond.name,
        })
      );
      uaData.txHash = investTx.hash;

      dispatch(getBalances({ address, networkId }));
    } catch (e: any) {
      console.log(e);
      uaData.approved = false;
      if (e.error === undefined) {
        let message;
        if (e.message === "Internal JSON-RPC error.") {
          message = e.data.message;
        } else {
          message = e.message;
        }
        if (typeof message === "string") {
          dispatch(error(`Unknown error: ${message}`));
        }
      } else {
        dispatch(error(`Unknown error: ${e.error.message}`));
      }
    } finally {
      if (investTx) {
        segmentUA(uaData);
        dispatch(clearPendingTxn(investTx.hash));
        dispatch(info("Invest completed."));

        setTimeout(async () => {
          if (tokenId) await mintBackedNft(tokenId);
          setTimeout(() => navigate("/my-account#nft-investments"), 2000);
        }, 5000);
      }
    }
  }
);

export const mint_Whitelist_NFT = createAsyncThunk(
  "bonding/mintPassNFT",
  async (
    { address, bond, networkId, provider, proof1, proof2 }: IMintNFTAsyncThunk,
    { dispatch }
  ) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }
    const minterAddress = address;

    const signer = provider.getSigner();

    const bondContractForWrite = bond.getContractForBondForWrite(networkId, signer);

    const overrides = {
      value: ethers.utils.parseEther("0"),
    };

    // Deposit the bond
    let mintTx;
    const uaData = {
      address: address,
      type: "Bond",
      bondName: bond.displayName,
      approved: true,
      txHash: null,
    };
    try {
      mintTx = await bondContractForWrite["mint"](proof1, proof2);
      dispatch(
        fetchPendingTxns({
          txnHash: mintTx.hash,
          text: "Mint " + bond.displayName,
          type: "Mint_" + bond.name,
        })
      );
      uaData.txHash = mintTx.hash;
    } catch (e: any) {
      if (e.error === undefined) {
        let message;
        if (e.message === "Internal JSON-RPC error.") {
          message = e.data.message;
        } else {
          message = e.message;
        }
        if (typeof message === "string") {
          dispatch(error(`Unknown error: ${message}`));
        }
      } else {
        dispatch(error(`Unknown error: ${e.error.message}`));
      }
    } finally {
      if (mintTx) {
        segmentUA(uaData);
        await dispatch(clearPendingTxn(mintTx.hash));
        dispatch(info("Mint completed."));
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }
  }
);
export const mint_Public_NFT = createAsyncThunk(
  "bonding/mintPassNFT",
  async ({ address, bond, networkId, provider }: IMintNFTAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }
    const minterAddress = address;

    const signer = provider.getSigner();

    const bondContractForRead = await bond.getContractForBond(networkId);
    const bondContractForWrite = bond.getContractForBondForWrite(networkId, signer);

    const overrides = {
      value: ethers.utils.parseEther("0"),
    };

    // Deposit the bond
    let mintTx;
    const uaData = {
      address: address,
      type: "Bond",
      bondName: bond.displayName,
      approved: true,
      txHash: null,
    };
    try {
      mintTx = await bondContractForWrite["mint_public_gh56gui"](
        minterAddress,
        overrides
      );
      dispatch(
        fetchPendingTxns({
          txnHash: mintTx.hash,
          text: "Mint " + bond.displayName,
          type: "Mint_" + bond.name,
        })
      );
      uaData.txHash = mintTx.hash;
      const minedBlock = (await mintTx.wait()).blockNumber;
    } catch (e: any) {
      if (e.error === undefined) {
        let message;
        if (e.message === "Internal JSON-RPC error.") {
          message = e.data.message;
        } else {
          message = e.message;
        }
        if (typeof message === "string") {
          dispatch(error(`Unknown error: ${message}`));
        }
      } else {
        dispatch(error(`Unknown error: ${e.error.message}`));
      }
    } finally {
      if (mintTx) {
        segmentUA(uaData);
        await dispatch(clearPendingTxn(mintTx.hash));
        dispatch(info("Mint completed."));
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }
  }
);
export const getNFTBalance = createAsyncThunk(
  "bonding/getPassNFTBalance",
  async ({ bond, networkId }: IMintNFTAsyncThunk, { dispatch }) => {
    const bondContractForRead = await bond.getContractForBond(networkId);

    try {
      const supply: number = await bondContractForRead["totalSupply"]();
      return supply;
    } catch (e: any) {
      if (e.error === undefined) {
        let message;
        if (e.message === "Internal JSON-RPC error.") {
          message = e.data.message;
        } else {
          message = e.message;
        }
        if (typeof message === "string") {
          dispatch(error(`Unknown error: ${message}`));
        }
      } else {
        dispatch(error(`Unknown error: ${e.error.message}`));
      }
    }
    return undefined;
  }
);

// Note(zx): this is a barebones interface for the state. Update to be more accurate
interface IBondSlice {
  status: string;
  [key: string]: any;
}

const setBondState = (state: IBondSlice, payload: any) => {
  const bond = payload.bond;
  const newState = { ...state[bond], ...payload };
  state[bond] = newState;
  state["loading"] = false;
};

const initialState: IBondSlice = {
  status: "idle",
};

const bondingSlice = createSlice({
  name: "bonding",
  initialState,
  reducers: {
    fetchBondSuccess(state, action) {
      state[action.payload.bond] = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(calcBondDetails.pending, (state) => {
        state["loading"] = true;
      })
      .addCase(calcBondDetails.fulfilled, (state, action) => {
        setBondState(state, action.payload);
        state["loading"] = false;
      })
      .addCase(calcBondDetails.rejected, (state, { error }) => {
        state["loading"] = false;
        console.error(error.message);
      });
  },
});

export const bondingReducer = bondingSlice.reducer;

export const { fetchBondSuccess } = bondingSlice.actions;
