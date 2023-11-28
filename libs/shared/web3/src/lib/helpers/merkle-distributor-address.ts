import { NetworkIds, networks } from "../networks";

export const getMerkleDistributorAddress = (network: NetworkIds) => {
  const addresse = networks[network].addresses["MERKLE_DISTRIBUTOR"] || "";

  return addresse;
};
