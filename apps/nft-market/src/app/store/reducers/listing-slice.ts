import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { isDev, loadState } from "@fantohm/shared-web3";
import { BackendLoadingStatus, Listing } from "../../types/backend-types";
import { ListingAsyncThunk } from "./interfaces";
import { BackendApi } from "../../api";
import { RootState } from "..";
import { updateAsset } from "./asset-slice";

export type Listings = {
  [listingId: string]: Listing;
};

export type ListingLoadStatus = {
  [key: string]: BackendLoadingStatus;
};

export interface ListingState {
  readonly listingsLoadStatus: BackendLoadingStatus;
  readonly listings: Listings;
  readonly isDev: boolean;
  readonly loadListingStatus: ListingLoadStatus;
  readonly createListingStatus: BackendLoadingStatus;
}

/*
createListing: loads all listings
params:
- networkId: number
- address: string
- provider: JsonRpcProvider
returns: void
*/
export const createListing = createAsyncThunk(
  "listings/createListing",
  async ({ asset, term }: ListingAsyncThunk, { getState, rejectWithValue, dispatch }) => {
    const thisState: any = getState();
    if (thisState.backend.authSignature) {
      const result: any = await BackendApi.createListing(
        thisState.backend.authSignature,
        asset,
        term
      );
      if (result?.id) {
        dispatch(updateListing(result));
        dispatch(updateAsset({ ...result.asset, owner: thisState.backend.user }));
      }
      return result;
    } else {
      return rejectWithValue("No authorization found.");
    }
  }
);

// initial wallet slice state
const previousState = loadState("listings");
const initialState: ListingState = {
  listings: [],
  ...previousState, // overwrite assets and currencies from cache if recent
  isDev: isDev,
  loadListingStatus: [],
  listingsLoadStatus: BackendLoadingStatus.idle,
  createListingStatus: BackendLoadingStatus.idle,
};

// create slice and initialize reducers
const listingsSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {
    updateListing: (state, action: PayloadAction<Listing>) => {
      state.listings = {
        ...state.listings,
        ...{
          [action.payload.id || ""]: {
            ...state.listings[action.payload.id || ""],
            ...action.payload,
          },
        },
      };
    },
    updateListings: (state, action: PayloadAction<Listings>) => {
      const mergedListings: Listings = {};
      Object.entries(action.payload).forEach(([listingId, listing]) => {
        mergedListings[listingId] = {
          ...state.listings[listingId || ""],
          ...listing,
        };
      });
      state.listings = { ...state.listings, ...mergedListings };
    },
    deleteListing: (state, action: PayloadAction<Listing>) => {
      delete state.listings[action.payload.id || ""];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createListing.pending, (state, action) => {
      state.createListingStatus = BackendLoadingStatus.loading;
    });
    builder.addCase(
      createListing.fulfilled,
      (state, action: PayloadAction<Listing | boolean>) => {
        state.createListingStatus = BackendLoadingStatus.succeeded;
        if (
          action.payload !== false &&
          typeof action.payload !== "boolean" &&
          action.payload.id
        ) {
          state.listings = {
            ...state.listings,
            ...{ [action.payload.id]: action.payload },
          };
        }
      }
    );
    builder.addCase(createListing.rejected, (state, action) => {
      state.createListingStatus = BackendLoadingStatus.failed;
    });
  },
});

export const listingsReducer = listingsSlice.reducer;
// actions are automagically generated and exported by the builder/thunk
export const { updateListing, updateListings, deleteListing } = listingsSlice.actions;

const baseInfo = (state: RootState) => state.listings;
export const getListingState = createSelector(baseInfo, (listings) => listings);
