import { isDev, NetworkIds } from "@fantohm/shared-web3";

export const desiredNetworkId = isDev ? NetworkIds.Goerli : NetworkIds.Ethereum;
export const BINARY_ADDRESSES = {
  [NetworkIds.Goerli]: {
    MARKET_MANAGER_ADDRESS: "0x141824063fE1E9052DA2Bb9B35014b985fF0AbF7",
    VAULT_MANAGER_ADDRESS: "0xF89F92c4Ff4344662c34319c0Cdf36F237F02E55",
    DAI_ADDRESS: "0x5Ad048cf68111b81780b0284582C99Cd581ede9e",
  },
  [NetworkIds.Ethereum]: {
    MARKET_MANAGER_ADDRESS: "",
    VAULT_MANAGER_ADDRESS: "",
    DAI_ADDRESS: "0x6b175474e89094c44da98b954eedeac495271d0f",
  },
};

export const VAULT_ADDRESS = "0x45e7953E6970A3486F6499A4b9eA85B4fB6B1715";
