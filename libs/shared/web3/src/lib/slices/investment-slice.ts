import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { ICalcInvestmentDetailsAsyncThunk } from "./interfaces";

export interface IInvestmentDetails {
  investment: string;
  assetPrice: number;
  assetBalance: number;
  treasuryBalance: number;
  isLpToken: boolean;
}
export const calcInvestmentDetails = createAsyncThunk(
  "investments/calcInvestmentDetails",
  async (
    { investment }: ICalcInvestmentDetailsAsyncThunk,
    { dispatch }
  ): Promise<IInvestmentDetails> => {
    // Calculate investments treasuryBalance
    const [assetPrice, assetBalance, treasuryBalance] = await Promise.all([
      investment.assetPrice,
      investment.assetBalance,
      investment.treasuryBalance,
    ]);

    return {
      investment: investment.name,
      assetPrice,
      assetBalance,
      treasuryBalance,
      isLpToken: investment.isLp,
    };
  }
);

// Note(zx): this is a barebones interface for the state. Update to be more accurate
interface IInvestmentsSlice {
  status: string;
  [key: string]: any;
}

const setInvestmentsState = (state: IInvestmentsSlice, payload: any) => {
  const investment = payload.investment;
  const newState = { ...state[investment], ...payload };
  state[investment] = newState;
  state["loading"] = false;
};

const initialState: IInvestmentsSlice = {
  status: "idle",
};

const investmentsSlice = createSlice({
  name: "investments",
  initialState,
  reducers: {
    fetchInvestmentsSuccess(state, action) {
      state[action.payload.investment] = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(calcInvestmentDetails.pending, (state) => {
        state["loading"] = true;
      })
      .addCase(calcInvestmentDetails.fulfilled, (state, action) => {
        setInvestmentsState(state, action.payload);
        state["loading"] = false;
      })
      .addCase(calcInvestmentDetails.rejected, (state, { error }) => {
        state["loading"] = false;
        console.error(error.message);
      });
  },
});

export const investmentsReducer = investmentsSlice.reducer;

export const { fetchInvestmentsSuccess } = investmentsSlice.actions;
