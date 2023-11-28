import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BigNumber, ethers } from "ethers";
import { erc165Abi, ierc20Abi, ierc721Abi, usdbLending } from "../abi";
import { addresses } from "../constants";
import { isDev, loadState } from "../helpers";
import {
  ercType,
  getCryptoPunksPermission,
  getErc1155Permission,
  getErc721Permission,
  TokenType,
} from "../helpers/contract-type";
import { getLendingAddressConfig } from "../helpers/usdb-lending-address";
import { NetworkIds } from "../networks";
import { chains } from "../providers";
import {
  AssetLocAsyncThunk,
  Erc20AllowanceAsyncThunk,
  IBaseAddressAsyncThunk,
  InteractiveWalletErc20AsyncThunk,
} from "../slices/interfaces";

export type Erc20Balance = {
  [address: string]: BigNumber;
};

export type NftPermStatus = {
  [tokenIdentifier: string]: boolean;
};

export type Erc20Allowance = {
  [tokenIdentifier: string]: BigNumber;
};

export type NftPermissionPayload = {
  assetAddress: string;
  tokenId: string;
  hasPermission: boolean;
};

export type PlatformFees = {
  [currencyAddress: string]: number;
};

export interface WalletState {
  readonly currencyStatus: "idle" | "loading" | "succeeded" | "failed";
  readonly checkPermStatus: "idle" | "loading" | "failed";
  readonly requestPermStatus: "idle" | "loading" | "failed";
  readonly requestErc20AllowanceStatus: "idle" | "loading" | "failed";
  readonly checkErc20AllowanceStatus: "idle" | "loading" | "failed";
  readonly nftPermStatus: NftPermStatus;
  readonly erc20Allowance: Erc20Allowance;
  readonly erc20Balance: Erc20Balance;
  readonly isDev: boolean;
  readonly platformFees: PlatformFees;
}

/*
loadPlatformFee: loads current fee for usdbLending contract
params:
- networkId: number
- address: string
returns: void
*/
export const loadPlatformFee = createAsyncThunk(
  "wallet/loadPlatformFee",
  async ({
    networkId,
    address,
    currencyAddress,
  }: IBaseAddressAsyncThunk & { currencyAddress: string }) => {
    const provider = await chains[networkId].provider;

    const usdbLendingContract = new ethers.Contract(
      getLendingAddressConfig(networkId).currentVersion,
      usdbLending,
      provider
    );

    const platformFee = await usdbLendingContract["platformFees"](currencyAddress);
    return { amount: +platformFee, currencyAddress };
  }
);

/*
loadWalletCurrencies: loads balances
params:
- networkId: number
- address: string
returns: void
*/
export const loadErc20Balance = createAsyncThunk(
  "wallet/loadErc20Balance",
  async ({
    networkId,
    address,
    currencyAddress,
  }: IBaseAddressAsyncThunk & { currencyAddress: string }) => {
    const provider = await chains[networkId].provider;

    const erc20Contract = new ethers.Contract(currencyAddress, ierc20Abi, provider);

    const erc20Balance = await erc20Contract["balanceOf"](address);
    return { [currencyAddress]: erc20Balance } as Erc20Balance;
  }
);

/*
requestNftPermission: loads nfts owned by specific address
params:
- address: string
returns: void
*/
export const requestNftPermission = createAsyncThunk(
  "wallet/requestNftPermission",
  async (
    { networkId, provider, walletAddress, assetAddress, tokenId }: AssetLocAsyncThunk,
    { rejectWithValue }
  ) => {
    if (!walletAddress || !assetAddress || !tokenId) {
      return rejectWithValue("Addresses and id required");
    }
    try {
      const signer = provider.getSigner();
      const typeContract = new ethers.Contract(assetAddress, erc165Abi);
      const contractType: TokenType = await ercType(typeContract);

      let approveTx;
      switch (contractType) {
        case TokenType.ERC721:
          approveTx = await getErc721Permission(signer, networkId, assetAddress, tokenId);
          break;
        case TokenType.ERC1155:
          approveTx = await getErc1155Permission(signer, networkId, assetAddress);
          break;
        case TokenType.CRYPTO_PUNKS:
          approveTx = await getCryptoPunksPermission(
            signer,
            networkId,
            assetAddress,
            tokenId
          );
      }

      await approveTx.wait();
      const payload: NftPermStatus = {};
      payload[`${tokenId}:::${assetAddress.toLowerCase()}`] = true;
      return payload;
    } catch (err) {
      console.log(err);
      return rejectWithValue("Unable to load create listing.");
    }
  }
);

/*
checkNftPermission: loads nfts owned by specific address
params:
- networkId: string
- provider: JsonRpcProvider
- walletAddress: string
- assetAddress: string
- tokenId: string
returns: RejectWithValue<unknown,unknown> | { assetAddress: string, tokenId: string, hasPermission: boolean}
*/
export const checkNftPermission = createAsyncThunk(
  "wallet/checkNftPermission",
  async (
    { networkId, provider, walletAddress, assetAddress, tokenId }: AssetLocAsyncThunk,
    { rejectWithValue }
  ) => {
    if (!walletAddress || !assetAddress || !tokenId) {
      return rejectWithValue("Addresses and id required");
    }
    if (networkId !== NetworkIds.Ethereum && networkId !== NetworkIds.Goerli) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: NetworkIds.Goerli }],
      });
    }
    try {
      const nftContract = new ethers.Contract(assetAddress, ierc721Abi, provider);
      const response: string = await nftContract["getApproved"](tokenId);
      const hasPermission =
        response.toLowerCase() ===
        getLendingAddressConfig(networkId).currentVersion.toLowerCase();
      const payload: NftPermStatus = {};
      payload[`${tokenId}:::${assetAddress.toLowerCase()}`] = hasPermission;
      return payload;
    } catch (err) {
      console.log(err);
      return rejectWithValue("Unable to load create listing.");
    }
  }
);

/*
requestNftPermission: loads nfts owned by specific address
params:
- address: string
returns: void
*/
export const requestErc20Allowance = createAsyncThunk(
  "wallet/requestErc20Allowance",
  async (
    {
      networkId,
      provider,
      walletAddress,
      assetAddress,
      amount,
      lendingContractAddress,
    }: Erc20AllowanceAsyncThunk,
    { rejectWithValue }
  ) => {
    if (!walletAddress || !assetAddress) {
      return rejectWithValue("Addresses and id required");
    }
    try {
      const signer = provider.getSigner();
      const erc20Contract = new ethers.Contract(assetAddress, ierc20Abi, signer);
      const approveTx = await erc20Contract["approve"](
        lendingContractAddress || getLendingAddressConfig(networkId).currentVersion,
        amount
      );
      await approveTx.wait();
      const payload: Erc20Allowance = {};
      payload[`${walletAddress}:::${assetAddress.toLowerCase()}`] = amount;
      return payload;
    } catch (err) {
      console.log(err);
      return rejectWithValue("Unable to load create listing.");
    }
  }
);

/*
checkCurrencyAllowance: loads nfts owned by specific address
params:
- networkId: string
- provider: JsonRpcProvider
- walletAddress: string
- assetAddress: string
- tokenId: string
returns: RejectWithValue<unknown,unknown> | { assetAddress: string, tokenId: string, hasPermission: boolean}
*/
export const checkErc20Allowance = createAsyncThunk(
  "wallet/checkCurrencyAllowance",
  async (
    {
      networkId,
      provider,
      walletAddress,
      assetAddress,
      lendingContractAddress,
    }: InteractiveWalletErc20AsyncThunk,
    { rejectWithValue }
  ) => {
    if (!walletAddress || !assetAddress) {
      return rejectWithValue("Addresses and id required");
    }
    if (![NetworkIds.Ethereum, NetworkIds.Goerli].includes(networkId)) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: isDev ? NetworkIds.Goerli : NetworkIds.Ethereum }],
        });
      } catch (err: any) {
        console.warn(err);
      }
    }
    try {
      const erc20Contract = new ethers.Contract(assetAddress, ierc20Abi, provider);
      const response: BigNumber = await erc20Contract["allowance"](
        walletAddress,
        lendingContractAddress || getLendingAddressConfig(networkId).currentVersion
      );
      const payload: Erc20Allowance = {};
      payload[`${walletAddress}:::${assetAddress.toLowerCase()}`] = response;
      return payload;
    } catch (err) {
      console.log(err);
      return rejectWithValue("Unable to load create listing.");
    }
  }
);

// initial wallet slice state
const previousState = loadState("wallet");
const initialState: WalletState = {
  currencies: [],
  nftPermStatus: [],
  ...previousState, // overwrite assets and currencies from cache if recent
  platformFees: [],
  erc20Balance: [],
  currencyStatus: "idle", // always reset states on reload
  checkPermStatus: "idle",
  requestPermStatus: "idle",
  erc20Allowance: [],
  requestErc20AllowanceStatus: "idle",
  checkErc20AllowanceStatus: "idle",
};

// create slice and initialize reducers
const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      loadPlatformFee.fulfilled,
      (state, action: PayloadAction<{ amount: number; currencyAddress: string }>) => {
        state.platformFees = {
          ...state.platformFees,
          ...{ [action.payload.currencyAddress]: action.payload.amount },
        };
      }
    );
    builder.addCase(loadErc20Balance.pending, (state, action) => {
      state.currencyStatus = "loading";
    });
    builder.addCase(
      loadErc20Balance.fulfilled,
      (state, action: PayloadAction<Erc20Balance>) => {
        state.currencyStatus = "succeeded";
        state.erc20Balance = { ...state.erc20Balance, ...action.payload };
      }
    );
    builder.addCase(loadErc20Balance.rejected, (state, action) => {
      state.currencyStatus = "failed";
    });
    builder.addCase(checkNftPermission.pending, (state, action) => {
      state.checkPermStatus = "loading";
    });
    builder.addCase(
      checkNftPermission.fulfilled,
      (state, action: PayloadAction<NftPermStatus>) => {
        state.checkPermStatus = "idle";
        state.nftPermStatus = { ...state.nftPermStatus, ...action.payload };
      }
    );
    builder.addCase(checkNftPermission.rejected, (state, action) => {
      state.checkPermStatus = "failed";
    });
    builder.addCase(requestNftPermission.pending, (state, action) => {
      state.requestPermStatus = "loading";
    });
    builder.addCase(
      requestNftPermission.fulfilled,
      (state, action: PayloadAction<NftPermStatus>) => {
        state.requestPermStatus = "idle";
        state.nftPermStatus = { ...state.nftPermStatus, ...action.payload };
      }
    );
    builder.addCase(requestNftPermission.rejected, (state, action) => {
      state.requestPermStatus = "failed";
    });
    builder.addCase(checkErc20Allowance.pending, (state, action) => {
      state.checkErc20AllowanceStatus = "loading";
    });
    builder.addCase(
      checkErc20Allowance.fulfilled,
      (state, action: PayloadAction<Erc20Allowance>) => {
        state.checkErc20AllowanceStatus = "idle";
        state.erc20Allowance = { ...state.erc20Allowance, ...action.payload };
      }
    );
    builder.addCase(checkErc20Allowance.rejected, (state, action) => {
      state.checkErc20AllowanceStatus = "failed";
    });
    builder.addCase(requestErc20Allowance.pending, (state, action) => {
      state.requestErc20AllowanceStatus = "loading";
    });
    builder.addCase(
      requestErc20Allowance.fulfilled,
      (state, action: PayloadAction<Erc20Allowance>) => {
        state.requestErc20AllowanceStatus = "idle";
        state.erc20Allowance = { ...state.erc20Allowance, ...action.payload };
      }
    );
    builder.addCase(requestErc20Allowance.rejected, (state, action) => {
      state.requestErc20AllowanceStatus = "failed";
    });
  },
});

export const walletReducer = walletSlice.reducer;
// actions are automagically generated and exported by the builder/thunk
// export const {} = assetsSlice.actions;
