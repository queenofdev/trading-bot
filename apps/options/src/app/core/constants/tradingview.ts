import { weeksToDays, hoursToMinutes } from "date-fns";

export const TradingView_Internal_Date = {
  "5m": 5,
  "30m": 30,
  "1H": hoursToMinutes(1),
  "4H": hoursToMinutes(4),
};

export const TradingView_Rage_Date = {
  "1D": hoursToMinutes(24),
  "1W": weeksToDays(1) * hoursToMinutes(24),
  "1M": 1,
  "3M": 3,
  "6M": 6,
  YTD: "YTD",
  "12M": 12,
  "60M": 60,
  ALL: "ALL",
};

export enum Timeframes {
  ONE = 1,
  FIVE = 5,
  FIFTEEN = 15,
}

export const timeframes = [1, 5, 15];
