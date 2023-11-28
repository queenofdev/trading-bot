import { JsonRpcSigner } from "@ethersproject/providers";
import { ethers } from "ethers";

import { chains } from "../providers";
import { NetworkId, NetworkIds, networks } from "../networks";
import { xFhmAbi as XfhmAbi, lqdrAbi as LqdrAbi } from "../abi";
import { FHMToken } from "@fantohm/shared/images";

export interface AssetTokenAddress {
  [key: string]: string;
}

interface AssetTokenOpts {
  name: string; // Internal name used for references
  displayName: string; // Display name on UI
  contractABI: ethers.ContractInterface; // ABI for contract
  networkAddrs: AssetTokenAddress; // Mapping of network --> Address
  decimals: number;
  iconSvg: any;
}

export class AssetToken {
  // Standard Bond fields regardless of LP bonds or stable bonds.
  readonly name: string;
  readonly displayName: string;
  readonly contractABI: ethers.ContractInterface; // Bond ABI
  readonly networkAddrs: AssetTokenAddress;
  readonly decimals: number;
  readonly iconSvg: any;
  balance: number | null;

  constructor(tokenOpts: AssetTokenOpts) {
    this.name = tokenOpts.name;
    this.displayName = tokenOpts.displayName;
    this.contractABI = tokenOpts.contractABI;
    this.networkAddrs = tokenOpts.networkAddrs;
    this.decimals = tokenOpts.decimals;
    this.iconSvg = tokenOpts.iconSvg;
    this.balance = null;
  }

  setBalance(balance: number) {
    this.balance = balance;
  }

  getContractForWrite(networkId: NetworkId, rpcSigner: JsonRpcSigner) {
    const address = this.networkAddrs[networkId];
    return new ethers.Contract(address, this.contractABI, rpcSigner);
  }

  async getContract(networkId: NetworkId) {
    const address = this.networkAddrs[networkId];
    return new ethers.Contract(
      address,
      this.contractABI,
      await chains[networkId].provider
    );
  }
}

export const xFhmToken = new AssetToken({
  name: "xFhm",
  displayName: "xFhm",
  contractABI: XfhmAbi,
  iconSvg: FHMToken,
  networkAddrs: {
    [NetworkIds.FantomOpera]: "",
    [NetworkIds.FantomTestnet]: "",
    [NetworkIds.Rinkeby]: networks[NetworkIds.Rinkeby].addresses["XFHM_ADDRESS"],
  },
  decimals: 18,
});

export const lqdrToken = new AssetToken({
  name: "LQDR",
  displayName: "LQDR",
  contractABI: LqdrAbi,
  iconSvg: FHMToken,
  networkAddrs: {
    [NetworkIds.FantomOpera]: "",
    [NetworkIds.FantomTestnet]: "",
    [NetworkIds.Rinkeby]: networks[NetworkIds.Rinkeby].addresses["LQDR_ADDRESS"],
  },
  decimals: 18,
});

export const allAssetTokens = [xFhmToken, lqdrToken];
