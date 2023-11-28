import { JsonRpcProvider } from "@ethersproject/providers";
import {
  IBaseAddressAsyncThunk,
  IBaseAsyncThunk,
  IInteractiveAsyncThunk,
} from "@fantohm/shared-web3";
import { BigNumber } from "ethers";
import { Asset, BackendAssetQueryParams, Loan, Terms } from "../../types/backend-types";
import { LoanDetails } from "./loan-slice";

// nft-marketplace slice
export interface SignerAsyncThunk extends IBaseAddressAsyncThunk, IInteractiveAsyncThunk {
  onFailed?: () => void;
}

export interface AssetAsyncThunk {
  readonly asset: Asset;
}

export interface TermsAsyncThunk {
  readonly term: Terms;
}

export interface ListingAsyncThunk extends AssetAsyncThunk, TermsAsyncThunk {}

export interface LoanAsyncThunk extends IBaseAsyncThunk {
  readonly loan: Loan;
  networkId: number;
  provider: JsonRpcProvider;
}

export interface LoanDetailsAsyncThunk extends IBaseAsyncThunk {
  readonly loan: Loan;
  readonly networkId: number;
  readonly provider: JsonRpcProvider;
}

export interface ListingCancelAsyncThunk extends IBaseAsyncThunk {
  readonly sig: string;
  readonly networkId: number;
  readonly provider: JsonRpcProvider;
}

export interface RepayLoanAsyncThunk extends IBaseAsyncThunk {
  readonly loan: Loan | LoanDetails;
  readonly amountDue: BigNumber;
  readonly networkId: number;
  readonly provider: JsonRpcProvider;
}

export interface AssetLocAsyncThunk extends IBaseAsyncThunk, IInteractiveAsyncThunk {
  readonly walletAddress: string;
  readonly assetAddress: string;
  readonly tokenId: string;
}

export interface SkipLimitAsyncThunk {
  readonly skip: number;
  readonly limit: number;
}

export enum ListingSort {
  Recently = "Recent",
  Oldest = "Oldest",
  Highest = "Highest Price",
  Lowest = "Lowest Price",
}

export type ListingQueryParam = {
  skip: number;
  take: number;
  status?: string;
  openseaIds?: string[];
  contractAddress?: string;
  tokenId?: string;
  borrower?: string;
  keyword?: string;
  currencyAddress?: string;
  mediaType?: string;
  minApr?: number;
  maxApr?: number;
  minDuration?: number;
  maxDuration?: number;
  minPrice?: number;
  maxPrice?: number;
  sortQuery?: string;
};

export interface ListingQueryAsyncThunk {
  queryParams?: ListingQueryParam;
}

export interface BackendAssetQueryAsyncThunk {
  queryParams?: BackendAssetQueryParams;
}

export type OpenseaAssetQueryParam = {
  owner?: string; // wallet address
  token_ids?: string[]; //array of token ids
  collection?: string;
  collection_slug?: string;
  order_direction?: string;
  asset_contract_address?: string;
  asset_contract_addresses?: string[];
  limit?: number;
  offset?: string;
  cursor?: string;
};

export type OpenseaCollectionQueryParam = {
  asset_owner?: string; // wallet address
  limit?: number;
  offset?: string;
};

export interface OpenseaAssetQueryAsyncThunk {
  queryParams?: OpenseaAssetQueryParam;
}

export interface ClaimFeesAsyncThunk extends IBaseAsyncThunk {
  readonly tokens: string[];
  readonly fees: (number | string)[];
  readonly proofs: string[][];
  readonly networkId: number;
  readonly provider: JsonRpcProvider;
}
