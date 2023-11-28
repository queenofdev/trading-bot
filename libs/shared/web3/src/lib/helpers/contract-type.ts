import { ethers } from "ethers";
import { isDev } from ".";
import { cryptopunksAbi, erc1155Abi, ierc721Abi } from "../abi";
import { addresses } from "../constants";
import { NetworkIds } from "../networks";
import { getLendingAddressConfig } from "./usdb-lending-address";

export enum TokenType {
  ERC721,
  ERC1155,
  CRYPTO_PUNKS,
}

export const ercType = async (contract: ethers.Contract): Promise<TokenType> => {
  if (
    contract.address.toLowerCase() ===
    addresses[isDev ? NetworkIds.Goerli : NetworkIds.Ethereum][
      "CRYPTOPUNKS_ADDRESS"
    ].toLowerCase()
  ) {
    return TokenType.CRYPTO_PUNKS;
  }
  try {
    const is721 = await contract["methods"].supportsInterface("0x80ac58cd").call();
    if (is721) {
      return TokenType.ERC721;
    }
    const is1155 = await contract["methods"].supportsInterface("0xd9b67a26").call();
    if (is1155) {
      return TokenType.ERC1155;
    }
  } catch (err) {
    console.warn("Unable to determine contract type from address or interface");
  }

  return TokenType.ERC721;
};

export const getErc721Permission = async (
  signer: ethers.providers.JsonRpcSigner,
  networkId: number,
  address: string,
  tokenId: string
) => {
  const nftContract = new ethers.Contract(address, ierc721Abi, signer);
  return await nftContract["approve"](
    getLendingAddressConfig(networkId).currentVersion,
    tokenId
  );
};

export const getErc1155Permission = async (
  signer: ethers.providers.JsonRpcSigner,
  networkId: number,
  address: string
) => {
  const nftContract = new ethers.Contract(address, erc1155Abi, signer);
  return await nftContract["setApprovalForAll"](
    getLendingAddressConfig(networkId).currentVersion
  );
};

export const getCryptoPunksPermission = async (
  signer: ethers.providers.JsonRpcSigner,
  networkId: number,
  address: string,
  tokenId: string
) => {
  const nftContract = new ethers.Contract(address, cryptopunksAbi, signer);
  return await nftContract["offerPunkForSaleToAddress"](
    tokenId,
    0,
    getLendingAddressConfig(networkId).currentVersion
  );
};

export const checkErc721Permission = async (
  signer: ethers.providers.JsonRpcSigner,
  networkId: number,
  address: string,
  tokenId: string
): Promise<boolean> => {
  const nftContract = new ethers.Contract(address, ierc721Abi, signer);
  return await nftContract["approve"](
    getLendingAddressConfig(networkId).currentVersion,
    tokenId
  );
};

export const checkErc1155Permission = async (
  signer: ethers.providers.JsonRpcSigner,
  networkId: number,
  ownerAddress: string,
  address: string
): Promise<boolean> => {
  const nftContract = new ethers.Contract(address, erc1155Abi, signer);
  return await nftContract["isApprovedForAll"](
    ownerAddress,
    getLendingAddressConfig(networkId).currentVersion
  );
};

export const checkCryptoPunksPermission = async (
  signer: ethers.providers.JsonRpcSigner,
  networkId: number,
  address: string,
  tokenId: string
): Promise<boolean> => {
  const nftContract = new ethers.Contract(address, cryptopunksAbi, signer);
  // should return Offer(true, punkIndex, msg.sender, minSalePriceInWei, toAddress);
  return await nftContract["punksOfferedForSale"](tokenId);
};
