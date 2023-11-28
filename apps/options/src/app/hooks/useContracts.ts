import { useWeb3Context } from "@fantohm/shared-web3";
import { useSelector } from "react-redux";
import { useMemo } from "react";

import {
  getDAIContract,
  getMarketContract,
  getMarketManagerContract,
  getVaultContract,
  getVaultManagerContract,
} from "../helpers/contractHelpers";
import { BINARY_ADDRESSES, desiredNetworkId } from "../core/constants/network";
import { RootState } from "../store";
import { MarketManagerData } from "../store/reducers/markets-slice";

export const useDAIContract = () => {
  const { provider, chainId, address } = useWeb3Context();
  return useMemo(
    () =>
      getDAIContract(
        BINARY_ADDRESSES[desiredNetworkId].DAI_ADDRESS,
        provider?.getSigner()
      ),
    [provider, chainId, address]
  );
};

export const useMarketManagerContract = () => {
  const { provider, chainId, address } = useWeb3Context();
  return useMemo(
    () =>
      getMarketManagerContract(
        BINARY_ADDRESSES[desiredNetworkId].MARKET_MANAGER_ADDRESS,
        provider?.getSigner()
      ),
    [provider, chainId, address]
  );
};

export const useMarketContract = () => {
  const { provider, chainId, address } = useWeb3Context();
  const markets: MarketManagerData = useSelector((state: RootState) => state.markets);
  return useMemo(
    () =>
      getMarketContract(
        markets && markets.markets[0]
          ? markets.markets[0].market
          : "0x0000000000000000000000000000000000000000",
        provider?.getSigner()
      ),
    [provider, chainId, address, markets.isLoading]
  );
};

export const useVaultManagerContract = () => {
  const { provider, chainId, address } = useWeb3Context();
  return useMemo(
    () =>
      getVaultManagerContract(
        BINARY_ADDRESSES[desiredNetworkId].VAULT_MANAGER_ADDRESS,
        provider?.getSigner()
      ),
    [provider, chainId, address]
  );
};

export const useVaultContract = () => {
  const { provider, chainId, address } = useWeb3Context();
  const vaults = useSelector((state: RootState) => state.vaults);
  return useMemo(
    () =>
      getVaultContract(
        vaults && vaults.vaults[0]
          ? vaults.vaults[0].vault
          : "0x0000000000000000000000000000000000000000",
        provider?.getSigner()
      ),
    [provider, chainId, address]
  );
};
