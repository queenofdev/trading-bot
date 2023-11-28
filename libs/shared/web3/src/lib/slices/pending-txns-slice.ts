import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserBondDetails } from "./account-slice";

export interface IPendingTxn {
  readonly txnHash: string;
  readonly text: string;
  readonly type: string;
}

const initialState: Array<IPendingTxn> = [];

const pendingTxnsSlice = createSlice({
  name: "pendingTransactions",
  initialState,
  reducers: {
    fetchPendingTxns(state, action: PayloadAction<IPendingTxn>) {
      state.push(action.payload);
    },
    clearPendingTxn(state, action: PayloadAction<string>) {
      const target = state.find((x) => x.txnHash === action.payload);
      if (target) {
        state.splice(state.indexOf(target), 1);
      }
    },
  },
});

export const getStakingTypeText = (action: string) => {
  return action.toLowerCase() === "stake" ? "Staking FHM" : "UnStaking sFHM";
};

export const isPendingTxn = (pendingTransactions: IPendingTxn[], type: string) => {
  return pendingTransactions.map((x) => x.type).includes(type);
};

export const txnButtonText = (
  pendingTransactions: IPendingTxn[],
  type: string,
  defaultText: string
) => {
  return isPendingTxn(pendingTransactions, type) ? "Pending..." : defaultText;
};

export const isClaimable = (bond: IUserBondDetails) => {
  return bond.userBonds.some((userBond) => userBond.pendingPayout !== "0.0");
};

export const txnButtonTextGeneralPending = (
  pendingTransactions: IPendingTxn[],
  type: string,
  defaultText: string
) => {
  return isPendingTxn(pendingTransactions, type) ? "Pending..." : defaultText;
};

export const { fetchPendingTxns, clearPendingTxn } = pendingTxnsSlice.actions;

export const pendingTransactionsReducer = pendingTxnsSlice.reducer;
export default pendingTxnsSlice.reducer;
