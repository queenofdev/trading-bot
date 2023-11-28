import { NetworkIds, networks } from "../networks";

export const getLendingAddressConfig = (network: NetworkIds) => {
  const addresses = networks[network].USDB_LENDING_ADDRESSES || [];

  return {
    addresses,
    currentVersion: addresses.length > 0 ? addresses[addresses.length - 1] : "",
  };
};
