import { BigNumber, ethers } from "ethers";
import { addresses } from "../constants";
import {
  ierc20Abi,
  usdbContractAbi as usdbAbi,
  daiContractAbi as daiAbi,
  masterChefAbi as masterchefAbi,
  usdbNftAbi,
  sOhmAbi,
} from "../abi";
import { setAll, trim } from "../helpers";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  IApprovePoolAsyncThunk,
  IBaseAddressAsyncThunk,
  IBaseAsyncThunk,
  ICalcAllUserBondDetailsAsyncThunk,
  ICalcUserBondDetailsAsyncThunk,
  IUsdbNftInfoAsyncThunk,
  IUsdbNftListAsyncThunk,
  IUsdbNftRedeemAsyncThunk,
} from "./interfaces";
import { chains } from "../providers";
import { BondAction, BondType, PaymentToken } from "../lib/bond";
import { findOrLoadMarketPrice } from "./bond-slice";
import { truncateDecimals } from "@fantohm/shared-helpers";
import { error, info } from "./messages-slice";

export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkId }: IBaseAddressAsyncThunk) => {
    if (!address || !networkId) {
      return {
        balances: {
          dai: 0,
          fhm: 0,
          usdb: 0,
        },
      };
    }
    const provider = await chains[networkId].provider;
    const daiContract = new ethers.Contract(
      addresses[networkId]["DAI_ADDRESS"] as string,
      daiAbi,
      provider
    );
    const fhmContract = new ethers.Contract(
      addresses[networkId]["OHM_ADDRESS"] as string,
      ierc20Abi,
      provider
    );
    // let daiBalance: any;
    // let fhmBalance: any;
    // const getDai = new Promise((resolve, reject) => {
    //   resolve(daiContract['balanceOf'](address));
    // });
    // const getFhm = new Promise((resolve, reject) => {
    //   resolve(daiContract['balanceOf'](address));
    // });
    // await Promise.all([getDai, getFhm])
    //   .then((res) => {
    //     console.log('ressssss: ', res);
    //     daiBalance = res[0];
    //     fhmBalance = res[1];
    //   })
    //   .catch((err) => console.log(err));
    const daiBalance = await daiContract["balanceOf"](address);
    const fhmBalance = await fhmContract["balanceOf"](address);

    let usdbBalance = 0;
    if (addresses[networkId]["USDB_ADDRESS"]) {
      const usdbContract = new ethers.Contract(
        addresses[networkId]["USDB_ADDRESS"] as string,
        usdbAbi,
        provider
      );
      usdbBalance = await usdbContract["balanceOf"](address);
    }
    return {
      balances: {
        dai: ethers.utils.formatUnits(daiBalance, 18),
        fhm: ethers.utils.formatUnits(fhmBalance, 9),
        usdb: ethers.utils.formatUnits(usdbBalance, 18),
      },
    };
  }
);

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkId, address }: IBaseAddressAsyncThunk, { dispatch }) => {
    const provider = await chains[networkId].provider;

    const daiContract = new ethers.Contract(
      addresses[networkId]["DAI_ADDRESS"] as string,
      daiAbi,
      provider
    );

    const daiBalance = await daiContract["balanceOf"](address);
    let usdbBalance = 0;
    if (networkId === 250) {
      const usdbContract = new ethers.Contract(
        addresses[networkId]["USDB_ADDRESS"] as string,
        usdbAbi,
        provider
      );
      usdbBalance = await usdbContract["balanceOf"](address);
    }

    return {
      balances: {
        dai: ethers.utils.formatUnits(daiBalance, 18),
        fhm: ethers.utils.formatUnits(0, 18),
        usdb: ethers.utils.formatUnits(usdbBalance, 18),
      },
    };
  }
);

export interface IUserBond {
  interestDue: number;
  amount: string;
  rewards: string;
  rewardToken: PaymentToken;
  rewardsInUsd: string;
  bondMaturationBlock: number;
  maturationSeconds: number;
  secondsToVest: number;
  pendingPayout: string; //Payout formatted in gwei.
  percentVestedFor: number;
  lpTokenAmount: string;
  iLBalance: string;
  pendingFHM: string;
  pricePaid: number;
}

export interface IUserBondDetails {
  allowance: number;
  userBonds: IUserBond[];
  readonly paymentToken: PaymentToken;
  readonly bondAction: BondAction;
}

export interface INftItemDetails {
  gonsPayout: number;
  fhmPayout: number;
  usdbAmount: number;
  vesting: number;
  lastBlock: number;
  vestingSeconds: number;
  lastTimestamp: number;
  pricePaid: number;
  secondsToVest: number;
  sFhmBalance: number;
}

export const calculateAllUserBondDetails = createAsyncThunk(
  "account/calculateAllUserBondDetails",
  async (
    { address, allBonds, networkId }: ICalcAllUserBondDetailsAsyncThunk,
    { dispatch }
  ) => {
    await Promise.allSettled(
      allBonds
        .filter((bond) => bond.name !== "stakeNft" && bond.name !== "usdbNft")
        .map((bond) => dispatch(calculateUserBondDetails({ address, bond, networkId })))
    );
  }
);

export const calculateUserBondDetails = createAsyncThunk(
  "account/calculateUserBondDetails",
  async ({ address, bond, networkId }: ICalcUserBondDetailsAsyncThunk, { dispatch }) => {
    if (!address) {
      return {
        bond: "",
        displayName: "",
        bondIconSvg: "",
        isLP: false,
        allowance: 0,
        balance: "0",
        userBonds: [
          {
            amount: "0",
            rewards: "0",
            rewardToken: PaymentToken.USDB,
            rewardsInUsd: "0",
            interestDue: 0,
            bondMaturationBlock: 0,
            maturationSeconds: 0,
            secondsToVest: 0,
            pendingPayout: "",
            percentVestedFor: 0,
            lpTokenAmount: "0",
            iLBalance: "0",
            pendingFHM: "0",
            pricePaid: 0,
          },
        ],
        paymentToken: bond.paymentToken,
        bondAction: bond.bondAction,
      };
    }
    const provider = await chains[networkId].provider;

    // Contracts
    const bondContract = await bond.getContractForBond(networkId);
    const reserveContract = await bond.getContractForReserve(networkId);

    const orgPaymentTokenDecimals = 18;
    const paymentTokenDecimals = bond.paymentToken === PaymentToken.USDB ? 18 : 9;

    const [allowance, balance] = await Promise.all([
      reserveContract["allowance"](address, bond.getAddressForBond(networkId)),
      reserveContract["balanceOf"](address),
    ]).then(([allowance, balance]) => [
      allowance,
      // balance should NOT be converted to a number. it loses decimal precision
      ethers.utils.formatUnits(balance, bond.isLP ? 18 : bond.decimals),
    ]);

    if (bond.type === BondType.TRADFI) {
      const bondLength = Number(await bondContract["bondlength"](address));
      const userBonds: IUserBond[] = await Promise.all(
        [...Array(bondLength).keys()].map(async (bondIndex) => {
          const [bondDetails, pendingPayout, percentVestedFor] = await Promise.all([
            bondContract["bondInfo"](address, bondIndex),
            bondContract["pendingPayoutFor"](address, bondIndex),
            bondContract["percentVestedFor"](address, bondIndex),
          ]).then(([bondDetails, pendingPayout, percentVestedFor]) => [
            bondDetails,
            ethers.utils.formatUnits(pendingPayout, paymentTokenDecimals),
            Number(percentVestedFor.div(BigNumber.from("100"))),
          ]);
          // console.log(`bondDetails ${bondDetails}`);
          // console.log(`pendingPayout ${pendingPayout}`);
          // console.log(`percentVestedFor ${percentVestedFor}`);
          const interestDue = bondDetails.payout / Math.pow(10, paymentTokenDecimals);
          const bondMaturationBlock = +bondDetails.vesting + +bondDetails.lastBlock;
          const pricePaid = bondDetails.pricePaid / Math.pow(10, paymentTokenDecimals);
          const payout = ethers.utils.formatUnits(
            bondDetails.payout,
            paymentTokenDecimals
          );
          const rewards = trim(interestDue * (1 - pricePaid), 2);
          const amount = trim(Number(payout) * pricePaid, 2);

          const latestBlockNumber = await provider.getBlockNumber();

          // TODO: Move this function to a helper or other.
          // sometimes getBlock fails
          const getLatestBlock = async (): Promise<ethers.providers.Block> => {
            let block = undefined;
            block = await provider.getBlock(latestBlockNumber);
            if (block) {
              return block;
            } else {
              //console.log("~~~~~RETRYING GETLATESTBLOCK~~~~~");
              await new Promise((r) => setTimeout(r, 500));
              return getLatestBlock();
            }
          };
          const latestBlock = await getLatestBlock();

          // console.log(bondDetails);
          // console.log(latestBlock);
          const latestBlockTimestamp = latestBlock.timestamp;
          const maturationSeconds =
            Number(bondDetails["vestingSeconds"]) + Number(bondDetails["lastTimestamp"]);
          const secondsToVest = maturationSeconds - latestBlockTimestamp;
          // console.log(`maturationSeconds ${maturationSeconds}`);
          // console.log(`vestingSeconds ${secondsToVest}`);

          return {
            amount,
            rewards,
            rewardToken: PaymentToken.USDB,
            rewardsInUsd: rewards,
            interestDue,
            bondMaturationBlock,
            maturationSeconds,
            secondsToVest,
            pendingPayout,
            percentVestedFor,
            lpTokenAmount: "0",
            iLBalance: "0",
            pendingFHM: "0",
            pricePaid: pricePaid,
          };
        })
      );

      return {
        bond: bond.name,
        displayName: bond.displayName,
        bondIconSvg: bond.bondIconSvg,
        isLP: bond.isLP,
        allowance,
        balance,
        userBonds,
        paymentToken: bond.paymentToken,
        bondAction: bond.bondAction,
      };
    } else if (bond.type === BondType.BOND_USDB) {
      const [bondDetails, pendingPayout, percentVestedFor] = await Promise.all([
        bondContract["bondInfo"](address),
        bondContract["pendingPayoutFor"](address),
        bondContract["percentVestedFor"](address),
      ]).then(([bondDetails, pendingPayout, percentVestedFor]) => [
        bondDetails,
        ethers.utils.formatUnits(pendingPayout, paymentTokenDecimals),
        Number(percentVestedFor.div(BigNumber.from("100"))),
      ]);

      const payout = Number(
        ethers.utils.formatUnits(bondDetails.payout, orgPaymentTokenDecimals)
      );
      const pricePaid = Number(
        ethers.utils.formatUnits(bondDetails.pricePaid, orgPaymentTokenDecimals)
      );

      const amount = payout * pricePaid;
      const rewards = pendingPayout - amount;
      const bondMaturationBlock =
        Number(bondDetails["vesting"]) + Number(bondDetails["lastBlock"]);

      // TODO: If extended bonding with discounts is wanted we need to calculate
      // the estimated time until completion
      const userBonds =
        Number(amount) > 0.01
          ? [
            {
              amount: amount.toString(), // TODO can we just assume lp is totally balanced?
              rewards: rewards.toString(),
              rewardToken: PaymentToken.USDB,
              rewardsInUsd: rewards.toString(),
              interestDue: 0,
              bondMaturationBlock,
              pendingPayout,
              secondsToVest: 0,
              maturationSeconds: 0,
              percentVestedFor, // No such thing as percentVestedFor for single sided
              lpTokenAmount: "0",
              iLBalance: "0",
              pendingFHM: "0",
              pricePaid: Number(ethers.utils.formatUnits(bondDetails["pricePaid"])),
            } as IUserBond,
          ]
          : [];

      return {
        bond: bond.name,
        displayName: bond.displayName,
        bondIconSvg: bond.bondIconSvg,
        isLP: bond.isLP,
        allowance,
        balance,
        userBonds,
        paymentToken: bond.paymentToken,
        bondAction: bond.bondAction,
      };
    }

    // Contract Interactions
    const [bondDetails, pendingPayout, fhmMarketPrice] = await Promise.all([
      bondContract["bondInfo"](address),
      bondContract["pendingPayoutFor"](address),
      dispatch(findOrLoadMarketPrice({ networkId: networkId })).unwrap(),
    ]).then(([bondDetails, pendingPayout, fhmMarketPrice]) => [
      bondDetails,
      ethers.utils.formatUnits(pendingPayout, paymentTokenDecimals),
      fhmMarketPrice?.marketPrice || 0,
    ]);
    // console.log(`bondDetails ${bondDetails}`);
    // console.log(`pendingPayout ${pendingPayout}`);
    // console.log(`fhmMarketPrice ${fhmMarketPrice}`);
    const interestDue = bondDetails.payout / Math.pow(10, orgPaymentTokenDecimals);
    // console.log(`interestDue ${interestDue}`);
    const bondMaturationBlock = +bondDetails.vesting + +bondDetails.lastBlock;
    // console.log(`bondMaturationBlock ${bondMaturationBlock}`);
    let pendingFHM = "0";
    let iLBalance = "0";
    let lpTokenAmount = "0";
    let secondsToVest = 0;
    let maturationSeconds = 0;
    if (bond.type === BondType.SINGLE_SIDED || bond.type === BondType.SINGLE_SIDED_V1) {
      const masterchefContract = new ethers.Contract(
        addresses[networkId]["MASTERCHEF_ADDRESS"],
        masterchefAbi,
        provider
      );
      const fhmRewards = await masterchefContract["pendingFhm"](0, address);

      pendingFHM = ethers.utils.formatUnits(fhmRewards, 9);
      iLBalance = ethers.utils.formatUnits(bondDetails.ilProtectionAmountInUsd, 9);
      lpTokenAmount = ethers.utils.formatUnits(
        bondDetails.lpTokenAmount,
        orgPaymentTokenDecimals
      );
      // Single sided are always available to unstake
      maturationSeconds = Number(bondDetails["lastTimestamp"]);
      secondsToVest = 0;
    }
    const payout = Number(
      ethers.utils.formatUnits(bondDetails.payout, orgPaymentTokenDecimals)
    );
    const pricePaid = Number(
      ethers.utils.formatUnits(bondDetails.pricePaid, orgPaymentTokenDecimals)
    );
    const amount = payout * pricePaid;
    const rewardsInUsd = Number(pendingFHM) * fhmMarketPrice;
    const userBonds =
      Number(amount) > 0.01
        ? [
          {
            amount: amount.toString(), // TODO can we just assume lp is totally balanced?
            rewards: pendingFHM,
            rewardToken: PaymentToken.FHM,
            rewardsInUsd: rewardsInUsd.toString(),
            interestDue,
            bondMaturationBlock,
            pendingPayout,
            secondsToVest,
            maturationSeconds,
            percentVestedFor: 0, // No such thing as percentVestedFor for single sided
            lpTokenAmount,
            iLBalance,
            pendingFHM,
            pricePaid: 1,
          },
        ]
        : [];
    return {
      bond: bond.name,
      displayName: bond.displayName,
      bondIconSvg: bond.bondIconSvg,
      isLP: bond.isLP,
      allowance,
      balance,
      userBonds,
      paymentToken: bond.paymentToken,
      bondAction: bond.bondAction,
    };
  }
);

export const getUserBondApproval = createAsyncThunk(
  "account/getUserBondApproval",
  async (
    { nftId, address, bond, networkId, callback }: IApprovePoolAsyncThunk,
    { dispatch }
  ) => {
    if (bond.type === BondType.STAKE_NFT) {
      const provider = await chains[networkId].provider;
      const usdbNftContract = new ethers.Contract(
        addresses[networkId]["USDB_NFT_ADDRESS"] as string,
        usdbNftAbi,
        provider
      );
      const bondAddr = bond.getAddressForBond(networkId);
      const addr = await usdbNftContract["getApproved"](nftId);
      const allowance = addr === bondAddr ? 1 : 0;
      callback && callback(allowance);
    }
  }
);

export const getNftList = createAsyncThunk(
  "account/getNftList",
  async ({ address, networkId, callback }: IUsdbNftListAsyncThunk) => {
    if (!networkId) {
      return null;
    }
    const provider = await chains[networkId].provider;
    const usdbNftContract = new ethers.Contract(
      addresses[networkId]["USDB_NFT_ADDRESS"] as string,
      usdbNftAbi,
      provider
    );
    let nftIds = await usdbNftContract["getTokenIds"](address);
    nftIds = nftIds.map((id: any) => Number(id));
    callback(nftIds);

    return {
      nfts: nftIds,
    };
  }
);

export const getNftInfo = createAsyncThunk(
  "account/getNftInfo",
  async ({ id, networkId, callback }: IUsdbNftInfoAsyncThunk) => {
    if (!networkId) {
      return null;
    }
    const provider = await chains[networkId].provider;
    const usdbNftContract = new ethers.Contract(
      addresses[networkId]["USDB_NFT_ADDRESS"] as string,
      usdbNftAbi,
      provider
    );
    const nftInfo = await usdbNftContract["_nftInfo"](id);

    const latestBlockNumber = await provider.getBlockNumber();
    const getLatestBlock = async (): Promise<ethers.providers.Block> => {
      let block = undefined;
      block = await provider.getBlock(latestBlockNumber);
      if (block) {
        return block;
      } else {
        //console.log("~~~~~RETRYING GETLATESTBLOCK~~~~~");
        await new Promise((r) => setTimeout(r, 500));
        return getLatestBlock();
      }
    };
    const latestBlock = await getLatestBlock();

    const nftDetails: INftItemDetails = {
      gonsPayout: Number(nftInfo.gonsPayout),
      fhmPayout: Number(nftInfo.fhmPayout),
      usdbAmount: Number(ethers.utils.formatEther(nftInfo.usdbAmount)),
      vesting: Number(nftInfo.vesting),
      lastBlock: Number(nftInfo.lastBlock),
      vestingSeconds: Number(nftInfo.vestingSeconds),
      lastTimestamp: Number(nftInfo.lastTimestamp),
      pricePaid: Number(ethers.utils.formatEther(nftInfo.pricePaid)),
      secondsToVest: 0,
      sFhmBalance: 0,
    };

    const latestBlockTimestamp = latestBlock.timestamp;
    const maturationSeconds =
      Number(nftDetails.vestingSeconds) + Number(nftDetails.lastTimestamp);
    nftDetails.secondsToVest = maturationSeconds - latestBlockTimestamp;

    const sFantohmContract = new ethers.Contract(
      addresses[networkId]["SOHM_ADDRESS"] as string,
      sOhmAbi,
      provider
    );
    const sFhmBalance = await sFantohmContract["balanceForGons"](nftInfo.gonsPayout);
    nftDetails.sFhmBalance = Number(ethers.utils.formatUnits(sFhmBalance, 9));

    callback(nftDetails);

    return {
      nfts: {
        [id]: nftDetails,
      },
    };

    // let usdbBalance = 0;
    // if (addresses[networkId]["USDB_ADDRESS"]) {
    //   const usdbContract = new ethers.Contract(
    //     addresses[networkId]["USDB_ADDRESS"] as string,
    //     usdbAbi,
    //     provider
    //   );
    //   usdbBalance = await usdbContract["balanceOf"](address);
    // }
    // return {
    //   balances: {
    //     dai: ethers.utils.formatUnits(daiBalance, 18),
    //     fhm: ethers.utils.formatUnits(fhmBalance, 9),
    //     usdb: ethers.utils.formatUnits(usdbBalance, 18),
    //   },
    // };
  }
);

export const redeemNft = createAsyncThunk(
  "account/redeemNft",
  async (
    { nftId, address, networkId, provider }: IUsdbNftRedeemAsyncThunk,
    { dispatch }
  ) => {
    if (!networkId) {
      return;
    }
    const signer = provider.getSigner(address);
    const usdbNftContract = new ethers.Contract(
      addresses[networkId]["USDB_NFT_ADDRESS"] as string,
      usdbNftAbi,
      signer
    );
    try {
      const result = await usdbNftContract["withdraw"](nftId, address);
      dispatch(info("Redeem NFT completed."));
    } catch (e: any) {
      console.log(e);
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
  }
);

export const getNftTokenUri = createAsyncThunk(
  "account/getNftTokenUri",
  async ({ id, networkId, callback }: IUsdbNftInfoAsyncThunk) => {
    if (!networkId) {
      return null;
    }
    const provider = await chains[networkId].provider;
    const usdbNftContract = new ethers.Contract(
      addresses[networkId]["USDB_NFT_ADDRESS"] as string,
      usdbNftAbi,
      provider
    );
    let tokenId = id;
    if (tokenId === -1) tokenId = await usdbNftContract["totalSupply"]();
    const base64Metadata = await usdbNftContract["tokenURI"](tokenId);
    const json = atob(base64Metadata.substring(29));
    const metadata = JSON.parse(json);
    metadata.tokenId = Number(tokenId);
    callback(metadata);
    return {};
  }
);

interface IAccountSlice {
  bonds: { [key: string]: IUserBondDetails };
  balances: {
    usdb: string;
    dai: string;
    fhm: string;
  };
  loading: boolean;
  allBondsLoaded: boolean;
  nfts: { [key: number]: INftItemDetails };
}

const initialState: IAccountSlice = {
  loading: false,
  allBondsLoaded: false,
  bonds: {},
  balances: { usdb: "", dai: "", fhm: "" },
  nfts: {},
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAccountDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getBalances.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(calculateUserBondDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
        //PayloadAction<IBondDetails>
        if (!action.payload) return;
        const bond = action.payload.bond;
        state.bonds[bond] = action.payload;
        state.loading = false;
      })
      .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(calculateAllUserBondDetails.fulfilled, (state, action) => {
        state.allBondsLoaded = true;
      });
  },
});

export const accountReducer = accountSlice.reducer;
export const { fetchAccountSuccess } = accountSlice.actions;
