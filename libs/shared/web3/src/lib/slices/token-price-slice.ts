import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { ICalcTokenPriceAsyncThunk } from "./interfaces";
import { IHistoricPrices } from "../lib/investment";

export interface ITokenPriceDetails {
  tokenName: string;
  prices: IHistoricPrices;
}

export const fetchTokenPrice = createAsyncThunk(
  "tokenPrice/fetchPrice",
  // eslint-disable-next-line no-empty-pattern
  async ({ investment }: ICalcTokenPriceAsyncThunk, {}): Promise<ITokenPriceDetails> => {
    const prices = await investment.historicPrices;
    return {
      tokenName: investment.name,
      prices: prices,
    };
  }
);

// Note(zx): this is a barebones interface for the state. Update to be more accurate
interface ITokenPriceSlice {
  status: string;
  [key: string]: any;
}

const setTokenPricesState = (state: ITokenPriceSlice, payload: any) => {
  const tokenName = payload.tokenName;
  state[tokenName] = payload.prices;
};

const initialState: ITokenPriceSlice = {
  status: "idle",
};

const tokenPriceSlice = createSlice({
  name: "tokenPrices",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchTokenPrice.pending, (state) => {
        state["loading"] = true;
      })
      .addCase(fetchTokenPrice.fulfilled, (state, action) => {
        setTokenPricesState(state, action.payload);
        state["loading"] = false;
      })
      .addCase(fetchTokenPrice.rejected, (state, { error }) => {
        state["loading"] = false;
        console.error(error.message);
      });
  },
});

export const tokenPriceReducer = tokenPriceSlice.reducer;
