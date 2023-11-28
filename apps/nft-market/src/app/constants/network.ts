import { isDev, NetworkIds } from "@fantohm/shared-web3";

export const desiredNetworkId = isDev ? NetworkIds.Goerli : NetworkIds.Ethereum;
