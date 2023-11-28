import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IPendingTx {
  readonly txHash: string;
  readonly text: string;
  readonly type: string;
}

const initialState: Array<IPendingTx> = [];

const pendingTxSlice = createSlice({
  name: "pendingTransactions",
  initialState,
  reducers: {
    fetchPendingTxs(state, action: PayloadAction<IPendingTx>) {
      state.push(action.payload);
    },
    clearPendingTx(state, action: PayloadAction<string>) {
      const target = state.find((x: any) => x.txHash === action.payload);
      if (target) {
        state.splice(state.indexOf(target), 1);
      }
    },
  },
});

export const getBettingTypeText = (action: string) => {
  return action.toLowerCase() === "up" ? "Betting Up" : "Betting Down";
};

export const isPendingTxn = (pendingTransactions: IPendingTx[], type: string) => {
  return pendingTransactions.map((x: any) => x.type).includes(type);
};

export const txnButtonText = (
  pendingTransactions: IPendingTx[],
  type: string,
  defaultText: string
) => {
  return isPendingTxn(pendingTransactions, type) ? "Pending..." : defaultText;
};

export const txnButtonTextGeneralPending = (
  pendingTransactions: IPendingTx[],
  type: string,
  defaultText: string
) => {
  return pendingTransactions.length >= 1 ? "Pending..." : defaultText;
};

export const { fetchPendingTxs, clearPendingTx } = pendingTxSlice.actions;

export default pendingTxSlice.reducer;
