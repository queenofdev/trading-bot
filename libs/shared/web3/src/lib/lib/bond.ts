import { JsonRpcSigner } from "@ethersproject/providers";
import React from "react";
import { ethers } from "ethers";
import { ierc20Abi } from "../abi";
import { getBondCalculator } from "../helpers/bond-calculator";
import { addresses } from "../constants";
import { NetworkId } from "../networks";
import { chains } from "../providers";

export enum PaymentToken {
  FHM = "FHM",
  sFHM = "sFHM",
  USDB = "USDB",
  DAI = "DAI",
  LQDR = "LQDR",
}

export enum BondAssetType {
  StableAsset,
  LP,
}

export enum BondType {
  BOND_11 = 0,
  BOND_44 = 1,
  BOND_USDB = 2,
  TRADFI = 3,
  SINGLE_SIDED = 4,
  SINGLE_SIDED_V1 = 5,
  LQDR_USDB_POL = 6,
  USDB_NFT = 7,
  STAKE_NFT = 8,
  PASS_NFT = 9,
}

export enum BondAction {
  Bond = "Bond",
  Mint = "Mint",
}

export enum RedeemAction {
  Redeem = "Redeem",
  Collect = "Collect",
}

export interface BondAddresses {
  reserveAddress: string;
  bondAddress: string;
}

export interface NetworkAddresses {
  [key: string]: BondAddresses;
}

export interface Available {
  [key: string]: boolean;
}

interface BondOpts {
  name: string; // Internal name used for references
  displayName: string; // Displayname on UI
  isAvailable: Available; // set false to display "Sold Out"
  isPurchasable: boolean; // set false to hide "Bond" button
  bondIconSvg: React.ReactNode; //  SVG path for icons
  bondContractABI: ethers.ContractInterface; // ABI for contract
  networkAddrs: NetworkAddresses; // Mapping of network --> Addresses
  bondToken: string; // Unused, but native token to buy the bond.
  decimals: number;
  type: BondType;
  paymentToken?: PaymentToken; // The token that is returned by this bond
  bondAction?: BondAction; // What to display in the bond button
  redeemAction?: RedeemAction; // What to displat in the redeeom button
  apr: number;
  apy?: number;
  roi: number;
  days: number;
  isCircuitBroken?: boolean;
}

// Technically only exporting for the interface
export abstract class Bond {
  // Standard Bond fields regardless of LP bonds or stable bonds.
  readonly name: string;
  readonly displayName: string;
  readonly type: BondType;
  readonly assetType: BondAssetType;
  readonly isAvailable: Available;
  readonly isPurchasable: boolean;
  readonly bondIconSvg: React.ReactNode;
  readonly bondContractABI: ethers.ContractInterface; // Bond ABI
  readonly networkAddrs: NetworkAddresses;
  readonly bondToken: string;
  readonly decimals: number;
  readonly paymentToken: PaymentToken; // Defaults to FHM
  readonly bondAction: BondAction;
  readonly redeemAction: RedeemAction;
  readonly apr: number;
  readonly apy?: number;
  readonly roi: number;
  readonly days: number; // FIXME read from vestingTermSeconds
  isCircuitBroken?: boolean;

  // The following two fields will differ on how they are set depending on bond type
  abstract isLP: boolean;
  abstract reserveContract: ethers.ContractInterface; // Token ABI
  abstract displayUnits: string;
  abstract isRiskFree: boolean;

  // Async method that returns a Promise
  abstract getTreasuryBalance(networkId: NetworkId): Promise<number>;

  constructor(assetType: BondAssetType, bondOpts: BondOpts) {
    this.name = bondOpts.name;
    this.displayName = bondOpts.displayName;
    this.assetType = assetType;
    this.type = bondOpts.type;
    this.isAvailable = bondOpts.isAvailable;
    this.isPurchasable = bondOpts.isPurchasable;
    this.bondIconSvg = bondOpts.bondIconSvg;
    this.bondContractABI = bondOpts.bondContractABI;
    this.networkAddrs = bondOpts.networkAddrs;
    this.bondToken = bondOpts.bondToken;
    this.decimals = bondOpts.decimals;
    this.paymentToken = bondOpts.paymentToken || PaymentToken.FHM;
    this.bondAction = bondOpts.bondAction || BondAction.Bond;
    this.redeemAction = bondOpts.redeemAction || RedeemAction.Redeem;
    this.roi = bondOpts.roi;
    this.apr = bondOpts.apr;
    this.apy = bondOpts.apy;
    this.days = bondOpts.days;
    this.isCircuitBroken = false;
  }

  hasBond(networkId: NetworkId): boolean {
    return this.networkAddrs[networkId] !== undefined;
  }

  getAddressForBond(networkId: NetworkId) {
    return this.networkAddrs[networkId].bondAddress;
  }

  getContractForBondForWrite(networkId: NetworkId, rpcSigner: JsonRpcSigner) {
    const bondAddress = this.getAddressForBond(networkId);
    return new ethers.Contract(bondAddress, this.bondContractABI, rpcSigner);
  }

  async getContractForBond(networkId: NetworkId) {
    const bondAddress = this.getAddressForBond(networkId);
    return new ethers.Contract(
      bondAddress,
      this.bondContractABI,
      await chains[networkId].provider
    );
  }

  getAddressForReserve(networkId: NetworkId) {
    return this.networkAddrs[networkId].reserveAddress;
  }

  getContractForReserveForWrite(networkId: NetworkId, rpcSigner: JsonRpcSigner) {
    const bondAddress = this.getAddressForReserve(networkId);
    return new ethers.Contract(bondAddress, this.reserveContract, rpcSigner);
  }

  async getContractForReserve(networkId: NetworkId) {
    const bondAddress = this.getAddressForReserve(networkId);
    return new ethers.Contract(
      bondAddress,
      this.reserveContract,
      await chains[networkId].provider
    );
  }

  async getBondReservePrice(networkId: NetworkId) {
    const pairContract = await this.getContractForReserve(networkId);
    const reserves = await pairContract["getReserves"]();
    const marketPrice = reserves[1] / reserves[0] / Math.pow(10, 9);

    return marketPrice;
  }
}

// Keep all LP specific fields/logic within the LPBond class
export interface LPBondOpts extends BondOpts {
  reserveContract: ethers.ContractInterface;
  lpUrl: string;
}

export class LPBond extends Bond {
  readonly isLP = true;
  readonly isRiskFree = false;
  readonly lpUrl: string;
  readonly reserveContract: ethers.ContractInterface;
  readonly displayUnits: string;

  constructor(lpBondOpts: LPBondOpts) {
    super(BondAssetType.LP, lpBondOpts);

    this.lpUrl = lpBondOpts.lpUrl;
    this.reserveContract = lpBondOpts.reserveContract;
    this.displayUnits = "LP";
  }

  async getTreasuryBalance(networkId: NetworkId) {
    const token = await this.getContractForReserve(networkId);
    const tokenAddress = this.getAddressForReserve(networkId);
    const bondCalculator = await getBondCalculator(networkId);
    const [tokenAmount, markdown] = await Promise.all([
      token["balanceOf"](addresses[networkId]["TREASURY_ADDRESS"]),
      bondCalculator["markdown"](tokenAddress),
    ]).then(([tokenAmount, markdown]) => [
      tokenAmount,
      markdown / Math.pow(10, this.decimals),
    ]);
    const valuation =
      (await bondCalculator["valuation"](tokenAddress, tokenAmount)) / Math.pow(10, 9);
    const tokenUSD = valuation * markdown;
    return tokenUSD;
  }
}

// Generic BondClass we should be using everywhere
// Assumes the token being deposited follows the standard ERC20 spec
export type StableBondOpts = BondOpts;

export class StableBond extends Bond {
  readonly isLP = false;
  readonly isRiskFree = true;
  readonly reserveContract: ethers.ContractInterface;
  readonly displayUnits: string;
  allowance = 0;

  constructor(stableBondOpts: StableBondOpts) {
    super(BondAssetType.StableAsset, stableBondOpts);
    // For stable bonds the display units are the same as the actual token
    this.displayUnits = stableBondOpts.bondToken;
    this.reserveContract = ierc20Abi; // The Standard ierc20Abi since they're normal tokens
  }

  async getTreasuryBalance(networkId: NetworkId) {
    const token = await this.getContractForReserve(networkId);
    const tokenAmount = await token["balanceOf"](
      addresses[networkId]["TREASURY_ADDRESS"]
    );
    return tokenAmount / Math.pow(10, this.decimals);
  }
}

// These are special bonds that have different valuation methods
export interface CustomBondOpts extends BondOpts {
  reserveContract: ethers.ContractInterface;
  assetType: number;
  lpUrl: string;
  isRiskFree: boolean;
  customTreasuryBalanceFunc: (this: CustomBond, networkId: NetworkId) => Promise<number>;
}

export class CustomBond extends Bond {
  readonly isLP: boolean;

  getTreasuryBalance(networkId: NetworkId): Promise<number> {
    throw new Error("Method not implemented.");
  }

  readonly reserveContract: ethers.ContractInterface;
  readonly displayUnits: string;
  readonly lpUrl: string;
  readonly isRiskFree: boolean;

  constructor(customBondOpts: CustomBondOpts) {
    super(customBondOpts.assetType, customBondOpts);

    if (customBondOpts.assetType === BondAssetType.LP) {
      this.isLP = true;
    } else {
      this.isLP = false;
    }
    this.isRiskFree = customBondOpts.isRiskFree;
    this.lpUrl = customBondOpts.lpUrl;
    // For stable bonds the display units are the same as the actual token
    this.displayUnits = customBondOpts.displayName;
    this.reserveContract = customBondOpts.reserveContract;
    this.getTreasuryBalance = customBondOpts.customTreasuryBalanceFunc.bind(this);
  }
}
