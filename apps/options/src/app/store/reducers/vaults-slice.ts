import { ethers } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";
import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import { RootState } from "../index";
import { VaultData } from "../../core/types/vault";
import { desiredNetworkId, BINARY_ADDRESSES } from "../../core/constants/network";
import BinaryVaultManagerABI from "../../core/abi/BinaryVaultManagerABI.json";

export interface VaultManagerData {
  readonly isLoading: "unknown" | "pending" | "ready" | "failed";
  vaults: VaultData[];
}

export interface VaultsAsyncThunk {
  readonly provider: JsonRpcProvider;
  readonly underlyingTokenAddress: string;
}

const initialState: VaultManagerData = {
  isLoading: "unknown",
  vaults: [],
};

export const loadVault = createAsyncThunk(
  "vaults/loadVault",
  async ({ provider, underlyingTokenAddress }: VaultsAsyncThunk) => {
    const binaryVaultManagerContract = new ethers.Contract(
      BINARY_ADDRESSES[desiredNetworkId].VAULT_MANAGER_ADDRESS,
      BinaryVaultManagerABI as ethers.ContractInterface,
      provider?.getSigner()
    );
    //TODO: change to get all Vaults after inputting all `getAllVaults` func in SC.
    // type: const vaults = binaryVaultsManagerContract["getAllVaults"]();
    const vault: VaultData = binaryVaultManagerContract["vaults"](underlyingTokenAddress);
    return vault;
  }
);

const vaultsSlice = createSlice({
  name: "vaults",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadVault.pending, (state) => {
      state.isLoading = "pending";
    });
    builder.addCase(loadVault.fulfilled, (state, action: PayloadAction<VaultData>) => {
      state.isLoading = "ready";
      state.vaults.push(action.payload);
    });
    builder.addCase(loadVault.rejected, (state) => {
      state.isLoading = "failed";
    });
  },
});

const baseInfo = (state: RootState) => state.vaults;

export const vaultsReducer = vaultsSlice.reducer;
export const getVaultsState = createSelector(baseInfo, (vaults) => vaults);
