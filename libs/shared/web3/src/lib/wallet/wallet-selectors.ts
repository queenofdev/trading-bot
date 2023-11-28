import { createSelector } from "@reduxjs/toolkit";
import { BigNumber } from "ethers";
import { WalletState } from "./wallet-slice";

export type RootState = { wallet: WalletState };

export const selectErc20Balance = (state: RootState) => state.wallet.erc20Balance;
const selectErc20Allowances = (state: RootState) => state.wallet.erc20Allowance;

const selectErc20Allowance = (
  state: RootState,
  {
    walletAddress,
    erc20TokenAddress,
  }: { walletAddress: string; erc20TokenAddress: string }
) => ({
  walletAddress,
  erc20TokenAddress,
});
export const selectErc20AllowanceByAddress = createSelector(
  selectErc20Allowances,
  selectErc20Allowance,
  (erc20Allowance, { walletAddress, erc20TokenAddress }): BigNumber =>
    typeof erc20Allowance[`${walletAddress}:::${erc20TokenAddress.toLowerCase()}`] !==
    undefined
      ? erc20Allowance[`${walletAddress}:::${erc20TokenAddress.toLowerCase()}`]
      : BigNumber.from(0)
);

const selectErc20BalanceAddress = (state: RootState, address: string) => address;
export const selectErc20BalanceByAddress = createSelector(
  selectErc20Balance,
  selectErc20BalanceAddress,
  (balances, address) => {
    if (typeof balances[address] === undefined) {
      return BigNumber.from(0);
    } else {
      return balances[address];
    }
  }
);
