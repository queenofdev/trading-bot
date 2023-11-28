import io from "socket.io-client";
import { currencyInfo, CurrencyInfo } from "@fantohm/shared-web3";

import { CryptoCurrency } from "../types/types";
import { NavItemProp } from "../types/types";

export const Backend_API = "http://localhost:3000/api";
export const Socket_URL = "http://localhost:3000";
export const socket = io(Socket_URL);
export const GRAPH_URL =
  "https://thegraph.com/hosted-service/subgraph/trust0212-fantohm/binary-options-subgraph-goerli";

export const Carousal_Responsive_Form = {
  superLargeDesktop: {
    breakpoint: { max: 1560, min: 1280 },
    items: 3,
  },
  laptopL: {
    breakpoint: { max: 1280, min: 1024 },
    items: 2,
    paritialVisibilityGutter: 50,
  },
  laptop: {
    breakpoint: { max: 860, min: 768 },
    items: 1,
    paritialVisibilityGutter: 180,
  },
  table: {
    breakpoint: { max: 768, min: 425 },
    items: 1,
    paritialVisibilityGutter: 100,
  },
  mobileL: {
    breakpoint: { max: 425, min: 375 },
    items: 1,
    paritialVisibilityGutter: 30,
  },
  mobileM: {
    breakpoint: { max: 375, min: 320 },
    items: 1,
    paritialVisibilityGutter: 15,
  },
  mobile: {
    breakpoint: { max: 320, min: 0 },
    items: 1,
    paritialVisibilityGutter: 30,
  },
};

export const NavItems: NavItemProp[] = [
  { title: "Trade", href: "/trade" },
  { title: "Markets", href: "/markets" },
  { title: "Leaderboard", href: "/leaderboard" },
  { title: "Pools", href: "/pools" },
];

export const Betting_CryptoCurrencies: CryptoCurrency[] = [
  { name: "Ether", symbol: "ETH" },
  { name: "Shiba", symbol: "SHIB" },
  { name: "Bitcoin", symbol: "WBTC" },
  { name: "Solana", symbol: "SOL" },
];

export const UnderlyingAssets: CurrencyInfo = {
  DAI: currencyInfo["DAI_ADDRESS"],
};

export const CommunityTools: NavItemProp[] = [
  { title: "Discord", href: "" },
  { title: "Twitter", href: "" },
  { title: "Report & problem", href: "" },
];

export const Betting_History_Tabs = ["All", "Open", "Win", "Loss", "Draw"];
