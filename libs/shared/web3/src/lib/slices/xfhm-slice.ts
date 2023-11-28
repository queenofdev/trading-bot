import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";

import { error } from "./messages-slice";
import {
  clearPendingTxn,
  fetchPendingTxns,
  getStakingTypeText,
} from "./pending-txns-slice";
import { chains } from "../providers";
import {
  IBaseAddressAsyncThunk,
  IXfhmActionValueAsyncThunk,
  IXfhmAddLiquidityAsyncThunk,
  IXfhmChangeApprovalAsyncThunk,
  IXfhmClaimAsyncThunk,
  IXfhmValueAsyncThunk,
} from "./interfaces";
import { getTokenPrice, setAll } from "../helpers";
import { allAssetTokens, AssetToken, xFhmToken } from "../helpers/asset-tokens";
import { sleep } from "../helpers/sleep";
import { addresses } from "../constants";
import { networks } from "../networks";
import { sOhmAbi, lqdrUsdbPolBondDepositoryAbi, ierc20Abi } from "../abi";

interface IUAData {
  address: string;
  value: string;
  approved: boolean;
  txHash: string | null;
  type: string | null;
}

export interface IXfhmDetails {
  fhmBalance: number;
  xfhmBalance: number;
  lqdrUsdbLpBalance: number;
  allowance: number;
  xfhmForLqdrUsdbPolAllowance: number;
  lqdrAllowance: number;
  depositAmount: number;
  xfhmPerHour: number;
  stakedFhm: number;
  totalXfhmSupply: number;
  maxXfhmToEarn: number;
  claimableXfhm: number;
  lqdrPrice: number;
  usdbPrice: number;
  lqdrUsdbLpPrice: number;
}

export const calcXfhmDetails = createAsyncThunk(
  "xfhm-lqdr/calcXfhmDetails",
  async ({ address, networkId }: IBaseAddressAsyncThunk): Promise<IXfhmDetails> => {
    const xfhmAddress = xFhmToken.networkAddrs[networkId];
    if (!xfhmAddress || !address) {
      return {
        fhmBalance: 0,
        xfhmBalance: 0,
        lqdrUsdbLpBalance: 0,
        allowance: 0,
        xfhmForLqdrUsdbPolAllowance: 0,
        lqdrAllowance: 0,
        depositAmount: 0,
        xfhmPerHour: 0,
        stakedFhm: 0,
        totalXfhmSupply: 0,
        maxXfhmToEarn: 0,
        claimableXfhm: 0,
        lqdrPrice: 0,
        usdbPrice: 0,
        lqdrUsdbLpPrice: 0,
      };
    }
    const provider = await chains[networkId].provider;
    const lqdrUsdbLpAddress = networks[networkId].addresses["LQDR_USDB_LP_ADDRESS"];
    const lqdrUsdbLpContract = new ethers.Contract(
      lqdrUsdbLpAddress,
      ierc20Abi,
      provider
    );
    const fhmContract = new ethers.Contract(
      networks[networkId].addresses["OHM_ADDRESS"] as string,
      sOhmAbi,
      provider
    );
    const lqdrUsdbPolContract = new ethers.Contract(
      networks[networkId].addresses["LQDR_USDB_POL_BOND_DEPOSITORY_ADDRESS"] as string,
      lqdrUsdbPolBondDepositoryAbi,
      provider
    );
    const lqdrContract = new ethers.Contract(
      networks[networkId].addresses["LQDR_ADDRESS"] as string,
      sOhmAbi,
      provider
    );
    const usdbContract = new ethers.Contract(
      networks[networkId].addresses["USDB_ADDRESS"],
      ierc20Abi,
      provider
    );
    const xfhmContract = await xFhmToken.getContract(networkId);
    const [
      fhmBalance,
      xfhmBalance,
      lqdrUsdbLpBalance,
      allowance,
      xfhmForLqdrUsdbPolAllowance,
      lqdrAllowance,
      depositAmount,
      xfhmPerHour,
      stakedFhm,
      totalXfhmSupply,
      maxXfhmToEarn,
      claimableXfhm,
      lqdrBalance,
      usdbBalance,
      lqdrPrice,
      lqdrUsdbLpTotalSupply,
    ] = await Promise.all([
      fhmContract["balanceOf"](address),
      xfhmContract["balanceOf"](address),
      lqdrUsdbPolContract["bondInfo"](address),
      fhmContract["allowance"](address, xfhmAddress),
      xfhmContract["allowance"](
        address,
        networks[networkId].addresses["LQDR_USDB_POL_BOND_DEPOSITORY_ADDRESS"] as string
      ),
      lqdrContract["allowance"](
        address,
        networks[networkId].addresses["LQDR_USDB_POL_BOND_DEPOSITORY_ADDRESS"] as string
      ),
      xfhmContract["users"](address),
      xfhmContract["generationRate"](),
      xfhmContract["getStakedFhm"](address),
      xfhmContract["totalSupply"](),
      xfhmContract["maxCap"](),
      xfhmContract["claimable"](address),
      lqdrContract["balanceOf"](lqdrUsdbLpAddress),
      usdbContract["balanceOf"](lqdrUsdbLpAddress),
      getTokenPrice("liquiddriver"),
      lqdrUsdbLpContract["totalSupply"](),
    ]).then(
      ([
        fhmBalance,
        xfhmBalance,
        lqdrUsdbLpBalance,
        allowance,
        xfhmForLqdrUsdbPolAllowance,
        lqdrAllowance,
        depositAmount,
        xfhmPerHour,
        stakedFhm,
        totalXfhmSupply,
        maxXfhmToEarn,
        claimableXfhm,
        lqdrBalance,
        usdbBalance,
        lqdrPrice,
        lqdrUsdbLpTotalSupply,
      ]) => [
        Number(fhmBalance.toString()),
        Number(xfhmBalance.toString()),
        Number(lqdrUsdbLpBalance[1].toString()),
        Number(allowance.toString()),
        Number(xfhmForLqdrUsdbPolAllowance.toString()),
        Number(lqdrAllowance.toString()),
        Number(depositAmount[0].toString()),
        Math.ceil(
          Number(
            (xfhmPerHour * 3600 * depositAmount[0] + Math.pow(10, 18) / 2) /
              Math.pow(10, 18)
          )
        ),
        Number(stakedFhm.toString()),
        Number(totalXfhmSupply.toString()),
        Number(maxXfhmToEarn * depositAmount[0]),
        Number(claimableXfhm.toString()),
        Number(lqdrBalance.toString()),
        Number(usdbBalance.toString()),
        Number(lqdrPrice.toString()),
        Number(lqdrUsdbLpTotalSupply.toString()),
      ]
    );

    let usdbPrice = 1;

    if (usdbBalance && lqdrBalance) {
      usdbPrice = (lqdrPrice * lqdrBalance) / usdbBalance;
    }

    const totalValueLocked = usdbPrice * usdbBalance + lqdrPrice * lqdrBalance;
    const lqdrUsdbLpPrice = totalValueLocked / lqdrUsdbLpTotalSupply;

    return {
      fhmBalance,
      xfhmBalance,
      lqdrUsdbLpBalance,
      allowance,
      xfhmForLqdrUsdbPolAllowance,
      lqdrAllowance,
      depositAmount,
      xfhmPerHour,
      stakedFhm,
      totalXfhmSupply,
      maxXfhmToEarn,
      claimableXfhm,
      lqdrPrice,
      usdbPrice: Number(Number(usdbPrice).toFixed(2)),
      lqdrUsdbLpPrice,
    };
  }
);

export const calcAllAssetTokenDetails = createAsyncThunk(
  "xfhm-lqdr/calcAllAssetTokenDetails",
  async ({ address, networkId }: IBaseAddressAsyncThunk): Promise<AssetToken[]> => {
    return await Promise.all(
      allAssetTokens.map(async (token: AssetToken) => {
        const tokenContract = await token.getContract(networkId);
        const balance = await tokenContract["balanceOf"](address);
        token.setBalance(balance);
        return token;
      })
    );
  }
);

export const changeApprovalForXfhm = createAsyncThunk(
  "xfhm-lqdr/changeApprovalForXfhm",
  async (
    { provider, address, networkId, token }: IXfhmChangeApprovalAsyncThunk,
    { dispatch }
  ) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    let contract = new ethers.Contract(
      addresses[networkId]["OHM_ADDRESS"] as string,
      ierc20Abi,
      signer
    );
    let spenderAddress = addresses[networkId]["XFHM_ADDRESS"];
    if (token === "lqdr") {
      contract = new ethers.Contract(
        addresses[networkId]["LQDR_ADDRESS"] as string,
        ierc20Abi,
        signer
      );
      spenderAddress = addresses[networkId]["LQDR_USDB_POL_BOND_DEPOSITORY_ADDRESS"];
    } else if (token === "xfhm") {
      contract = new ethers.Contract(
        addresses[networkId]["XFHM_ADDRESS"] as string,
        ierc20Abi,
        signer
      );
      spenderAddress = addresses[networkId]["LQDR_USDB_POL_BOND_DEPOSITORY_ADDRESS"];
    }
    let approveTx;
    try {
      approveTx = await contract["approve"](
        spenderAddress,
        ethers.constants.MaxUint256.toString()
      );
      const text = "Approve";
      const pendingTxnType = `approve-${token}`;
      await dispatch(
        fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType })
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
      return;
    } finally {
      if (approveTx) {
        await dispatch(clearPendingTxn(approveTx.hash));
        await dispatch(calcXfhmDetails({ address, networkId }));
      }
    }
  }
);

export const changeStakeForXfhm = createAsyncThunk(
  "xfhm-lqdr/fhmStakeForXfhm",
  async (
    { provider, address, networkId, value, action }: IXfhmActionValueAsyncThunk,
    { dispatch }
  ) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const xfhmContract = await xFhmToken.getContractForWrite(networkId, signer);
    let stakeTx;
    const uaData: IUAData = {
      address: address,
      value: value,
      approved: true,
      txHash: null,
      type: null,
    };
    try {
      if (action === "stake") {
        uaData.type = "stake";
        stakeTx = await xfhmContract["deposit"](ethers.utils.parseUnits(value, "gwei"));
      } else {
        uaData.type = "unstake";
        stakeTx = await xfhmContract["withdraw"](ethers.utils.parseUnits(value, "gwei"));
      }
      const pendingTxnType = action === "stake" ? "staking" : "unstaking";
      uaData.txHash = stakeTx.hash;
      await dispatch(
        fetchPendingTxns({
          txnHash: stakeTx.hash,
          text: getStakingTypeText(action),
          type: pendingTxnType,
        })
      );
      await stakeTx.wait();
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
      return;
    } finally {
      if (stakeTx) {
        // segmentUA(uaData);
        await sleep(2);
        dispatch(clearPendingTxn(stakeTx.hash));
        await dispatch(calcXfhmDetails({ address, networkId }));
        await dispatch(calcAllAssetTokenDetails({ address, networkId }));
      }
    }
  }
);

export const claimForXfhm = createAsyncThunk(
  "xfhm-lqdr/claimForXfhm",
  async ({ provider, address, networkId }: IXfhmClaimAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const xfhmContract = await xFhmToken.getContractForWrite(networkId, signer);
    let claimTx;
    try {
      claimTx = await xfhmContract["claim"]();
      const text = "Claiming";
      const pendingTxnType = "claiming";
      await dispatch(
        fetchPendingTxns({ txnHash: claimTx.hash, text, type: pendingTxnType })
      );
      await claimTx.wait();
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
      return;
    } finally {
      if (claimTx) {
        await dispatch(clearPendingTxn(claimTx.hash));
        await dispatch(calcXfhmDetails({ address, networkId }));
        await dispatch(calcAllAssetTokenDetails({ address, networkId }));
      }
    }
  }
);

export const addLiquidity = createAsyncThunk(
  "xfhm-lqdr/addLiquidity",
  async (
    { provider, address, networkId, value, token }: IXfhmAddLiquidityAsyncThunk,
    { dispatch }
  ) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const lqdrUsdbPolBondContract = new ethers.Contract(
      networks[networkId].addresses["LQDR_USDB_POL_BOND_DEPOSITORY_ADDRESS"] as string,
      lqdrUsdbPolBondDepositoryAbi,
      signer
    );
    const bondPriceInUSD = await lqdrUsdbPolBondContract["bondPriceInUSD"]();
    let addLiquidityTx;
    try {
      addLiquidityTx = await lqdrUsdbPolBondContract["deposit"](
        value,
        bondPriceInUSD,
        address
      );
      const text = "Adding Liquidity";
      const pendingTxnType = "add-liquidity";
      await dispatch(
        fetchPendingTxns({ txnHash: addLiquidityTx.hash, text, type: pendingTxnType })
      );
      await addLiquidityTx.wait();
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
      return;
    } finally {
      if (addLiquidityTx) {
        await dispatch(clearPendingTxn(addLiquidityTx.hash));
        await dispatch(calcXfhmDetails({ address, networkId }));
      }
    }
  }
);

export const calcAssetAmount = createAsyncThunk(
  "xfhm-lqdr/calcAssetAmount",
  async (
    { provider, address, networkId, value, action }: IXfhmActionValueAsyncThunk,
    { dispatch }
  ) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return 0;
    }

    const lqdrUsdbPolBondContract = new ethers.Contract(
      networks[networkId].addresses["LQDR_USDB_POL_BOND_DEPOSITORY_ADDRESS"] as string,
      lqdrUsdbPolBondDepositoryAbi,
      provider
    );
    let amount = 0;
    if (action === "calculate-xfhm") {
      amount = await lqdrUsdbPolBondContract["feeInXfhm"](value);
    }
    if (action === "calculate-lqdr") {
      amount = await lqdrUsdbPolBondContract["maxPrincipleAmount"](value);
    }
    return amount;
  }
);

export const payoutForUsdb = createAsyncThunk(
  "xfhm-lqdr/payoutForUsdb",
  async (
    { provider, address, networkId, value }: IXfhmValueAsyncThunk,
    { dispatch }
  ): Promise<number> => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return 0;
    }

    const lqdrUsdbPolBondContract = new ethers.Contract(
      networks[networkId].addresses["LQDR_USDB_POL_BOND_DEPOSITORY_ADDRESS"] as string,
      lqdrUsdbPolBondDepositoryAbi,
      provider
    );
    return await lqdrUsdbPolBondContract["payoutFor"](value);
  }
);

const setDetailState = (state: IXfhmSlice, payload: IXfhmDetails) => {
  state.details = { ...state.details, ...payload };
};

const setAssetTokensState = (state: IXfhmSlice, payload: AssetToken[]) => {
  state.assetTokens = [...payload];
};

interface IXfhmSlice {
  details: IXfhmDetails | null;
  assetTokens: AssetToken[] | null;
  loading: boolean;
}

const initialState: IXfhmSlice = {
  loading: false,
  details: null,
  assetTokens: allAssetTokens,
};

const xfhmSlice = createSlice({
  name: "xfhm",
  initialState,
  reducers: {
    fetchXfhmSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(calcXfhmDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(calcXfhmDetails.fulfilled, (state, action) => {
        setDetailState(state, action.payload);
        state.loading = false;
      })
      .addCase(calcXfhmDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(calcAllAssetTokenDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(calcAllAssetTokenDetails.fulfilled, (state, action) => {
        if (!action.payload) return;
        setAssetTokensState(state, action.payload);
        state.loading = false;
      })
      .addCase(calcAllAssetTokenDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export const { fetchXfhmSuccess } = xfhmSlice.actions;

export const xfhmReducer = xfhmSlice.reducer;
export default xfhmSlice.reducer;
