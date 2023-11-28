import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  BackendLoadingStatus,
  LoginResponse,
  Notification,
  User,
} from "../../types/backend-types";
import { loadState } from "@fantohm/shared-web3";
import { BackendApi } from "../../api";
import { SignerAsyncThunk } from "./interfaces";

export type AssetLoadStatus = {
  assetId: string;
  status: BackendLoadingStatus;
};

type SignaturePayload = {
  signature: string;
  address: string;
  user: User;
};

export interface BackendData {
  readonly accountStatus: "unknown" | "pending" | "ready" | "failed";
  readonly status: "idle" | "loading" | "succeeded" | "failed";
  readonly loadAssetStatus: AssetLoadStatus[];
  readonly authSignature: string | null;
  readonly authorizedAccount: string;
  readonly notifications: Notification[] | null;
  readonly user: User;
}

/*
authorizeAccount: generates user account if non existant
  requests signature to create bearer token
params:
- networkId: number
- address: string
- provider: JsonRpcProvider
returns: void
*/
export const authorizeAccount = createAsyncThunk(
  "backend/authorizeAccount",
  async (
    { address, networkId, provider, onFailed }: SignerAsyncThunk,
    { rejectWithValue }
  ) => {
    const loginResponse: LoginResponse = await BackendApi.doLogin(address);
    if (loginResponse.id) {
      const signature = await BackendApi.handleSignMessage(address, provider);
      if (!signature) {
        if (onFailed) onFailed();
        return rejectWithValue("Login Failed");
      }
      let addr: string = localStorage.getItem("sign") || "";
      addr += address + "|" + signature + " ";
      localStorage.setItem("sign", addr);
      return { signature, address, user: loginResponse };
    } else {
      return rejectWithValue("Login Failed");
    }
  }
);

// initial wallet slice state
const previousState = loadState("backend");
const initialState: BackendData = {
  authSignature: null,
  authorizedAccount: null,
  user: {} as User,
  ...previousState,
  accountStatus: "unknown",
  status: "idle",
  loadAssetStatus: [],
};

// create slice and initialize reducers
const backendSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    logout: (state) => {
      state.authSignature = null;
      state.authorizedAccount = "";
      state.accountStatus = "unknown";
      state.user = {} as User;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(authorizeAccount.pending, (state, action) => {
      state.accountStatus = "pending";
    });
    builder.addCase(
      authorizeAccount.fulfilled,
      (state, action: PayloadAction<SignaturePayload | undefined>) => {
        if (action.payload) {
          state.accountStatus = "ready";
          state.authSignature = action.payload.signature;
          state.authorizedAccount = action.payload.address;
          state.user = action.payload.user;
        }
      }
    );
    builder.addCase(authorizeAccount.rejected, (state, action) => {
      state.accountStatus = "failed";
    });
  },
});

export const backendReducer = backendSlice.reducer;
// actions are automagically generated and exported by the builder/thunk
export const { logout } = backendSlice.actions;
