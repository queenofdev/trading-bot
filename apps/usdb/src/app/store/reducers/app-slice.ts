import {
  setAll,
  IBaseAsyncThunk,
  enabledMainNetworkIds,
  enabledNetworkIdsExceptBscAndEth,
  loadNetworkDetails,
} from "@fantohm/shared-web3";
import {
  createSlice,
  createSelector,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { loadState } from "../localstorage";
import { RootState } from "..";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const contentful = require("contentful");

export type BlogPostDTO = {
  id?: string;
  date: string;
  blogTitle: string;
  isFeatured: boolean;
  blogAsset?: string;
  blogCategory?: string;
  content: string;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  getInTouch?: string;
};

export const loadAppDetails = createAsyncThunk(
  "app/loadAppDetails",
  async ({ networkId }: IBaseAsyncThunk, { dispatch }) => {
    const networkDetailsList = await Promise.all(
      enabledNetworkIdsExceptBscAndEth.map((enabledNetworkId: number) =>
        dispatch(loadNetworkDetails({ networkId: enabledNetworkId })).unwrap()
      )
    );
    const localNetworkDetails = networkDetailsList.find(
      (networkDetails: { networkId: number }) => networkDetails.networkId === networkId
    );
    if (localNetworkDetails === undefined) {
      throw new Error(`Unable to load local network details. networkId: ${networkId}`);
    }

    const prodNetworkDetailsList = networkDetailsList.filter(
      (networkDetails: { networkId: number }) =>
        enabledMainNetworkIds.includes(networkDetails.networkId)
    );

    // Global network calculations
    const globalMarketCap = prodNetworkDetailsList
      .map((networkDetails: { marketCap: number }) => networkDetails.marketCap)
      .reduce((sum: number, a: number) => sum + a, 0);
    const globalCircSupply = prodNetworkDetailsList
      .map((networkDetails: { circSupply: number }) => networkDetails.circSupply)
      .reduce((sum: number, a: number) => sum + a, 0);
    const globalTotalSupply = prodNetworkDetailsList
      .map((networkDetails: { totalSupply: number }) => networkDetails.totalSupply)
      .reduce((sum: number, a: number) => sum + a, 0);
    const globalStakingTVL = prodNetworkDetailsList
      .map((networkDetails: { stakingTVL: number }) => networkDetails.stakingTVL)
      .reduce((sum: number, a: number) => sum + a, 0);
    const globalStakingRewardFHM = prodNetworkDetailsList
      .map(
        (networkDetails: { stakingRewardFHM: number }) => networkDetails.stakingRewardFHM
      )
      .reduce((sum: number, a: number) => sum + a, 0);
    const globalStakingCircSupply = prodNetworkDetailsList
      .map(
        (networkDetails: { stakingCircSupply: number }) =>
          networkDetails.stakingCircSupply
      )
      .reduce((sum: number, a: number) => sum + a, 0);

    const globalStakingRebase = globalStakingRewardFHM / globalStakingCircSupply;
    const globalFiveDayRate = prodNetworkDetailsList
      .map((networkDetails: { fiveDayRate: number }) => networkDetails.fiveDayRate)
      .reduce(
        (sum: number, a: number) => sum + a * (1 / enabledMainNetworkIds.length),
        0
      );
    const globalStakingAPY = prodNetworkDetailsList
      .map((networkDetails: { stakingAPY: number }) => networkDetails.stakingAPY)
      .reduce(
        (sum: number, a: number) => sum + a * (1 / enabledMainNetworkIds.length),
        0
      );

    return {
      currentIndex: localNetworkDetails.currentIndex,
      currentBlock: localNetworkDetails.currentBlock,
      fiveDayRate: localNetworkDetails.fiveDayRate,
      stakingAPY: localNetworkDetails.stakingAPY,
      stakingTVL: localNetworkDetails.stakingTVL,
      stakingRebase: localNetworkDetails.stakingRebase,
      marketCap: localNetworkDetails.marketCap,
      marketPrice: localNetworkDetails.marketPrice,
      circSupply: localNetworkDetails.circSupply,
      totalSupply: localNetworkDetails.totalSupply,
      treasuryMarketValue: localNetworkDetails.treasuryMarketValue,
      stakingRewardFHM: localNetworkDetails.stakingRewardFHM,
      stakingCircSupply: localNetworkDetails.stakingCircSupply,
      secondsPerEpoch: localNetworkDetails.secondsPerEpoch,
      globalMarketCap: globalMarketCap,
      globalCircSupply: globalCircSupply,
      globalTotalSupply: globalTotalSupply,
      globalStakingTVL: globalStakingTVL,
      globalFiveDayRate: globalFiveDayRate,
      globalStakingAPY: globalStakingAPY,
      globalStakingRebase: globalStakingRebase,
      globalStakingRewardFHM: globalStakingRewardFHM,
      globalStakingCircSupply: globalStakingCircSupply,
      endBlock: localNetworkDetails.endBlock,
      epochNumber: localNetworkDetails.epochNumber,
    } as IAppData;
  }
);

interface IAppData {
  readonly checkedConnection: boolean;
  readonly circSupply: number;
  readonly currentIndex: string;
  readonly currentBlock: number;
  readonly fiveDayRate: number;
  readonly marketCap: number;
  readonly marketPrice: number;
  readonly stakingAPY: number;
  readonly stakingRebase: number;
  readonly stakingTVL: number;
  readonly totalSupply: number;
  readonly treasuryBalance: number;
  readonly treasuryMarketValue: number;
  readonly stakingRewardFHM: number;
  readonly stakingCircSupply: number;
  readonly secondsPerEpoch: number;
  readonly globalMarketCap: number;
  readonly globalCircSupply: number;
  readonly globalTotalSupply: number;
  readonly globalStakingTVL: number;
  readonly globalFiveDayRate: number;
  readonly globalStakingAPY: number;
  readonly globalStakingRebase: number;
  readonly globalStakingRewardFHM: number;
  readonly globalStakingCircSupply: number;
  readonly endBlock: number;
  readonly epochNumber: number;
  readonly loading: boolean;
  readonly theme: string;
  readonly bondType: string | null;
}

// load cached application state
const appState = loadState();
const initialState: IAppData = {
  checkedConnection: false,
  loading: true,
  loadingMarketPrice: false,
  theme: "dark",
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  ...appState?.app,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
    selectBondType: (state, action) => {
      state.bondType = action.payload;
    },
    setCheckedConnection: (state, action: PayloadAction<boolean>) => {
      state.checkedConnection = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
  },
});

const baseInfo = (state: RootState) => state.app;

export const appReducer = appSlice.reducer;

export const { selectBondType, setTheme, setLoading, setCheckedConnection } =
  appSlice.actions;

export const getAppState = createSelector(baseInfo, (app) => app);
