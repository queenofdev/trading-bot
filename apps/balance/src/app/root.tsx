// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { Web3ContextProvider } from "@fantohm/shared-web3";
import { App } from "./app";
import store from "./store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Root = (): JSX.Element => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 1000 & 60, // 1 minute
      },
    },
  });

  return (
    <Web3ContextProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    </Web3ContextProvider>
  );
};

export default Root;
