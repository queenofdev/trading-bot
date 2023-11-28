import {
  DaiToken,
  EthToken,
  USDBToken,
  UsdcToken,
  UsdtToken,
  WbtcToken,
} from "@fantohm/shared/images";
import { getTokenPrice, isDev } from ".";
import { addresses } from "../constants";
import { NetworkIds, networks } from "../networks";

export type Erc20CurrencyAddress = {
  [networkId: number]: string;
};

export interface Erc20Currency {
  symbol: string;
  tokenId: string; // id to find it using addresses helper.
  name: string;
  lastPrice: number;
  addresses: Erc20CurrencyAddress;
  currentAddress: string;
  coingeckoStub: string;
  currentPromise: Promise<number>;
  lastPriceLoadedAt: number;
  icon: string;
  decimals: number;
  getNetworkAddresses: () => Erc20CurrencyAddress;
  getCurrentPrice: () => Promise<number>;
  wait: () => Promise<number>;
}

export type CurrencyDetails = {
  symbol: string;
  name: string;
  icon: string; //svg
  addresses: Erc20CurrencyAddress;
  coingeckoStub: string;
  decimals?: number;
};

export type CurrencyInfo = {
  [constantName: string]: CurrencyDetails;
};

export const currencyInfo: CurrencyInfo = {
  WETH_ADDRESS: {
    symbol: "wETH",
    name: "Wrapped Ethereum",
    icon: EthToken,
    addresses: {
      [NetworkIds.Ethereum]: addresses[NetworkIds.Ethereum]["WETH_ADDRESS"],
      [NetworkIds.Rinkeby]: networks[NetworkIds.Rinkeby].addresses["WETH_ADDRESS"],
      [NetworkIds.FantomOpera]:
        networks[NetworkIds.FantomOpera].addresses["WETH_ADDRESS"],
    },
    coingeckoStub: "weth",
    decimals: 18,
  },
  USDB_ADDRESS: {
    symbol: "USDB",
    name: "USDBalance",
    icon: USDBToken,
    addresses: {
      [NetworkIds.Ethereum]: addresses[NetworkIds.Ethereum]["USDB_ADDRESS"],
      [NetworkIds.Rinkeby]: networks[NetworkIds.Rinkeby].addresses["USDB_ADDRESS"],
      [NetworkIds.FantomOpera]:
        networks[NetworkIds.FantomOpera].addresses["USDB_ADDRESS"],
    },
    coingeckoStub: "usd-balance",
    decimals: 18,
  },
  DAI_ADDRESS: {
    symbol: "DAI",
    name: "DAI",
    icon: DaiToken,
    addresses: {
      [NetworkIds.Ethereum]: addresses[NetworkIds.Ethereum]["DAI_ADDRESS"],
      [NetworkIds.Rinkeby]: networks[NetworkIds.Rinkeby].addresses["DAI_ADDRESS"],
      [NetworkIds.FantomOpera]: networks[NetworkIds.FantomOpera].addresses["DAI_ADDRESS"],
    },
    coingeckoStub: "dai",
    decimals: 18,
  },
  WBTC_ADDRESS: {
    symbol: "wBTC",
    name: "Wrapped Bitcoin",
    icon: WbtcToken,
    addresses: {
      [NetworkIds.Ethereum]: addresses[NetworkIds.Ethereum]["WBTC_ADDRESS"],
      [NetworkIds.Rinkeby]: networks[NetworkIds.Rinkeby].addresses["WBTC_ADDRESS"],
      [NetworkIds.FantomOpera]:
        networks[NetworkIds.FantomOpera].addresses["WBTC_ADDRESS"],
    },
    coingeckoStub: "wrapped-bitcoin",
    decimals: 8,
  },
  USDC_ADDRESS: {
    symbol: "USDC",
    name: "USD Coin",
    icon: UsdcToken,
    addresses: {
      [NetworkIds.Ethereum]: addresses[NetworkIds.Ethereum]["USDC_ADDRESS"],
      [NetworkIds.Rinkeby]: networks[NetworkIds.Rinkeby].addresses["USDC_ADDRESS"],
      [NetworkIds.FantomOpera]:
        networks[NetworkIds.FantomOpera].addresses["USDC_ADDRESS"],
    },
    coingeckoStub: "usd-coin",
    decimals: 6,
  },
  USDT_ADDRESS: {
    symbol: "USDT",
    name: "Tether",
    icon: UsdtToken,
    addresses: {
      [NetworkIds.Ethereum]: addresses[NetworkIds.Ethereum]["USDT_ADDRESS"],
      [NetworkIds.Rinkeby]: networks[NetworkIds.Rinkeby].addresses["USDT_ADDRESS"],
      [NetworkIds.FantomOpera]:
        networks[NetworkIds.FantomOpera].addresses["USDT_ADDRESS"],
    },
    coingeckoStub: "tether",
    decimals: isDev ? 18 : 6,
  },
};

export const getErc20CurrencyFromAddress = (
  currencyAddress: string,
  networkId: number
): erc20Currency => {
  const currencyDetails = Object.entries(currencyInfo).find(
    ([tokenId, currencyDetails]) => {
      return (
        currencyDetails.addresses[networkId] &&
        currencyDetails.addresses[networkId].toLowerCase() ===
          currencyAddress.toLowerCase()
      );
    }
  );
  if (!currencyDetails) throw new ReferenceError("Unidentified address");
  return new erc20Currency(currencyDetails[0], networkId);
};

export const getTokenIdFromAddress = (
  currencyAddress: string,
  networkId: number
): string => {
  const currencyDetails = Object.entries(currencyInfo).find(
    ([tokenId, currencyDetails]) =>
      currencyDetails.addresses[networkId] &&
      currencyDetails.addresses[networkId].toLowerCase() === currencyAddress.toLowerCase()
  );
  if (!currencyDetails) throw new ReferenceError("Unidentified address");
  return currencyDetails[0];
};

export const getSymbolFromAddress = (
  currencyAddress: string,
  networkId: number
): string => {
  const currencyDetails = Object.entries(currencyInfo).find(
    ([tokenId, currencyDetails]) =>
      currencyDetails.addresses[networkId] &&
      currencyDetails.addresses[networkId].toLowerCase() === currencyAddress.toLowerCase()
  );
  if (!currencyDetails) return "USDB";
  return currencyDetails[1].symbol;
};

export const activeNetworks = [
  NetworkIds.Ethereum,
  NetworkIds.Rinkeby,
  NetworkIds.FantomOpera,
];

export class erc20Currency implements Erc20Currency {
  readonly symbol: string;
  readonly tokenId: string;
  readonly name: string;
  readonly addresses: Erc20CurrencyAddress;
  readonly icon: string;
  readonly currentAddress: string; // address on current network
  readonly coingeckoStub: string;
  currentPromise: Promise<number>;
  public lastPrice = 1;
  public lastPriceLoadedAt = 0;
  public decimals: number;

  constructor(_tokenId: string, networkId: number) {
    this.symbol = currencyInfo[_tokenId].symbol;
    this.tokenId = _tokenId;
    this.name = currencyInfo[_tokenId].name;
    this.icon = currencyInfo[_tokenId].icon;
    this.coingeckoStub = currencyInfo[_tokenId].coingeckoStub;
    this.addresses = this.getNetworkAddresses();
    this.currentAddress = this.addresses[networkId];
    this.currentPromise = this.getCurrentPrice();
    this.decimals = currencyInfo[_tokenId]?.decimals || 18;
  }

  getNetworkAddresses(): Erc20CurrencyAddress {
    const tokenAddresses: Erc20CurrencyAddress = {};
    activeNetworks.forEach(
      (networkId: number) =>
        (tokenAddresses[networkId] = networks[networkId].addresses[this.tokenId])
    );
    return tokenAddresses;
  }

  async getCurrentPrice(): Promise<number> {
    this.lastPrice = await getTokenPrice(this.coingeckoStub);
    this.lastPriceLoadedAt = Date.now();
    return this.lastPrice;
  }

  wait(): Promise<number> {
    return this.currentPromise;
  }
}
