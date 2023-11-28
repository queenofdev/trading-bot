import { useWeb3Context } from "@fantohm/shared-web3";
import { useQuery } from "@tanstack/react-query";
import { request } from "graphql-request";

import { tradeEventQuery } from "../core/apollo/query";
import { GRAPH_URL } from "../core/constants/basic";

export const useTradeHistory = () => {
  const { provider } = useWeb3Context();
  const { data, isLoading, error } = useQuery(
    ["getBettingTransactions"],
    async () =>
      await request(GRAPH_URL, tradeEventQuery, { "Access-Control-Allow-Origin": "*" }),
    { enabled: provider !== null, refetchInterval: 1000 }
  );
  return { data, isLoading, error };
};
