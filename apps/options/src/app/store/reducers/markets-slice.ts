import { ethers } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";
import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import { RootState } from "../index";
import { MarketData } from "../../core/types/market.types";
import { desiredNetworkId, BINARY_ADDRESSES } from "../../core/constants/network";
import BinaryMarketManagerABI from "../../core/abi/BinaryMarketManagerABI.json";

export interface MarketManagerData {
  readonly isLoading: "unknown" | "pending" | "ready" | "failed";
  markets: MarketData[];
}

export interface MarketsAsyncThunk {
  readonly provider: JsonRpcProvider;
}

const initialState: MarketManagerData = {
  isLoading: "unknown",
  markets: [],
};

export const loadMarkets = createAsyncThunk(
  "markets/loadMarkets",
  async ({ provider }: MarketsAsyncThunk) => {
    const binaryMarketManagerContract = new ethers.Contract(
      BINARY_ADDRESSES[desiredNetworkId].MARKET_MANAGER_ADDRESS,
      BinaryMarketManagerABI,
      provider?.getSigner()
    );
    //TODO: change to get all Markets after inputting all `getAllMarkets` func in SC.
    // type: const markets = binaryMarketManagerContract["getAllMarkets"]();
    const markets: MarketData = binaryMarketManagerContract["allMarkets"](0);
    return markets;
  }
);

const marketsSlice = createSlice({
  name: "markets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadMarkets.pending, (state) => {
      state.isLoading = "pending";
    });
    builder.addCase(loadMarkets.fulfilled, (state, action: PayloadAction<MarketData>) => {
      state.isLoading = "ready";
      state.markets[0] = action.payload;
    });
    builder.addCase(loadMarkets.rejected, (state) => {
      state.isLoading = "failed";
    });
  },
});

const baseInfo = (state: RootState) => state.markets;

export const marketsReducer = marketsSlice.reducer;
export const getMarketsState = createSelector(baseInfo, (markets) => markets);
