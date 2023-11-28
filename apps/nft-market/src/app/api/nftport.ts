import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { isDev } from "@fantohm/shared-web3";
import { FetchArgs } from "@reduxjs/toolkit/dist/query";
import * as queryString from "query-string";
import { Nullable } from "../types/backend-types";
import { updateAssetsFromNftPort } from "../store/reducers/asset-slice";

export type NftPortConfig = {
  apiKey: string;
  apiEndpoint: string;
  chain: "rinkeby" | "ethereum";
};

const nftPortConfig = (): NftPortConfig => {
  return {
    apiKey: "218fce34-47cb-4d03-a65d-a81effe8d661",
    apiEndpoint: "https://api.nftport.xyz",
    chain: isDev ? "rinkeby" : "ethereum",
  };
};

export type NftPortAssetsQueryParams = {
  continuation?: string;
  contract_address?: string;
  exclude?: ("erc721" | "erc1155")[];
  include?: ("default" | "metadata" | "contract_information")[]; // default
  page_size?: number; // 50
};

export type NftPortCollectionQueryParam = {
  continuation?: string;
  page_size?: number; // 50
  type?: "owns_contract_nfts" | "owns_contracts";
};

export type NftPortCollection = {
  name: string;
  symbol: string;
  type: string;
  metadata?: {
    description?: string;
    thumbnail_url?: string;
    cached_thumbnail_url?: string;
    banner_url?: string;
    cached_banner_url?: string;
  };
};

export type NftPortAsset = {
  contract_address: string;
  token_id: string;
  animation_url: Nullable<string>;
  cached_animation_url: Nullable<string>;
  cached_file_url: Nullable<string>;
  contract: NftPortCollection;
  creator_address: string;
  description: string;
  file_url: string;
  metadata: {
    attributes: {
      trait_type: string;
      value: string;
    }[];
    compiler: string;
    date: number;
    description: string;
    dna: string;
    edition: number;
    image: string;
    name: string;
  };
  metadata_url: string;
  name: string;
};

export type NftPortAssetsQueryResponse = {
  response: string;
  nfts: NftPortAsset[];
  total: number;
  continuation?: string;
};

export type NftPortAssetQueryResponse = {
  response: string;
  nft: NftPortAsset;
  owner: string;
  status: "ADDED" | "PROCESSING" | "PENDING" | "REFRESHED_RECENTLY";
};

export type NftPortCollectionsQueryResponse = {
  response: string;
  contracts: (NftPortCollection & {
    address: string;
    num_nfts_owned: number;
  })[];
  total: number;
  continuation?: string;
};

const staggeredBaseQuery = retry(
  async (args: string | FetchArgs, api, extraOptions) => {
    const result = await fetchBaseQuery({
      baseUrl: nftPortConfig().apiEndpoint,
      prepareHeaders: (headers) => {
        headers.set("Authorization", nftPortConfig().apiKey);
        return headers;
      },
      paramsSerializer: (params: NftPortAssetsQueryParams) =>
        queryString.stringify(
          { ...params, chain: nftPortConfig().chain },
          { arrayFormat: "none" }
        ),
    })(args, api, extraOptions);
    if (result.error) {
      // fail immediatly if it's a 500 error
      if (result.error?.status === 500) {
        retry.fail(result.error);
      }
    }
    return result;
  },
  {
    maxRetries: 5,
  }
);

export const nftPortApi = createApi({
  reducerPath: "nftportApi",
  baseQuery: staggeredBaseQuery,
  endpoints: (builder) => ({
    getNftPortAsset: builder.query<
      NftPortAssetQueryResponse,
      {
        contract_address: string;
        token_id: string;
      }
    >({
      query: (queryParams) => ({
        url: `v0/nfts/${queryParams.contract_address}/${queryParams.token_id}`,
        params: queryParams,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data }: { data: NftPortAssetQueryResponse } = await queryFulfilled;
          dispatch(updateAssetsFromNftPort([data.nft]));
        } catch (e) {
          console.info("NftPort failing. Reverting to backup");
        }
      },
    }),
    getNftPortAssets: builder.query<
      NftPortAssetsQueryResponse,
      NftPortAssetsQueryParams & {
        account_address: string;
      }
    >({
      query: (queryParams) => ({
        url: `v0/accounts/${queryParams.account_address}`,
        params: {
          exclude: ["erc1155"],
          include: ["metadata", "contract_information"],
          ...queryParams,
        },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data }: { data: NftPortAssetsQueryResponse } = await queryFulfilled;
          dispatch(updateAssetsFromNftPort(data.nfts));
        } catch (e) {
          console.info("NftPort failing. Reverting to backup");
        }
      },
    }),
    getRawNftPortAssets: builder.query<
      NftPortAssetsQueryResponse,
      NftPortAssetsQueryParams & {
        account_address: string;
      }
    >({
      query: (queryParams) => ({
        url: `v0/accounts/${queryParams.account_address}`,
        params: {
          exclude: ["erc1155"],
          include: ["metadata", "contract_information"],
          ...queryParams,
        },
      }),
    }),
    getNftPortCollections: builder.query<
      NftPortCollection[],
      NftPortCollectionQueryParam & {
        account_address: string;
      }
    >({
      query: (queryParams) => ({
        url: `/v0/accounts/contracts/${queryParams.account_address}`,
        params: {
          type: "owns_contract_nfts",
          ...queryParams,
        },
      }),
    }),
  }),
});

export const {
  useGetNftPortAssetQuery,
  useLazyGetNftPortAssetQuery,
  useGetNftPortAssetsQuery,
  useLazyGetNftPortAssetsQuery,
  useGetRawNftPortAssetsQuery,
} = nftPortApi;
