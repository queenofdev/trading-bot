import { JsonRpcProvider } from "@ethersproject/providers";
import Web3Modal from "web3modal";
import { NetworkId } from "../networks";

type onChainProvider = {
  connect: (forceSwitch?: boolean, forceNetworkId?: NetworkId) => void;
  disconnect: () => void;
  provider: JsonRpcProvider | null;
  address: string;
  connected: boolean;
  web3Modal: Web3Modal;
  hasCachedProvider?: () => boolean;
  chainId?: number;
  switchEthereumChain?: (networkId: NetworkId, forceSwitch?: boolean) => Promise<boolean>;
  defaultProvider: JsonRpcProvider;
};

export type Web3ContextData = {
  onChainProvider: onChainProvider;
} | null;
