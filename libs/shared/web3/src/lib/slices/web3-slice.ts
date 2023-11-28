import { createSlice } from "@reduxjs/toolkit";

type Web3State = {
  walletConnected: boolean;
};

const initialState: Web3State = {
  walletConnected: false,
};

const web3Slice = createSlice({
  name: "web3",
  initialState,
  reducers: {
    setWalletConnected: (state, action) => {
      state.walletConnected = action.payload;
    },
  },
});

export const { setWalletConnected } = web3Slice.actions;

export const web3SliceReducer = web3Slice.reducer;
export default web3Slice.reducer;
