import { ReactNode } from "react";
import {
  getCoingeckoTokenPrice,
  getHistoricTokenPrice,
  roundToNearestHour,
} from "../helpers";
import { NetworkId } from "../networks";
import { chains } from "../providers";
import { Provider } from "@ethersproject/providers";

// HistoricPrices are keyed by timestamp in seconds rounded down to nearest hour
export interface IHistoricPrices {
  getPrice(timestamp: number): number;
}

export class HistoricPrices implements IHistoricPrices {
  readonly prices: { [key: number]: number };

  constructor(prices: { [key: number]: number }) {
    this.prices = prices;
  }

  getPrice(timestamp: number): number {
    const nearestHour = roundToNearestHour(timestamp);
    const price = this.prices[nearestHour];
    if (!price) {
      // if price is missing, just get the one an hour earlier
      return this.prices[nearestHour - 3600];
    }
    return price;
  }
}

interface InvestmentOpts {
  name: string; // Internal name used for references
  displayName: string; // Displayname on UI
  tokenIcon: ReactNode; //  SVG path for icons
  decimals: number;
  isLp: boolean;
  customAssetBalanceFunc?: (this: TokenInvestment) => Promise<number>;
  customAssetPriceFunc?: (this: TokenInvestment) => Promise<number>;
  customTreasuryBalanceFunc?: (this: TokenInvestment) => Promise<number>;
  customHistoricPricesFunc?: (this: TokenInvestment) => Promise<IHistoricPrices>;
}

export abstract class Investment {
  readonly name: string;
  readonly displayName: string;
  readonly tokenIcon: ReactNode;
  readonly decimals: number;
  readonly isLp: boolean;
  abstract readonly assetBalance: Promise<number>;
  abstract readonly assetPrice: Promise<number>;
  abstract readonly treasuryBalance: Promise<number>;
  abstract readonly historicPrices: Promise<IHistoricPrices>;

  constructor(investmentOpts: InvestmentOpts) {
    this.name = investmentOpts.name;
    this.displayName = investmentOpts.displayName;
    this.tokenIcon = investmentOpts.tokenIcon;
    this.decimals = investmentOpts.decimals;
    this.isLp = investmentOpts.isLp;
  }
}

export type NetworkName =
  | "ethereum"
  | "fantom"
  | "binance-smart-chain"
  | "boba"
  | "moonriver"
  | "boba-network";

export interface TokenInvestmentOpts extends InvestmentOpts {
  chainId: NetworkId;
  chainName: NetworkName;
  contractAddress: string;
  daoAddress: string;
}

export class TokenInvestment extends Investment {
  readonly contractAddress: string;
  readonly daoAddress: string;
  readonly provider: Promise<Provider>;
  readonly networkName: string;
  readonly assetBalance: Promise<number>;
  readonly assetPrice: Promise<number>;
  readonly treasuryBalance: Promise<number>;
  readonly historicPrices: Promise<IHistoricPrices>;

  constructor(investmentOpts: TokenInvestmentOpts) {
    super(investmentOpts);
    this.contractAddress = investmentOpts.contractAddress;
    this.daoAddress = investmentOpts.daoAddress;
    this.provider = chains[investmentOpts.chainId]?.provider;
    this.networkName = investmentOpts.chainName;
    this.assetBalance = investmentOpts.customAssetBalanceFunc
      ? investmentOpts.customAssetBalanceFunc.bind(this)()
      : this.getAssetBalance.bind(this)();
    this.assetPrice = investmentOpts.customAssetPriceFunc
      ? investmentOpts.customAssetPriceFunc.bind(this)()
      : this.getAssetPrice.bind(this)();
    this.treasuryBalance = investmentOpts.customTreasuryBalanceFunc
      ? investmentOpts.customTreasuryBalanceFunc.bind(this)()
      : this.getTreasuryBalance.bind(this)();
    this.historicPrices = investmentOpts.customHistoricPricesFunc
      ? investmentOpts.customHistoricPricesFunc.bind(this)()
      : this.getHistoricPrices.bind(this)();
  }

  async getAssetBalance(this: TokenInvestment): Promise<number> {
    return 0;
  }

  async getAssetPrice(this: TokenInvestment): Promise<number> {
    return await getCoingeckoTokenPrice(this.networkName, this.contractAddress);
  }

  async getTreasuryBalance(this: TokenInvestment): Promise<number> {
    return 0;
  }

  async getHistoricPrices(this: TokenInvestment): Promise<IHistoricPrices> {
    return new HistoricPrices(
      await getHistoricTokenPrice(this.networkName, this.contractAddress)
    );
  }
}

// These are special investments that have different valuation methods
export interface CustomInvestmentOpts extends InvestmentOpts {
  customAssetBalanceFunc: (this: CustomInvestment) => Promise<number>;
  customAssetPriceFunc: (this: CustomInvestment) => Promise<number>;
  customTreasuryBalanceFunc: (this: CustomInvestment) => Promise<number>;
  customHistoricPricesFunc: (this: CustomInvestment) => Promise<IHistoricPrices>;
}

export class CustomInvestment extends Investment {
  readonly assetBalance: Promise<number>;
  readonly assetPrice: Promise<number>;
  readonly treasuryBalance: Promise<number>;
  readonly historicPrices: Promise<IHistoricPrices>;

  constructor(investmentOpts: CustomInvestmentOpts) {
    super(investmentOpts);
    this.assetBalance = investmentOpts.customAssetBalanceFunc.bind(this)();
    this.assetPrice = investmentOpts.customAssetPriceFunc.bind(this)();
    this.treasuryBalance = investmentOpts.customTreasuryBalanceFunc.bind(this)();
    this.historicPrices = investmentOpts.customHistoricPricesFunc.bind(this)();
  }
}
