import { createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { balanceVaultManager } from "../abi";
import { addresses } from "../constants";
import {
  BalanceVaultLengthAsyncThunk,
  BalanceVaultManagerAsyncThunk,
} from "./interfaces";

export const getBalanceVaultManager = createAsyncThunk(
  "manager/getAllVaults",
  async ({
    networkId,
    provider,
    skip,
    limit,
    callback,
  }: BalanceVaultManagerAsyncThunk) => {
    if (!networkId) {
      return null;
    }
    const balanceVaultManagerContract = new ethers.Contract(
      addresses[networkId][`BALANCE_VAULT_MANAGER_ADDRESS`] as string,
      balanceVaultManager,
      provider
    );
    try {
      const vaults = await balanceVaultManagerContract["getGeneratedVaultsPage"](
        skip,
        limit
      );
      callback && callback(vaults);
    } catch (e) {
      //
    }

    return null;
  }
);
export const getGeneratedVaultsLength = createAsyncThunk(
  "length/VaultsLength",
  async ({ networkId, provider, callback }: BalanceVaultLengthAsyncThunk) => {
    if (!networkId) {
      return null;
    }
    const balanceVaultManagerContract = new ethers.Contract(
      addresses[networkId][`BALANCE_VAULT_MANAGER_ADDRESS`] as string,
      balanceVaultManager,
      provider
    );
    try {
      const vaultsLength = await balanceVaultManagerContract[
        "getGeneratedVaultsLength"
      ]();
      callback && callback(vaultsLength);
    } catch (e) {
      //
    }

    return null;
  }
);
