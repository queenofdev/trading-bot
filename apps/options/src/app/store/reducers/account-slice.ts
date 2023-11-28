import { isDev, NetworkIds } from "@fantohm/shared-web3";
import { ethers, BigNumber } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";
import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

import { RootState } from "../index";
import { clearPendingTx, fetchPendingTxs } from "./pendingTx-slice";
import { desiredNetworkId, BINARY_ADDRESSES } from "../../core/constants/network";
import erc20ABI from "../../core/abi/ERC20.json";
import daiABI from "../../core/abi/DAI.json";
import BinaryMarketManagerABI from "../../core/abi/BinaryMarketManagerABI.json";
import { addAlert } from "./app-slice";
import { IJsonRpcError } from "../../core/interfaces/basic.interface";

export type Erc20Allowance = {
  [tokenIdentifier: string]: BigNumber;
};

export interface AccountDetail {
  dai: {
    balance: BigNumber;
    allowance: BigNumber;
  };
}

export interface IBaseAddressAsyncThunk {
  readonly address: string;
  readonly networkId: number;
  readonly provider: JsonRpcProvider;
}

export interface Erc20AllowanceAsyncThunk {
  readonly walletAddress: string;
  readonly assetAddress: string;
  readonly networkId: NetworkIds;
  readonly provider: JsonRpcProvider;
}

export const getAccountDetails = createAsyncThunk(
  "account/getAccountDetails",
  async ({ address, networkId, provider }: IBaseAddressAsyncThunk) => {
    if (!address || !networkId || !provider) {
      return {
        dai: {
          balance: BigNumber.from(0),
          allowance: BigNumber.from(0),
        },
      };
    }
    const daiContract = new ethers.Contract(
      BINARY_ADDRESSES[desiredNetworkId].DAI_ADDRESS,
      isDev ? erc20ABI : daiABI,
      provider.getSigner()
    );
    const marketManagerContract = new ethers.Contract(
      BINARY_ADDRESSES[desiredNetworkId].MARKET_MANAGER_ADDRESS,
      BinaryMarketManagerABI,
      provider.getSigner()
    );
    const marketAccount = await marketManagerContract["allMarkets"](0);
    const daiBalance = await daiContract["balanceOf"](address);
    const daiAllowance = await daiContract["allowance"](address, marketAccount.market);

    return {
      dai: {
        balance: daiBalance,
        allowance: daiAllowance,
      },
    };
  }
);

export const requestERC20Allowance = createAsyncThunk(
  "account/requestErc20Allowance",
  async (
    { networkId, provider, walletAddress, assetAddress }: Erc20AllowanceAsyncThunk,
    { dispatch, rejectWithValue }
  ) => {
    if (!walletAddress || !assetAddress) {
      return rejectWithValue("Addresses and id required");
    }
    let approveTx;
    try {
      const signer = provider.getSigner();
      const erc20Contract = new ethers.Contract(assetAddress, erc20ABI, signer);
      const marketManagerContract = new ethers.Contract(
        BINARY_ADDRESSES[desiredNetworkId].MARKET_MANAGER_ADDRESS,
        BinaryMarketManagerABI,
        signer
      );
      const marketAccount = await marketManagerContract["allMarkets"](0);
      approveTx = await erc20Contract["approve"](
        marketAccount.market,
        ethers.constants.MaxUint256
      );
      const text = "Approve DAI";
      const pendingTxnType = "approve";
      if (approveTx) {
        dispatch(fetchPendingTxs({ txHash: approveTx.hash, text, type: pendingTxnType }));
        await approveTx.wait();
      }
      const payload: Erc20Allowance = {};
      payload[`${walletAddress}:::${assetAddress.toLowerCase()}`] =
        ethers.constants.MaxUint256;
      return payload;
    } catch (err: unknown) {
      dispatch(addAlert({ message: (err as IJsonRpcError).message, severity: "error" }));
      return rejectWithValue("Unable to load create listing.");
    } finally {
      if (approveTx) {
        dispatch(clearPendingTx(approveTx.hash));
      }
    }
  }
);

export interface AccountState {
  readonly checkPermStatus: "idle" | "pending" | "fulfilled" | "failed";
  readonly requestErc20AllowanceStatus: "idle" | "pending" | "fulfilled" | "failed";
  readonly accountDetail: AccountDetail;
}

const initialState: AccountState = {
  accountDetail: {
    dai: {
      balance: BigNumber.from(0),
      allowance: BigNumber.from(0),
    },
  },
  checkPermStatus: "idle",
  requestErc20AllowanceStatus: "idle",
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAccountDetails.pending, (state) => {
      state.checkPermStatus = "pending";
    });
    builder.addCase(getAccountDetails.fulfilled, (state, action: PayloadAction<any>) => {
      state.checkPermStatus = "fulfilled";
      state.accountDetail = action.payload;
    });
    builder.addCase(getAccountDetails.rejected, (state) => {
      state.checkPermStatus = "failed";
    });
    builder.addCase(requestERC20Allowance.pending, (state) => {
      state.requestErc20AllowanceStatus = "pending";
    });
    builder.addCase(requestERC20Allowance.fulfilled, (state, action) => {
      state.requestErc20AllowanceStatus = "fulfilled";
    });
    builder.addCase(requestERC20Allowance.rejected, (state) => {
      state.requestErc20AllowanceStatus = "failed";
    });
  },
});

const baseInfo = (state: RootState) => state.account;

export const accountReducer = accountSlice.reducer;
export const getAccountState = createSelector(baseInfo, (account) => account);
