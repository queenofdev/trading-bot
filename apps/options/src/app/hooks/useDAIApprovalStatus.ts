import { BigNumber } from "ethers";
import { TransactionReceipt, TransactionResponse } from "@ethersproject/providers";
import { useWeb3Context } from "@fantohm/shared-web3";
import { useDispatch, useSelector } from "react-redux";
import { useState, useCallback, useMemo } from "react";

import { useDAIContract } from "./useContracts";
import { RootState } from "../store";
import { addAlert } from "../store/reducers/app-slice";

type ErrorData = {
  code: number;
  message: string;
};

type TxError = {
  data: ErrorData;
  error: string;
};

export type TxResponse = TransactionResponse | null;

const isGasEstimationError = (err: TxError): boolean => err?.data?.code === -32000;

export const isUserRejected = (err: any) => {
  // provider user rejected error code
  return typeof err === "object" && "code" in err && err.code === 4001;
};

export type CatchTxErrorReturn = {
  fetchWithCatchTxError: (
    fn: () => Promise<TxResponse>
  ) => Promise<TransactionReceipt | null>;
  loading: boolean;
};

export default function useCatchTxError(): CatchTxErrorReturn {
  const dispatch = useDispatch();
  const { provider } = useWeb3Context();
  const [loading, setLoading] = useState(false);

  const handleNormalError = useCallback((error, tx?: TxResponse) => {
    console.log(error);

    if (tx) {
      dispatch(
        addAlert({
          title: tx.hash,
          message:
            "Please try again. Confirm the transaction and make sure you are paying enough gas!",
          severity: "error",
        })
      );
    } else {
      dispatch(
        addAlert({
          severity: "error",
          message:
            "Please try again. Confirm the transaction and make sure you are paying enough gas!",
        })
      );
    }
  }, []);

  const fetchWithCatchTxError = useCallback(
    async (callTx: () => Promise<TxResponse>): Promise<TransactionReceipt | null> => {
      let tx: TxResponse = null;

      try {
        setLoading(true);
        tx = await callTx();

        dispatch(
          addAlert({
            severity: "success",
            message: "Transaction Submitted",
            title: tx ? tx.hash : "",
          })
        );
        const receipt = tx ? await tx.wait() : null;

        return receipt;
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
      return null;
    },
    [handleNormalError, provider]
  );

  return { fetchWithCatchTxError, loading };
}

export const useAllowanceDAIAmount = () => {
  const account = useSelector((state: RootState) => state.account);
  const { address } = useWeb3Context();
  try {
    return useMemo(() => account.accountDetail["dai"].allowance, [address]);
  } catch (err) {
    console.log(err);
    return BigNumber.from(0);
  }
};

export const useCheckERC20TokenAmount = () => {
  const { address } = useWeb3Context();
  const daiContract = useDAIContract();
  try {
    return useMemo(() => daiContract["balanceOf"](address), [address]);
  } catch (err) {
    console.log(err);
    return BigNumber.from(0);
  }
};
