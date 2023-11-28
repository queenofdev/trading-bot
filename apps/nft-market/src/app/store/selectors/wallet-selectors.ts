import { NftPermStatus } from "@fantohm/shared-web3";
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { Asset } from "../../types/backend-types";

const selectNftPerm: (state: RootState) => NftPermStatus = (state: RootState) =>
  state.wallet.nftPermStatus;

const selectNftPermAsset = (state: RootState, asset: Asset) => asset;
export const selectNftPermFromAsset = createSelector(
  [selectNftPerm, selectNftPermAsset],
  (nftPerms, asset) =>
    nftPerms[`${asset.tokenId}:::${asset.assetContractAddress.toLowerCase()}`]
);
