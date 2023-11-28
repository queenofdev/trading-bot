import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { isDev } from "@fantohm/shared-web3";
import { FetchArgs } from "@reduxjs/toolkit/dist/query";
import { updateAssetsFromReservoir } from "../store/reducers/asset-slice";

type ReservoirConfig = {
  apiKey: string;
  apiEndpoint: string;
};

export type ReservoirGetCollectionsRequest = {
  user: string;
  community?: string;
  collectionsSetId?: string;
  collection?: string;
  includeTopBid?: boolean;
  includeLiquidCount?: boolean;
  offset?: number;
  limit: number;
};

export type ReservoirCollection = {
  id: string;
  slug: string;
  name: string;
  image?: string;
  banner?: string;
  discordUrl?: string;
  externalUrl?: string;
  twitterUsername?: string;
  description?: string;
  sampleImages?: string[];
  tokenCount?: string;
  primaryContract: string;
  tokenSetId: string;
  floorAskPrice: number;
  rank: {
    "1day": number;
    "7day": number;
    "30day": number;
    allTime: number;
  };
  volume: {
    "1day": number;
    "7day": number;
    "30day": number;
    allTime: number;
  };
  volumeChange: {
    "1day": number;
    "7day": number;
    "30day": number;
  };
  floorSale: {
    "1day": number;
    "7day": number;
    "30day": number;
  };
  topBidValue?: number;
  topBidMaker?: string;
  ownership: {
    tokenCount: string;
    onSaleCount: string;
    liquidCount: string;
  };
};

export type ReservoirGetCollectionsResponse = {
  collections: ReservoirCollection[];
};

export type ReservoirTokenDetailsRequest = {
  collection?: string; // 0x8d04a8c79ceb0889bdd12acdf3fa9d207ed3ff63
  contract?: string; // 0x8d04a8c79ceb0889bdd12acdf3fa9d207ed3ff63
  tokens?: string[]; // Example: tokens[0]: 0x8d04a8c79ceb0889bdd12acdf3fa9d207ed3ff63:704 tokens[1]: 0x8d04a8c79ceb0889bdd12acdf3fa9d207ed3ff63:97
  tokenSetId?: string; // token:0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270:129000685
  attributes?: string; // attributes[Type]=Original
  source?: string; // opensea.io
  sortBy?: string; // askFloorPrice, tokenId
  sortDirection?: string; // asc, desc
  limit: number;
  includeTopBid: boolean;
  continuation: string; // cursor for next page
};

export type ReservoirTokenDetailsResponse = {
  tokens: ReservoirToken[];
  continuation?: string;
};

export type ReservoirToken = {
  contract: string;
  tokenId: number;
  name?: string;
  description?: string;
  image?: string;
  media?: string;
  kind: string; // erc721, etc
  isFlagged: boolean;
  lastFlagUpdate?: string;
  collection: ReservoirCollection;
  lastBuy: {
    value?: number;
    timestamp?: number;
  };
  lastSell: {
    value?: number;
    timestamp?: number;
  };
  owner: string;
  attributes: ReservoirAttribute[];
  market?: ReservoirMarket;
};

export type ReservoirAttribute = {
  key: string;
  value: string;
  tokenCount?: number;
  onSaleCount?: number;
  floorAskPrice?: number;
  topBidValue?: number;
};

export type ReservoirMarket = {
  floorAsk?: {
    id: string; // address
    price: number;
    maker: string; // address
    validFrom: number; // timestamp
    validUntil: number; // timestamp
    source: {
      id: string; // address
      domain: string; // e.g. opensea.io
      name: string; // e.g. OpenSea
      icon: string;
      url: string;
    };
  };
};

export type ReservoirGetUserTokensRequest = {
  user: string;
  community?: string;
  collectionsSetId?: string;
  collection?: string;
  contract?: string;
  sortby: "" | "aquiredAt";
  sortDirection: "desc" | "asc";
  offset: number;
  limit: number;
  includeTopBid: boolean;
};

export type ReservoirShortToken = {
  contract: string;
  tokenId: string;
  name: string | null;
  image: string | null;
  collection: Partial<ReservoirCollection>;
  topBid: {
    id: string;
    value: number;
  };
};

export type ReservoirOwnership = {
  tokenCount: string;
  onSaleCount: string;
  floorAskPrice: number;
  acquiredAt: string;
};

export type ReservoirGetUserTokensResponse = {
  tokens: {
    token: ReservoirShortToken;
    ownership: ReservoirOwnership;
  }[];
};

const reservoirConfig: ReservoirConfig = {
  apiKey: isDev
    ? "54ec25f8-1f80-5ba7-9adb-63dbaf555af2"
    : "54ec25f8-1f80-5ba7-9adb-63dbaf555af2",
  apiEndpoint: isDev
    ? "https://api-rinkeby.reservoir.tools/"
    : "https://api.reservoir.tools/",
};

const staggeredBaseQuery = retry(
  async (args: string | FetchArgs, api, extraOptions) => {
    const result = await fetchBaseQuery({
      baseUrl: reservoirConfig.apiEndpoint,
      prepareHeaders: (headers) => {
        headers.set("X-API-KEY", reservoirConfig.apiKey);
        return headers;
      },
    })(args, api, extraOptions);
    if (result.error) {
      //alert("Fetching metadata, please wait...");
      //console.log("error being thrown");
      //console.log(result.error);
    }
    return result;
  },
  {
    maxRetries: 5,
  }
);

export const reservoirApi = createApi({
  reducerPath: "reservoirApi",
  baseQuery: staggeredBaseQuery,
  endpoints: (builder) => ({
    getReservoirCollections: builder.query<
      ReservoirGetCollectionsResponse,
      ReservoirGetCollectionsRequest
    >({
      query: ({ user, ...queryParams }) => ({
        url: `users/${user}/collections/v2`,
        params: queryParams,
      }),
    }),
    getReservoirTokenDetails: builder.query<
      ReservoirTokenDetailsResponse,
      ReservoirTokenDetailsRequest
    >({
      query: (query) => ({
        url: `tokens/details/v4`,
        params: query,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateAssetsFromReservoir(data.tokens));
        } catch (e) {
          console.info("Reservoir failing. Reverting to backup");
        }
      },
    }),
    getReservoirUserTokens: builder.query<
      ReservoirGetUserTokensResponse,
      ReservoirGetUserTokensRequest
    >({
      query: ({ user, ...query }) => ({
        url: `users/${user}`,
        params: query,
      }),
    }),
  }),
});

export const {
  useGetReservoirCollectionsQuery,
  useGetReservoirTokenDetailsQuery,
  useGetReservoirUserTokensQuery,
} = reservoirApi;
