import { BigNumber, ContractReceipt, ContractTransaction, ethers } from "ethers";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ierc20Abi } from "../abi";
import { useWeb3Context } from "../web3-context";
import { JsonRpcProvider } from "@ethersproject/providers";

export type UseGetErc20AllowanceResponse = {
  allowance: BigNumber | undefined;
  isLoading: boolean;
  error: unknown;
};

export type Erc20AllowanceResponse = BigNumber;

/**
 * Returns allowance of an ERC20 token for a particular wallet
 *
 * @param contractAddress erc20 to load the balance from
 * @param walletAddress user who's balance you want to load
 *
 */
export const useGetErc20Allowance = (
  erc20Address: string,
  walletAddress: string,
  spenderAddress: string
): UseGetErc20AllowanceResponse => {
  const { provider } = useWeb3Context();

  const {
    data: allowance,
    isLoading,
    error,
  } = useQuery(
    ["getErc20Allowance"],
    () => {
      const contract = new ethers.Contract(
        erc20Address ?? "",
        ierc20Abi,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        provider!
      );
      const allowance = contract["allowance"](walletAddress, spenderAddress);
      return allowance;
    },
    { enabled: provider !== null }
  );

  return { allowance, isLoading, error };
};

export type UseRequestErc20AllowanceResponse = {
  mutation: UseMutationResult<unknown, unknown, void, unknown>;
};

/**
 * Returns allowance of an ERC20 token for a particular wallet
 *
 * @param contractAddress erc20 to load the balance from
 * @param walletAddress user who's balance you want to load
 *
 */
export const useRequestErc20Allowance = (
  erc20Address: string,
  spender: string,
  amount: BigNumber
): UseRequestErc20AllowanceResponse => {
  const { provider } = useWeb3Context();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    ["requestErc20Allowance"],
    () => {
      console.log("erc20Address", erc20Address);
      console.log("spender", spender);
      console.log("amount", ethers.utils.formatUnits(amount, 18));
      if (!provider) {
        throw new Error("Provider not found");
        return;
      }
      const signer = provider.getSigner();
      const contract = new ethers.Contract(erc20Address ?? "", ierc20Abi, signer);
      return contract["approve"](spender, amount)
        .then((txn: ContractTransaction) => txn.wait())
        .then((response: ContractReceipt) => {
          console.log(response);
          queryClient.invalidateQueries(["getErc20Allowance"]);
        });
    },
    {
      onMutate: () => {
        queryClient.invalidateQueries(["getErc20Allowance"]);
      },
    }
  );

  return { mutation };
};
