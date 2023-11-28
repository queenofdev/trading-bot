import { Provider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { NetworkIds } from "./networks";
import { NodeHelper } from "./helpers/node-helper";
import { MulticallProvider } from "./lib/multicall-provider";

interface ChainDetailsOpts {
  networkName: string;
  rpcUrls: string[];
  symbol: string;
  decimals: number;
  blockExplorerUrls: string[];
  multicallAddress?: string;
}

class ChainDetails {
  readonly networkName: string;
  readonly symbol: string;
  readonly decimals: number;
  readonly rpcUrls: string[];
  readonly blockExplorerUrls: string[];
  readonly multicallAddress?: string;
  readonly provider: Promise<Provider>;

  constructor(chainDetailsOpts: ChainDetailsOpts) {
    this.networkName = chainDetailsOpts.networkName;
    this.rpcUrls = chainDetailsOpts.rpcUrls;
    this.symbol = chainDetailsOpts.symbol;
    this.decimals = chainDetailsOpts.decimals;
    this.blockExplorerUrls = chainDetailsOpts.blockExplorerUrls;
    this.multicallAddress = chainDetailsOpts.multicallAddress;

    // Use the fastest node available
    this.provider = ChainDetails.getFastestRpcUrl(this.rpcUrls).then((rpcUrl) => {
      const staticProvider = new StaticJsonRpcProvider(rpcUrl);
      if (this.multicallAddress) {
        return new MulticallProvider(
          this.networkName,
          staticProvider,
          this.multicallAddress
        );
      } else {
        return staticProvider;
      }
    });
  }

  // Return the fastest rpcUrl available
  private static async getFastestRpcUrl(rpcUrls: string[]): Promise<string> {
    return Promise.any(
      rpcUrls.map(
        (rpcUrl) =>
          new Promise<string>((resolve, reject) => {
            NodeHelper.checkNodeStatus(rpcUrl).then((working) => {
              if (working) {
                resolve(rpcUrl);
              } else {
                reject();
              }
            });
          })
      )
    );
  }
}

interface AllChainDetails {
  [key: number]: ChainDetails | any;
}

const allChains: AllChainDetails = {
  [NetworkIds.FantomOpera]: {
    networkName: "Fantom Opera",
    rpcUrls: [
      // this is just a test, have our node and one other
      // 'https://summer-frosty-cherry.fantom.quiknode.pro/40823c8d106b70145e5cb78de1751d9ecadc5f1d/',
      "https://rpc.ankr.com/fantom",
      "https://rpc.ftm.tools",
      "https://rpc3.fantom.network",
      "https://rpc.fantom.network",
      "https://rpcapi.fantom.network",
      "https://rpc2.fantom.network",
      // 'https://rpc.neist.io',
    ],
    symbol: "FTM",
    decimals: 18,
    blockExplorerUrls: ["https://ftmscan.com/"],
    multicallAddress: "0xe4CC2532B2b1EC585310682af3656b2E4B6fab58",
  },
  [NetworkIds.FantomTestnet]: {
    networkName: "Fantom testnet",
    rpcUrls: ["https://rpc.testnet.fantom.network/"],
    decimals: 18,
    symbol: "FTM",
    blockExplorerUrls: [],
  },
  [NetworkIds.Moonriver]: {
    networkName: "Moonriver",
    rpcUrls: ["https://rpc.api.moonbeam.network"],
    symbol: "MOVR",
    decimals: 18,
    blockExplorerUrls: ["https://blockscout.moonriver.moonbeam.network/"],
    multicallAddress: "0x43D002a2B468F048028Ea9C2D3eD4705a94e68Ae",
  },
  [NetworkIds.MoonbaseAlpha]: {
    networkName: "Moonbase Alpha",
    rpcUrls: ["https://rpc.api.moonbase.moonbeam.network/"],
    symbol: "DEV",
    decimals: 18,
    blockExplorerUrls: ["https://moonbase-blockscout.testnet.moonbeam.network/"],
  },
  [NetworkIds.Ethereum]: {
    networkName: "Ethereum",
    rpcUrls: ["https://mainnet.infura.io/v3/84842078b09946638c03157f83405213"],
    symbol: "ETH",
    decimals: 18,
    blockExplorerUrls: ["https://etherscan.io/"],
    multicallAddress: "0x5ba1e12693dc8f9c48aad8770482f4739beed696",
  },
  [NetworkIds.Rinkeby]: {
    networkName: "Rinkeby",
    rpcUrls: [
      // 'https://rinkeby.infura.io/v3/84842078b09946638c03157f83405213',
      "https://eth-rinkeby.alchemyapi.io/v2/EWSLdTPfKsidqzm4f_kvJPaX5HI8A-D8",
    ],
    symbol: "ETH",
    decimals: 18,
    blockExplorerUrls: ["https://rinkeby.etherscan.io/"],
    multicallAddress: "0x5ba1e12693dc8f9c48aad8770482f4739beed696",
  },
  [NetworkIds.Goerli]: new ChainDetails({
    networkName: "Goerli",
    rpcUrls: [
      "https://eth-goerli.public.blastapi.io",
      "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      "https://rpc.ankr.com/eth_goerli",
    ],
    symbol: "ETH",
    decimals: 18,
    blockExplorerUrls: ["https://goerli.etherscan.io/"],
    multicallAddress: "0x5ba1e12693dc8f9c48aad8770482f4739beed696",
  }),
  [NetworkIds.Avalanche]: {
    networkName: "Avalanche Network",
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    symbol: "AVAX",
    decimals: 18,
    blockExplorerUrls: ["https://snowtrace.io/"],
  },
  [NetworkIds.Bsc]: {
    networkName: "Smart Chain",
    rpcUrls: ["https://bsc-dataseed.binance.org/"],
    symbol: "BNB",
    decimals: 18,
    blockExplorerUrls: ["https://bscscan.com/"],
  },
  [NetworkIds.Boba]: {
    networkName: "BOBA L2",
    rpcUrls: ["https://mainnet.boba.network/"],
    symbol: "ETH",
    decimals: 18,
    blockExplorerUrls: ["https://blockexplorer.boba.network/"],
  },
};

const enableNetworkIds = (process.env["NX_ENABLE_NETWORK_IDS"] || "")
  .trim()
  .split(",")
  .filter((item) => !!item);

const availableChains: AllChainDetails = {};
if (!enableNetworkIds.length) {
  // eslint-disable-next-line array-callback-return
  Object.keys(allChains).map((key: string) => {
    availableChains[Number(key)] = new ChainDetails(allChains[Number(key)]);
  });
} else {
  // eslint-disable-next-line array-callback-return
  enableNetworkIds.map((networkId: string) => {
    availableChains[Number(networkId)] = new ChainDetails(allChains[Number(networkId)]);
  });
}

export const chains = availableChains;
