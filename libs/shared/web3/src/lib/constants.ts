import { enabledNetworkIds, networks } from "./networks";

export const THE_GRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/colonelssecretspices/kfc-graph";

export const PROD_UAUTH_CLIENT_ID = "3f2f2417-c736-44e2-b2af-84b426fac4db";

export const TEST_UAUTH_CLIENT_ID = "92f83af0-91c9-45ec-95a8-3f7304147cc1";

export const TEST_UD_REDIRECT_URI = "https://mvp.liqdnft.com";

export const PROD_UD_REDIRECT_URI = "https://beta.liqdnft.com";

interface IAddresses {
  [key: number]: { [key: string]: string };
}

export const addresses: IAddresses = enabledNetworkIds.reduce(
  (addresses: { [key: number]: { [key: string]: string } }, networkId) => (
    (addresses[networkId] = networks[networkId].addresses), addresses
  ),
  {}
);
