import { Web3ContextProvider } from "@fantohm/shared-web3";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "./app";
import store from "./store";

describe("App", () => {
  it("should render successfully", () => {
    const { baseElement } = render(
      <Web3ContextProvider>
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </Web3ContextProvider>
    );

    expect(baseElement).toBeTruthy();
  });

  it("should have a greeting as the title", () => {
    const { getByText } = render(
      <Web3ContextProvider>
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </Web3ContextProvider>
    );

    expect(getByText(/Welcome nft-market/gi)).toBeTruthy();
  });
});
