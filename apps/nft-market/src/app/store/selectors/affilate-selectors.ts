import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";

const affiliateData = (state: RootState) => state.affiliate;
export const getAccountAffiliateState = createSelector(
  affiliateData,
  (affiliate) => affiliate
);
