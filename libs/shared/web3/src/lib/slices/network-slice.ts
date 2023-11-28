import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { BigNumber, ethers } from "ethers";
import { NetworkId, networks } from "../networks";
import { chains } from "../providers";
import { IBaseAsyncThunk } from "./interfaces";
import {
  olympusStakingv2Abi as OlympusStakingv2,
  sOhmAbi as sOHM,
  sOhmv2Abi as sOHMv2,
  circulatingSupplyContractAbi as CirculatingSupplyContract,
} from "../abi";
import { getMarketPrice, getTokenPrice } from "../helpers";

export interface INetworkDetails {
  readonly networkId: NetworkId;
  readonly circSupply: number;
  readonly currentIndex: string;
  readonly currentBlock: number;
  readonly fiveDayRate: number;
  readonly marketCap: number;
  readonly marketPrice: number;
  readonly stakingAPY: number;
  readonly stakingRebase: number;
  readonly stakingTVL: number;
  readonly totalSupply: number;
  readonly treasuryBalance: number;
  readonly treasuryMarketValue: number;
  readonly stakingRewardFHM: number;
  readonly stakingCircSupply: number;
  readonly secondsPerEpoch: number;
  readonly endBlock: number;
  readonly epochNumber: number;
}

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
const findOrLoadMarketPrice = createAsyncThunk(
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

export const loadNetworkDetails = createAsyncThunk(
  "networks/loadNetworkDetails",
  async ({ networkId }: IBaseAsyncThunk, { dispatch }): Promise<INetworkDetails> => {
    const provider = await chains[networkId].provider;
    const addresses = networks[networkId].addresses;

    const treasuryMarketValue = 0; // TODO remove

    // Contracts
    const circSupplyContract = new ethers.Contract(
      addresses["CIRCULATING_SUPPLY_ADDRESS"] as string,
      CirculatingSupplyContract,
      provider
    );
    const sfhmMainContract = new ethers.Contract(
      addresses["SOHM_ADDRESS"] as string,
      sOHMv2,
      provider
    );
    const fhmContract = new ethers.Contract(
      addresses["OHM_ADDRESS"] as string,
      sOHM,
      provider
    );
    const stakingContract = new ethers.Contract(
      addresses["STAKING_ADDRESS"] as string,
      OlympusStakingv2,
      provider
    );

    const indexDivider = networkId == 250 || networkId == 4002 ? 17 : 1; // for Fantom /17

    // Contract interactions
    const [
      marketPrice,
      daoSfhmBalance,
      epoch,
      originalStakingCircSupply,
      totalSupply,
      circSupply,
      currentIndex,
    ] = await Promise.all([
      dispatch(findOrLoadMarketPrice({ networkId: networkId })).unwrap(),
      0,
      0,
      0,
      0,
      0,
      0,
    ]).then(
      ([
        marketPrice,
        daoSfhmBalance,
        epoch,
        originalStakingCircSupply,
        totalSupply,
        fhmCircSupply,
        stakingIndex,
      ]) => [
        marketPrice?.marketPrice || 0,
        daoSfhmBalance / Math.pow(10, 9),
        epoch,
        originalStakingCircSupply / Math.pow(10, 9),
        totalSupply / Math.pow(10, 9),
        fhmCircSupply / Math.pow(10, 9),
        ethers.utils.formatUnits(
          BigNumber.from(String(stakingIndex)).div(indexDivider),
          "gwei"
        ),
      ]
    );
    // Calculations
    const distribute = epoch.distribute / Math.pow(10, 9);
    const marketCap = marketPrice * circSupply;
    const stakingCircSupply = originalStakingCircSupply - daoSfhmBalance;
    const stakingTVL = stakingCircSupply * marketPrice;
    const stakingRewardFHM = (distribute * stakingCircSupply) / originalStakingCircSupply;
    // const currentIndex = ethers.utils.formatUnits((await stakingContract.index())/indexDivider, "gwei")
    const currentBlock = await provider.getBlockNumber();
    const stakingRebase = stakingRewardFHM / originalStakingCircSupply;
    const secondsPerEpoch =
      networks[networkId].blocktime * networks[networkId].epochInterval;
    const endBlock = epoch.endBlock;
    const epochNumber = epoch.number;

    const rebasesPerDay = (24 * 60 * 60) / secondsPerEpoch;

    const fiveDayRate = Math.pow(1 + stakingRebase, 5 * rebasesPerDay) - 1;
    const stakingAPY = Math.pow(1 + stakingRebase, 365 * rebasesPerDay) - 1;

    return {
      networkId,
      currentIndex,
      currentBlock,
      fiveDayRate,
      stakingAPY,
      stakingTVL,
      stakingRebase,
      marketCap,
      marketPrice,
      circSupply,
      totalSupply,
      treasuryMarketValue,
      stakingRewardFHM,
      stakingCircSupply,
      secondsPerEpoch,
      endBlock,
      epochNumber,
    } as INetworkDetails;
  }
);

interface INetworksSlice {
  [key: number]: INetworkDetails;
}

const initialState: INetworksSlice = {};

const networksSlice = createSlice({
  name: "networks",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(loadNetworkDetails.fulfilled, (state, action) => {
        const networkId = action.payload.networkId;
        state[networkId] = action.payload;
      })
      .addCase(loadNetworkDetails.rejected, (state, { error }) => {
        console.error(error.message);
      });
  },
});

export const networkReducer = networksSlice.reducer;
