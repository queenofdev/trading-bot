// external libs
import axios, { AxiosResponse } from "axios";
import {
  createApi,
  FetchArgs,
  fetchBaseQuery,
  retry,
} from "@reduxjs/toolkit/query/react";
import { JsonRpcProvider } from "@ethersproject/providers";

// internal libs
import {
  AllAssetsResponse,
  AllListingsResponse,
  Asset,
  CreateListingRequest,
  Listing,
  LoginResponse,
  Terms,
  Notification,
  CreateListingResponse,
  Loan,
  Offer,
  BackendAssetQueryParams,
  BackendLoanQueryParams,
  BackendOfferQueryParams,
  BackendStandardQuery,
  PlatformWalletInfo,
  BackendNotificationQueryParams,
  Collection,
  BackendCollectionQuery,
  User,
  NftPrice,
  BackendNftAssetsQueryParams,
  BackendNftAssetsQueryResponse,
  SendReport,
  AffiliateData,
  SaveAffiliateResponse,
} from "../types/backend-types";
import { ListingQueryParam } from "../store/reducers/interfaces";
import { RootState } from "../store";
import {
  assetAryToAssets,
  dropHelperDates,
  listingAryToListings,
  listingToCreateListingRequest,
} from "../helpers/data-translations";
import {
  updateAsset,
  updateAssets,
  updateAssetsFromBackend,
  updateAssetsFromListings,
} from "../store/reducers/asset-slice";
import { updateListing, updateListings } from "../store/reducers/listing-slice";
import { isDev } from "@fantohm/shared-web3";

export const WEB3_SIGN_MESSAGE =
  "Welcome to Liqdnft!\n\nTo get started, click Sign In and accept our Terms of Service: <https://liqdnft.com/term> \n\nThis request will not trigger a blockchain transaction or cost any gas fees.";

export const NFT_MARKETPLACE_API_URL = isDev
  ? "https://apitest.liqdnft.com/api"
  : "https://api.liqdnft.com/api";

export const doLogin = (address: string): Promise<LoginResponse> => {
  const url = `${NFT_MARKETPLACE_API_URL}/auth/login`;
  return axios.post(url, { address }).then((resp: AxiosResponse<LoginResponse>) => {
    return resp.data;
  });
};

export const createListing = async (
  signature: string,
  asset: Asset,
  term: Terms
): Promise<Listing | string> => {
  const url = `${NFT_MARKETPLACE_API_URL}/asset-listing`;
  const listingParams = listingToCreateListingRequest(asset, term);
  return axios
    .post(url, listingParams, {
      headers: {
        Authorization: `Bearer ${signature}`,
      },
    })
    .then(async (resp: AxiosResponse<CreateListingResponse>) => {
      return createListingResponseToListing(resp.data);
    })
    .catch((error) => {
      return error;
    });
};

export const getAffiliateAddresses = async (
  signature: string,
  address: string
): Promise<AffiliateData> => {
  const url = `${NFT_MARKETPLACE_API_URL}/affiliate/all?affiliate=${address}`;
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${signature}`,
      },
    })
    .then((resp: AxiosResponse<any>) => {
      return {
        referredAddresses: resp.data.data,
      };
    })
    .catch((error) => {
      return error.response.data.message;
    });
};

export const getAffiliateFees = async (
  signature: string,
  address: string
): Promise<AffiliateData> => {
  const url = `${NFT_MARKETPLACE_API_URL}/affiliate/fee/${address}?proof=true`;
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${signature}`,
      },
    })
    .then((resp: AxiosResponse<any>) => {
      return {
        affiliateFees: resp.data.affiliateFees,
        proofs: resp.data.proofs,
      };
      // return resp.data;
    })
    .catch((error) => {
      return error.response.data.message;
    });
};

export const saveAffiliate = async (
  signature: string,
  address: string,
  referralCode: string
): Promise<AffiliateData> => {
  const url = `${NFT_MARKETPLACE_API_URL}/affiliate`;
  return axios
    .post(
      url,
      {
        user: address,
        affiliate: referralCode,
      },
      {
        headers: {
          Authorization: `Bearer ${signature}`,
        },
      }
    )
    .then((resp: AxiosResponse<SaveAffiliateResponse>): AffiliateData => {
      return {
        referralCode: resp.data.data.affiliate,
      };
    })
    .catch((error) => {
      return error.response.data.message;
    });
};

export const handleSignMessage = async (
  address: string,
  provider: JsonRpcProvider
): Promise<string> => {
  const signer = provider.getSigner(address);
  try {
    return (await signer.signMessage(WEB3_SIGN_MESSAGE)) as string;
  } catch (e) {
    return "";
  }
};

const createListingResponseToListing = (
  createListingResponse: CreateListingResponse
): Listing => {
  const { term, ...listing } = createListingResponse;
  return { ...listing, term: term };
};

const notificationDateOldestFirst = (a: Notification, b: Notification): number => {
  if (!a.createdAt || !b.createdAt) return 0;
  return Date.parse(b.createdAt) - Date.parse(a.createdAt);
};

const standardQueryParams: BackendStandardQuery = {
  skip: 0,
  take: 50,
};

const staggeredBaseQuery = retry(
  async (args: string | FetchArgs, api, extraOptions) => {
    const result = await fetchBaseQuery({
      baseUrl: NFT_MARKETPLACE_API_URL,
      prepareHeaders: (headers, { getState }) => {
        const signature = (getState() as RootState).backend.authSignature;
        headers.set("authorization", `Bearer ${signature}`);
        return headers;
      },
    })(args, api, extraOptions);
    if (result.error) {
      // fail immediately if it's a 500 error
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

export const backendApi = createApi({
  reducerPath: "backendApi",
  tagTypes: [
    "Asset",
    "Collection",
    "Listing",
    "Loan",
    "Notification",
    "Offer",
    "Order",
    "PlatformWalletInfo",
    "Terms",
    "User",
    "Mail",
  ],
  baseQuery: staggeredBaseQuery,
  endpoints: (builder) => ({
    // Assets
    getAssets: builder.query<Asset[], Partial<BackendAssetQueryParams>>({
      query: (queryParams) => ({
        url: `asset/all`,
        params: {
          ...standardQueryParams,
          ...queryParams,
        },
      }),
      transformResponse: (response: AllAssetsResponse, meta, arg) => response.data,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data }: { data: Asset[] } = await queryFulfilled;
        dispatch(updateAssets(assetAryToAssets(data)));
      },
      providesTags: (result, error, queryParams) =>
        result
          ? [...result.map(({ id }) => ({ type: "Asset" as const, id })), "Asset"]
          : ["Asset"],
    }),
    getAsset: builder.query<Asset, string | undefined>({
      query: (id) => ({
        url: `asset/${id}`,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data }: { data: Asset } = await queryFulfilled;
        dispatch(updateAsset(data));
      },
      providesTags: ["Asset"],
    }),
    deleteAsset: builder.mutation<Asset, Partial<Asset> & Pick<Asset, "id">>({
      query: ({ id, ...asset }) => {
        return {
          url: `asset/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error, arg) => [{ type: "Asset", id: arg.id }],
    }),
    validateNFT: builder.query<boolean, string | undefined>({
      query: (id) => ({
        url: `nft/validate-nft/${id}`,
      }),
      providesTags: ["Asset"],
    }),
    // Collections
    getCollections: builder.query<Collection[], Partial<BackendCollectionQuery>>({
      query: (queryParams) => ({
        url: `collection/all`,
        params: {
          ...standardQueryParams,
          ...queryParams,
        },
      }),
      transformResponse: (response: { count: number; data: Collection[] }, meta, arg) =>
        response.data,
      providesTags: (result, error, queryParams) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Collection" as const, id })),
              "Collection",
            ]
          : ["Collection"],
    }),
    // Listings
    getListings: builder.query<Listing[], Partial<ListingQueryParam>>({
      query: (queryParams) => ({
        url: `asset-listing/all`,
        params: {
          ...standardQueryParams,
          ...queryParams,
        },
      }),
      transformResponse: (response: AllListingsResponse, meta, arg) =>
        response.data.map((listing: Listing) => {
          const { term, ...formattedListing } = listing;
          return { ...formattedListing, term: term } as Listing;
        }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data }: { data: Listing[] } = await queryFulfilled;
        const assets = data.map((listing: Listing) => listing.asset);
        dispatch(updateListings(listingAryToListings(data)));
        dispatch(updateAssetsFromListings(assetAryToAssets(assets))); // could this potentially update with old listing data?
      },
      providesTags: (result, error, queryParams) =>
        result
          ? [...result.map(({ id }) => ({ type: "Listing" as const, id })), "Listing"]
          : ["Listing"],
    }),
    getListing: builder.query<Listing, string | undefined>({
      query: (id) => ({
        url: `asset-listing/${id}`,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data }: { data: Listing } = await queryFulfilled;
        if (data && data.id) {
          dispatch(updateListing(data));
        }
      },
      providesTags: (result, error, queryParams) => [
        { type: "Listing" as const, id: result?.id || "" },
      ],
    }),
    createListing: builder.mutation<CreateListingRequest, Partial<CreateListingRequest>>({
      query: (body) => {
        return {
          url: `asset-listing`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Listing", "Asset", "Terms"],
    }),
    deleteListing: builder.mutation<Listing, Partial<Listing> & Pick<Listing, "id">>({
      query: ({ id }) => {
        return {
          url: `asset-listing/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Listing", "Asset", "Terms"],
    }),
    updateListing: builder.mutation<Listing, Partial<Listing> & Pick<Listing, "id">>({
      query: ({ id, ...patch }) => ({
        url: `asset-listing/${id}`,
        method: "PUT",
        body: { ...patch, id },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data }: { data: Listing } = await queryFulfilled;
        if (data && data.id) {
          dispatch(updateListing(data));
        }
      },
      transformResponse: (response: Listing, meta, arg) => response,
      invalidatesTags: ["Terms", "Listing", "Offer"],
    }),
    // Terms
    getTerms: builder.query<Terms[], Partial<BackendStandardQuery>>({
      query: (queryParams) => ({
        url: `term/all`,
        params: {
          ...standardQueryParams,
          ...queryParams,
        },
      }),
      transformResponse: (response: { count: number; data: Terms[] }, meta, arg) =>
        response.data,
      providesTags: (result, error, queryParams) =>
        result
          ? [...result.map(({ id }) => ({ type: "Terms" as const, id })), "Terms"]
          : ["Terms"],
    }),
    updateTerms: builder.mutation<Terms, Partial<Terms> & Pick<Terms, "id">>({
      query: ({ id, ...patch }) => ({
        url: `term/${id}`,
        method: "PUT",
        body: { ...patch, id },
      }),
      transformResponse: (response: Terms, meta, arg) => response,
      invalidatesTags: ["Terms", "Listing", "Offer"],
    }),
    deleteTerms: builder.mutation<Terms, Partial<Terms> & Pick<Terms, "id">>({
      query: ({ id, ...terms }) => {
        return {
          url: `term/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Listing", "Terms", "Offer"],
    }),
    // Loans
    getLoans: builder.query<Loan[], Partial<BackendLoanQueryParams>>({
      query: (queryParams) => ({
        url: `loan/all`,
        params: {
          ...standardQueryParams,
          ...queryParams,
        },
      }),
      transformResponse: (response: { count: number; data: Loan[] }, meta, arg) =>
        response.data,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data }: { data: Loan[] } = await queryFulfilled;
        const assetListings: any[] = [];
        const assets: any[] = [];
        data.forEach((item) => {
          if (item?.assetListing?.asset) {
            assetListings.push(item.assetListing);
            assets.push(item.assetListing.asset);
          }
        });
        dispatch(updateListings(listingAryToListings(assetListings)));
        dispatch(updateAssetsFromListings(assetAryToAssets(assets))); // could this potentially update with old listing data?
      },
      providesTags: (result, error, queryParams) =>
        result
          ? [...result.map(({ id }) => ({ type: "Loan" as const, id })), "Loan"]
          : ["Loan"],
    }),
    getLoan: builder.query<Loan, string | undefined>({
      query: (id) => ({
        url: `loan/${id}`,
      }),
      providesTags: (result, error, queryParams) => [
        { type: "Loan" as const, id: result?.id || "" },
      ],
    }),
    createLoan: builder.mutation<Loan, Loan>({
      query: ({ id, borrower, lender, assetListing, term, ...loan }) => {
        const { collection, ...asset } = dropHelperDates({ ...assetListing.asset }); // backend doesn't like collection
        const loanRequest = {
          ...loan,
          assetListing: {
            ...dropHelperDates({ ...assetListing }),
            asset: dropHelperDates({ ...asset }),
            term: dropHelperDates({ ...assetListing.term }),
          },
          borrower: dropHelperDates({ ...borrower }),
          lender: dropHelperDates({ ...lender }),
          term: dropHelperDates({ ...term }),
        };
        return {
          url: `loan`,
          method: "POST",
          body: loanRequest,
        };
      },
      invalidatesTags: ["Terms"],
    }),
    updateLoan: builder.mutation<Loan, Partial<Loan> & Pick<Loan, "id">>({
      query: ({ id, ...patch }) => ({
        url: `loan/${id}`,
        method: "PUT",
        body: { ...patch, id },
      }),
      transformResponse: (response: Loan, meta, arg) => response,
      invalidatesTags: ["Listing", "Offer", "Loan", "Asset"],
    }),
    deleteLoan: builder.mutation<Loan, Partial<Loan> & Pick<Loan, "id">>({
      query: ({ id, ...loan }) => {
        return {
          url: `loan/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Loan", "Asset", "Listing", "Terms"],
    }),
    resetPartialLoan: builder.mutation<Listing, string | undefined>({
      query: (id) => ({
        url: `loan/reset-status/${id}`,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data }: { data: Listing } = await queryFulfilled;
        if (data && data.id) {
          dispatch(updateListing(data));
          dispatch(updateAsset({ ...data.asset }));
        }
      },
      invalidatesTags: (result, error, queryParams) => [
        { type: "Loan" as const, id: result?.id || "" },
      ],
    }),
    // Offers
    getOffers: builder.query<Offer[], Partial<BackendOfferQueryParams>>({
      query: (queryParams) => ({
        url: `offer/all`,
        params: {
          ...standardQueryParams,
          ...queryParams,
        },
      }),
      transformResponse: (response: { count: number; data: Offer[] }, meta, arg) =>
        response.data,
      providesTags: (result, error, queryParams) =>
        result
          ? [...result.map(({ id }) => ({ type: "Offer" as const, id })), "Offer"]
          : ["Offer"],
    }),
    getOffer: builder.query<Offer, string | undefined>({
      query: (id) => ({
        url: `offer/${id}`,
      }),
      providesTags: (result, error, queryParams) => [
        { type: "Offer" as const, id: result?.id || "" },
      ],
    }),
    createOffer: builder.mutation<Offer, Partial<Offer>>({
      query: (body) => {
        return {
          url: `offer`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Offer"],
    }),
    updateOffer: builder.mutation<Offer, Partial<Offer> & Pick<Offer, "id">>({
      query: ({ id, ...patch }) => ({
        url: `offer/${id}`,
        method: "PUT",
        body: { ...patch, id },
      }),
      transformResponse: (response: Offer, meta, arg) => response,
      invalidatesTags: ["Terms", "Listing", "Offer"],
    }),
    deleteOffer: builder.mutation<Offer, Partial<Offer> & Pick<Offer, "id">>({
      query: ({ id, ...offer }) => {
        return {
          url: `offer/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Asset", "Listing", "Terms", "Offer"],
    }),
    // User Notifications
    getUserNotifications: builder.query<
      Notification[],
      Partial<BackendNotificationQueryParams>
    >({
      query: (queryParams) => ({
        url: `user-notification/all`,
        params: {
          ...standardQueryParams,
          ...queryParams,
        },
      }),
      transformResponse: (response: { count: number; data: Notification[] }, meta, arg) =>
        response.data.sort(notificationDateOldestFirst),
      providesTags: (result, error, queryParams) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Notification" as const, id })),
              "Notification",
            ]
          : ["Notification"],
    }),
    updateUserNotification: builder.mutation<
      Notification,
      Partial<Notification> & Pick<Notification, "id">
    >({
      query: ({ id, ...patch }) => ({
        url: `user-notification/${id}`,
        method: "PUT",
        body: { ...patch, id },
      }),
      transformResponse: (response: Notification, meta, arg) => response,
      invalidatesTags: ["Notification"],
    }),
    // User
    getUser: builder.query<User, string | undefined>({
      query: (walletAddress) => ({
        url: `user/all`,
        params: { walletAddress },
      }),
      providesTags: ["User"],
    }),
    // Wallet
    getWallet: builder.query<PlatformWalletInfo, string | undefined>({
      query: (walletAddress) => ({
        url: `wallet/${walletAddress}`,
      }),
      providesTags: ["PlatformWalletInfo"],
    }),
    // User
    getNftPrice: builder.query<NftPrice[], { collection: string; tokenId: string }>({
      query: ({ collection, tokenId }) => ({
        url: `nft/price/${collection}/${tokenId}`,
      }),
      providesTags: ["Asset"],
    }),
    // Nft Proxy
    getNftAssets: builder.query<
      BackendNftAssetsQueryResponse,
      BackendNftAssetsQueryParams
    >({
      query: (queryParams) => ({
        url: `nft/fetchAll`,
        params: queryParams,
      }),
      transformResponse: (
        response: {
          continuation: string;
          count: number;
          data: Asset[];
        },
        meta,
        arg
      ) => {
        const assets = response.data.map((asset: Asset) => {
          let wallet;
          if (asset.owner && asset.owner.address) {
            wallet = asset.owner.address;
          } else {
            wallet = "";
          }
          return {
            ...asset,
            wallet,
          };
        });
        return {
          assets,
          count: response.count,
          continuation: response.continuation,
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateAssetsFromBackend(data.assets));
        } catch (e) {
          console.info("GetNftAssets failing. Reverting to backup");
        }
      },
    }),
    getNftAsset: builder.query<
      Asset,
      {
        contractAddress: string;
        tokenId: string;
      }
    >({
      query: (queryParams) => ({
        url: `nft/detail/${queryParams.contractAddress}/${queryParams.tokenId}`,
      }),
      transformResponse: (asset: Asset, meta, arg) => {
        let wallet;
        if (asset.owner && asset.owner.address) {
          wallet = asset.owner.address;
        } else {
          wallet = "";
        }
        return {
          ...asset,
          wallet,
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateAssetsFromBackend([data]));
        } catch (e) {
          console.info("GetNftAsset failing. Reverting to backup");
        }
      },
    }),
    getNftCollections: builder.query<
      {
        data: {
          name: string;
          slug: string;
          imageUrl: string;
          contractAddress: string;
          numNftsOwned: 105;
        }[];
      },
      {
        wallet: string;
        limit?: number;
      }
    >({
      query: (queryParams) => ({
        url: `collection/fetchAllByWallet?walletAddress=${queryParams.wallet}&limit=${
          queryParams.limit || 50
        }`,
      }),
    }),
    sendReport: builder.mutation<SendReport, Partial<SendReport>>({
      query: (body) => {
        return {
          url: `mail`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Mail"],
    }),
  }),
});

export const {
  useGetAssetQuery,
  useGetAssetsQuery,
  useGetCollectionsQuery,
  useLazyGetCollectionsQuery,
  useDeleteAssetMutation,
  useValidateNFTQuery,
  useGetListingsQuery,
  useLazyGetListingsQuery,
  useGetListingQuery,
  useDeleteListingMutation,
  useUpdateListingMutation,
  useGetLoansQuery,
  useGetLoanQuery,
  useCreateLoanMutation,
  useUpdateLoanMutation,
  useDeleteLoanMutation,
  useResetPartialLoanMutation,
  useGetTermsQuery,
  useUpdateTermsMutation,
  useDeleteTermsMutation,
  useGetOffersQuery,
  useGetOfferQuery,
  useCreateOfferMutation,
  useUpdateOfferMutation,
  useDeleteOfferMutation,
  useGetWalletQuery,
  useGetUserNotificationsQuery,
  useGetUserQuery,
  useUpdateUserNotificationMutation,
  useGetNftPriceQuery,
  useGetNftAssetsQuery,
  useLazyGetNftAssetsQuery,
  useGetNftAssetQuery,
  useLazyGetNftCollectionsQuery,
  useGetNftCollectionsQuery,
  useSendReportMutation,
} = backendApi;
