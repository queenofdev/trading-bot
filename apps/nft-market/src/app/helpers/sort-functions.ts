import { Listing } from "../types/backend-types";

export const sortListingByDate = (listingA: Listing, listingB: Listing) =>
  Date.parse(listingB.createdAt || "") - Date.parse(listingA.createdAt || "");
