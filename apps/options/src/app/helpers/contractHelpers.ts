import { Contract, ethers } from "ethers";
import { isDev } from "@fantohm/shared-web3";

import marketABI from "../core/abi/BinaryMarketABI.json";
import marketManagerABI from "../core/abi/BinaryMarketManagerABI.json";
import vaultABI from "../core/abi/BinaryVaultABI.json";
import vaultManagerABI from "../core/abi/BinaryVaultManagerABI.json";
import daiABI from "../core/abi/DAI.json";
import ERC20ABI from "../core/abi/ERC20.json";

export const getContract = ({
  abi,
  address,
  signer,
}: {
  abi: ethers.ContractInterface;
  address: string;
  signer: ethers.providers.Provider | ethers.Signer | undefined;
}) => {
  return new Contract(address, abi, signer);
};

export const getVaultContract = (
  address: string,
  signer: ethers.providers.Provider | ethers.Signer | undefined
) => {
  return getContract({ abi: vaultABI, address, signer });
};

export const getVaultManagerContract = (
  address: string,
  signer: ethers.providers.Provider | ethers.Signer | undefined
) => {
  return getContract({
    abi: vaultManagerABI as ethers.ContractInterface,
    address,
    signer,
  });
};

export const getMarketContract = (
  address: string,
  signer: ethers.providers.Provider | ethers.Signer | undefined
) => {
  return getContract({ abi: marketABI, address, signer });
};

export const getMarketManagerContract = (
  address: string,
  signer: ethers.providers.Provider | ethers.Signer | undefined
) => {
  return getContract({ abi: marketManagerABI, address, signer });
};

export const getDAIContract = (
  address: string,
  signer: ethers.providers.Provider | ethers.Signer | undefined
) => {
  return getContract({ abi: isDev ? ERC20ABI : daiABI, address, signer });
};

export const getERC20Contract = (
  address: string,
  signer: ethers.providers.Provider | ethers.Signer | undefined
) => {
  return getContract({ abi: ERC20ABI, address, signer });
};
