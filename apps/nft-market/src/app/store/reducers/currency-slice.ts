import { isDev, NetworkIds } from "@fantohm/shared-web3";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  currencyInfo,
  erc20Currency,
  Erc20Currency,
  getErc20CurrencyFromAddress,
} from "../../helpers/erc20Currency";
import { BackendLoadingStatus } from "../../types/backend-types";
import { RootState } from "../index";

export const loadCurrencyFromId = createAsyncThunk(
  "currency/loadCurrency",
  async (tokenId: string, { getState }) => {
    const state: RootState = getState() as RootState;
    if (
      state.currency.currencies[tokenId] &&
      state.currency.currencies[tokenId].lastPriceLoadedAt < Date.now() - 300 * 1000
    ) {
      // exists but expired cache
      state.currency.currencies[tokenId].getCurrentPrice();
      await state.currency.currencies[tokenId].wait();
      return state.currency.currencies[tokenId];
    } else if (
      state.currency.currencies[tokenId] &&
      state.currency.currencies[tokenId].lastPriceLoadedAt > Date.now() - 300 * 1000
    ) {
      // exists cache still valid
      return state.currency.currencies[tokenId];
    }
    // doesn't exist, load new
    const currentCurrency = new erc20Currency(tokenId);
    await currentCurrency.wait(); // wait for the price to update
    return currentCurrency;
  }
);

export const loadCurrencyFromAddress = createAsyncThunk(
  "currency/loadCurrencyFromAddress",
  async (address: string, { getState }) => {
    try {
      const currentCurrency = getErc20CurrencyFromAddress(address);
      await currentCurrency.wait();
      return currentCurrency;
    } catch (err) {
      console.warn("Invalid currency address, using USDB as backup");
      const state: RootState = getState() as RootState;
      if (state.currency.currencies["USDB_ADDRESS"]) {
        return state.currency.currencies["USDB_ADDRESS"];
      }
      const fallbackCurrency = new erc20Currency("USDB_ADDRESS");
      await fallbackCurrency.wait();
      return fallbackCurrency;
    }
  }
);

export type CurrencyList = {
  [tokenId: string]: Erc20Currency;
};

export type CurrencyState = {
  [tokenId: string]: BackendLoadingStatus;
};

interface CurrencyData {
  readonly currencies: CurrencyList;
  readonly currencyState: CurrencyState;
}

const getInitialCurrencyState = (): CurrencyData => {
  let currencies = {} as CurrencyList;
  let currencyState = {} as CurrencyState;

  const network = isDev ? NetworkIds.Goerli : NetworkIds.Ethereum;

  Object.entries(currencyInfo).forEach(([tokenId, info]) => {
    if (info.addresses[network]) {
      currencyState = {
        ...currencyState,
        ...{ [tokenId]: BackendLoadingStatus.succeeded },
      };
      currencies = {
        ...currencies,
        ...{ [tokenId]: new erc20Currency(tokenId) },
      };
    }
  });

  return {
    currencies,
    currencyState,
  };
};

const initialState: CurrencyData = getInitialCurrencyState();

const currencySlice = createSlice({
  name: "currencySlice",
  initialState,
  reducers: {
    resetCurrency: (state) => {
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadCurrencyFromId.pending, (state, action) => {
      state.currencyState = {
        ...state.currencyState,
        ...{ [action.meta.arg]: BackendLoadingStatus.loading },
      };
    });
    builder.addCase(loadCurrencyFromId.rejected, (state, action) => {
      state.currencyState = {
        ...state.currencyState,
        ...{ [action.meta.arg]: BackendLoadingStatus.failed },
      };
    });
    builder.addCase(
      loadCurrencyFromId.fulfilled,
      (state, action: PayloadAction<Erc20Currency>) => {
        state.currencyState = {
          ...state.currencyState,
          ...{ [action.payload.tokenId]: BackendLoadingStatus.succeeded },
        };
        state.currencies = {
          ...state.currencies,
          ...{ [action.payload.tokenId]: action.payload },
        };
      }
    );
    builder.addCase(loadCurrencyFromAddress.pending, (state, action) => {
      state.currencyState = {
        ...state.currencyState,
        ...{ [action.meta.arg]: BackendLoadingStatus.loading },
      };
    });
    builder.addCase(loadCurrencyFromAddress.rejected, (state, action) => {
      state.currencyState = {
        ...state.currencyState,
        ...{ [action.meta.arg]: BackendLoadingStatus.failed },
      };
    });
    builder.addCase(
      loadCurrencyFromAddress.fulfilled,
      (state, action: PayloadAction<Erc20Currency>) => {
        state.currencyState = {
          ...state.currencyState,
          ...{ [action.payload.tokenId]: BackendLoadingStatus.succeeded },
        };
        state.currencies = {
          ...state.currencies,
          ...{ [action.payload.tokenId]: action.payload },
        };
      }
    );
  },
});

export const currencyReducer = currencySlice.reducer;
export const { resetCurrency } = currencySlice.actions;
