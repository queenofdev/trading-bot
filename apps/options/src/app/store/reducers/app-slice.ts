import { loadState } from "@fantohm/shared-web3";
import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../index";
import { CryptoCurrency } from "../../core/types/types";
import { Betting_CryptoCurrencies } from "../../core/constants/basic";

interface AppData {
  readonly loading: boolean;
  readonly checkedConnection: boolean;
  readonly underlyingToken: CryptoCurrency;
  readonly growlNotifications: GrowlNotification[];
}

export type GrowlNotification = {
  title?: string;
  message: string;
  duration: number;
  severity?: string;
  open: boolean;
  startSeconds: number;
};

const previousState = loadState("app");
const initialState: AppData = {
  ...previousState,
  loading: true,
  checkedConnection: false,
  underlyingToken: Betting_CryptoCurrencies[0],
  growlNotifications: [],
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCheckedConnection: (state, action: PayloadAction<boolean>) => {
      state.checkedConnection = action.payload;
    },
    setUnderlyingToken: (state, action: PayloadAction<CryptoCurrency>) => {
      state.underlyingToken = action.payload;
    },
    addAlert: (state, action: PayloadAction<Partial<GrowlNotification>>) => {
      const alert = {
        duration: action.payload.duration || 10000,
        message: action.payload.message || "",
        severity: action.payload.severity || "success",
        startSeconds: Date.now(),
        title: action.payload.title || "",
        open: true,
      } as GrowlNotification;
      state.growlNotifications = [...state.growlNotifications, alert];
    },
    clearAlert: (state, action: PayloadAction<number>) => {
      state.growlNotifications = [
        ...state.growlNotifications.map((alert: GrowlNotification) => {
          if (alert.startSeconds !== action.payload) return alert;
          return { ...alert, open: false };
        }),
      ];
    },
  },
});

const baseInfo = (state: RootState) => state.app;

export const appReducer = appSlice.reducer;
export const {
  setLoading,
  setCheckedConnection,
  setUnderlyingToken,
  addAlert,
  clearAlert,
} = appSlice.actions;
export const getAppState = createSelector(baseInfo, (app) => app);
