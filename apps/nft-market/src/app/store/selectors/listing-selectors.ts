import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { sortListingByDate } from "../../helpers/sort-functions";
import {
  Asset,
  Listing,
  ListingStatus,
  StandardAssetLookupParams,
} from "../../types/backend-types";
import { Listings } from "../reducers/listing-slice";

const selectListings = (state: RootState) => state.listings.listings;

const selectListingAsset = (state: RootState, asset: Asset | null) => asset;
export const selectListingFromAsset = createSelector(
  selectListings,
  selectListingAsset,
  (listings, asset) => {
    if (asset === null) return {} as Listing;
    const matches = Object.entries(listings).filter(([key, listing]) => {
      const rtn =
        listing.asset.assetContractAddress.toLowerCase() ===
          asset.assetContractAddress.toLowerCase() &&
        listing.asset.tokenId === asset.tokenId;
      return rtn;
    });
    const listingMatches = matches.map(([key, listing]) => listing); // get just the listings
    listingMatches.sort(sortListingByDate); // sort by date to get the most recent in case there's more than one

    if (listingMatches) {
      return listingMatches[0];
    } else {
      return {} as Listing;
    }
  }
);

const selectListingAddress = (
  state: RootState,
  addressParams: StandardAssetLookupParams
) => addressParams;
export const selectListingsByAddress = createSelector(
  selectListings,
  selectListingAddress,
  (listings: Listings, addressParams: StandardAssetLookupParams): Listing[] => {
    const matches: [string, Listing][] = Object.entries(listings).filter(
      ([listingId, listing]) =>
        listing.asset.assetContractAddress === addressParams.contractAddress &&
        listing.asset.tokenId === addressParams.tokenId
    );
    return matches.map(([listingId, listing]) => listing);
  }
);

const selectListingStatus = (state: RootState, status: ListingStatus) => status;
export const selectListingByStatus = createSelector(
  selectListings,
  selectListingStatus,
  (listings: Listings, status: ListingStatus): Listing[] => {
    const matches: [string, Listing][] = Object.entries(listings).filter(
      ([listingId, listing]) => listing.status === status
    );
    return matches.map(([listingId, listing]) => listing);
  }
);

const selectListingId = (state: RootState, listingId: string) => listingId;
export const selectListingById = createSelector(
  selectListings,
  selectListingId,
  (listings, listingId) => listings[listingId]
);
