import { BigNumber, ethers } from "ethers";
import { useQuery } from "@tanstack/react-query";
import { ierc20Abi } from "../abi";
import { useWeb3Context } from "../web3-context";

export type UseErc20BalanceResponse = {
  balance: BigNumber | undefined;
  isLoading: boolean;
  error: unknown;
};

export type Erc20BalanceOfResponse = BigNumber;

/**
 * Returns balance of an ERC20 token for a particular wallet
 *
 * @param contractAddress erc20 to load the balance from
 * @param walletAddress user who's balance you want to load
 *
 */
export const useErc20Balance = (
  erc20Address: string,
  walletAddress: string
): UseErc20BalanceResponse => {
  const { provider } = useWeb3Context();

  const {
    data: balance,
    isLoading,
    error,
  } = useQuery(
    ["getErc20Balance"],
    () => {
      const contract = new ethers.Contract(
        erc20Address ?? "",
        ierc20Abi,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        provider!
      );
      const balance = contract["balanceOf"](walletAddress);
      return balance;
    },
    { enabled: provider !== null }
  );

  return { balance, isLoading, error };
};
