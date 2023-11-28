import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";

export type CoingeckoConfig = {
  apiEndpoint: string;
};

// resp.data[tokenId].usd : example response from coingecko.arcade.money
type TokenPriceData = {
  [tokenId: string]: { usd: number };
};
export type GetTokenPriceResponse = {
  data: TokenPriceData;
};

const coingeckoConfig = (): CoingeckoConfig => {
  return {
    apiEndpoint: "https://api.coingecko.com/api/v3",
  };
};

const staggeredBaseQuery = retry(
  fetchBaseQuery({
    baseUrl: coingeckoConfig().apiEndpoint,
  }),
  {
    maxRetries: 5,
  }
);

export const coingeckoApi = createApi({
  reducerPath: "coingeckoApi",
  baseQuery: staggeredBaseQuery,
  endpoints: (builder) => ({
    // `https://api.coingecko.com/api/v3/simple/token_price/${chain}?contract_addresses=${ca}&vs_currencies=usd`
    getTokenPrice: builder.query<number, { contractAddress: string; chainName: string }>({
      query: ({ contractAddress, chainName }) => ({
        url: `simple/token_price/${chainName}`,
        params: { contract_addresses: contractAddress, vs_currencies: "usd" },
      }),
      transformResponse: (response: TokenPriceData, meta, arg) => {
        return typeof response[arg.contractAddress.toLowerCase()] !== "undefined"
          ? response[arg.contractAddress.toLowerCase()].usd
          : 1;
      },
    }),
  }),
});

export const { useGetTokenPriceQuery } = coingeckoApi;
