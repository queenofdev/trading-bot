import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isDev, loadState, ierc721Abi, chains } from "@fantohm/shared-web3";
import { Asset, AssetStatus, BackendLoadingStatus } from "../../types/backend-types";
import {
  nftPortAssetsToAssets,
  reservoirTokenToAsset,
} from "../../helpers/data-translations";
import { ReservoirToken } from "../../api/reservoir";
import { desiredNetworkId } from "../../constants/network";
import { Contract, Provider } from "ethers-multicall";
import { NftPortAsset } from "../../api/nftport";

export const assetToAssetId = (asset: Asset) =>
  `${asset.tokenId}:::${asset.assetContractAddress.toLowerCase()}`;

export type AssetLoadStatus = {
  [assetId: string]: BackendLoadingStatus;
};

export type Assets = {
  [assetId: string]: Asset;
};

export interface AssetState {
  readonly assetStatus: "idle" | "loading" | "partial" | "succeeded" | "failed";
  readonly assets: Assets;
  readonly isDev: boolean;
  readonly assetLoadStatus: AssetLoadStatus;
}

export const updateAssetsFromBackend = createAsyncThunk(
  "asset/updateAssetsFromBackend",
  async (backendAssets: Asset[], { dispatch }) => {
    const newAssets: Assets = {};
    backendAssets.forEach((asset: Asset) => {
      newAssets[assetToAssetId(asset)] = {
        ...asset,
      };
    });

    dispatch(updateOwnedAssets(newAssets));
  }
);

export const updateAssetsFromNftPort = createAsyncThunk(
  "asset/updateAssetsFromNftPort",
  async (nftPortAssets: NftPortAsset[], { dispatch }) => {
    const newAssetAry = await nftPortAssetsToAssets(nftPortAssets);

    const ethCallProvider = new Provider(await chains[desiredNetworkId].provider);
    await ethCallProvider.init();
    const owners = await ethCallProvider.all(
      newAssetAry.map((asset) => {
        const nftContract = new Contract(asset.assetContractAddress, ierc721Abi);
        return nftContract["ownerOf"](asset.tokenId);
      })
    );

    const newAssets: Assets = {};
    newAssetAry.forEach((asset: Asset, index: number) => {
      newAssets[assetToAssetId(asset)] = {
        ...asset,
        owner: {
          ...asset.owner,
          address: owners[index],
        },
        wallet: owners[index],
      };
    });

    dispatch(updateAssets(newAssets));
  }
);

export const updateAssetsFromReservoir = createAsyncThunk(
  "asset/updateAssetsFromReservoir",
  async (reservoirAssets: ReservoirToken[], { dispatch }) => {
    const newAssetAry = reservoirAssets.map(reservoirTokenToAsset);
    const newAssets: Assets = {};
    newAssetAry.forEach((asset: Asset) => {
      newAssets[assetToAssetId(asset)] = asset;
    });
    dispatch(updateAssets(newAssets));
  }
);

// initial wallet slice state
const previousState = loadState("asset");
const initialState: AssetState = {
  assets: [],
  isDev: isDev,
  ...previousState, // overwrite assets and currencies from cache if recent
  assetStatus: "idle",
  assetLoadStatus: [],
};

// create slice and initialize reducers
const assetsSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {
    updateAsset: (state, action: PayloadAction<Asset>) => {
      state.assets = {
        ...state.assets,
        ...{
          [assetToAssetId(action.payload)]: {
            ...state.assets[assetToAssetId(action.payload)],
            ...action.payload,
            status:
              action.payload.osData && action.payload.osData.id // if the incoming payload has the osDatda attached it's coming from opensea. Don't overwrite existing status
                ? state.assets[assetToAssetId(action.payload)]?.status || // use existing status if it exists
                  action.payload.status // if undefined use incoming payload
                : action.payload.status, // if osData is not attached, it should be from the backend, use it.
          },
        },
      };
    },
    updateAssets: (state, action: PayloadAction<Assets>) => {
      const mergedAssets: Assets = {};
      Object.entries(action.payload).forEach(([assetId, asset]) => {
        const newStatus =
          asset.osData && state?.assets[assetId]?.status // if there is osData, it's from opensea, save backend data if available
            ? state?.assets[assetId]?.status
            : asset.status;
        mergedAssets[assetId] = {
          ...state.assets[assetId], // spread any existing object in store
          ...asset, // spread new object
          status: newStatus,
        };
      });
      state.assets = { ...state.assets, ...mergedAssets };
    },
    updateOwnedAssets: (state, action: PayloadAction<Assets>) => {
      const mergedAssets: Assets = {};
      Object.entries(action.payload).forEach(([assetId, asset]) => {
        const newStatus = state?.assets[assetId]?.status // if there is osData, it's from opensea, save backend data if available
          ? state?.assets[assetId]?.status
          : asset.status;
        mergedAssets[assetId] = {
          ...state.assets[assetId], // spread any existing object in store
          ...asset, // spread new object
          status: newStatus,
        };
      });
      state.assets = { ...state.assets, ...mergedAssets };
    },
    updateAssetsFromListings: (state, action: PayloadAction<Assets>) => {
      const mergedAssets: Assets = state.assets;
      Object.entries(action.payload).forEach(([assetId, asset]) => {
        if (mergedAssets[assetId] && asset.status === AssetStatus.TRANSFERRED) {
          mergedAssets[assetId] = {
            ...mergedAssets[assetId],
            id: asset.id,
          };
        } else {
          mergedAssets[assetId] = {
            ...mergedAssets[assetId],
            ...asset,
          };
        }
      });
      state.assets = { ...mergedAssets };
    },
  },
});

export const assetsReducer = assetsSlice.reducer;
// actions are automagically generated and exported by the builder/thunk
export const { updateAsset, updateAssets, updateOwnedAssets, updateAssetsFromListings } =
  assetsSlice.actions;
