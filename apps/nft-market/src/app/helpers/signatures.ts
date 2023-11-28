import { JsonRpcProvider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { Terms } from "../types/backend-types";
import { nftTokenType } from "../types/contract-types";
import { Erc20Currency } from "./erc20Currency";
import { addAlert } from "../store/reducers/app-slice";

//_payload.borrower, _payload.nftAddress, _payload.currency, _payload.nftTokenId, _payload.duration, _payload.expiration, _payload.loanAmount, _payload.apr, _payload.nftTokenType

export const signTerms = async (
  provider: JsonRpcProvider,
  borrowerAddress: string,
  chainId: number,
  nftContractAddress: string,
  tokenId: string,
  term: Terms,
  currency: Erc20Currency,
  dispatch: any
): Promise<string> => {
  const payload = ethers.utils.defaultAbiCoder.encode(
    [
      "address",
      "address",
      "address",
      "uint256",
      "uint256",
      "uint256",
      "uint256",
      "uint256",
      "uint8",
    ],
    [
      borrowerAddress,
      nftContractAddress,
      currency.currentAddress,
      tokenId,
      term.duration,
      Math.round(Date.parse(term.expirationAt) / 1000),
      ethers.utils.parseUnits(term.amount.toString(), currency.decimals),
      term.apr * 100,
      nftTokenType.ERC721,
    ]
  );
  try {
    const payloadHash = ethers.utils.keccak256(payload);

    const signature = await provider
      .getSigner()
      .signMessage(ethers.utils.arrayify(payloadHash));
    return signature;
  } catch (e: any) {
    if (e.error === undefined) {
      let message;
      if (e.message === "Internal JSON-RPC error.") {
        message = e.data.message;
      } else {
        message = e.message;
      }
      if (typeof message === "string") {
        dispatch(addAlert({ message: `Unknown error: ${message}`, severity: "error" }));
      }
    } else {
      dispatch(
        addAlert({ message: `Unknown error: ${e.error.message}`, severity: "error" })
      );
    }
    return "";
  }
};
