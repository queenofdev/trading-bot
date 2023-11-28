import { Web3ContextProvider } from "@fantohm/shared-web3";
import { useLayoutEffect, useState } from "react";
import { Provider } from "react-redux";
// eslint-disable-next-line node/no-extraneous-import
import { useLocation } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";

import { App } from "./app";
import store from "./store";

const ScrollToTop = (props: any) => {
  const [prevPath, setPrevPath] = useState("");
  const location = useLocation();
  useLayoutEffect(() => {
    const prevBaseRoute = prevPath.split("/")[1];
    const baseRoute = location.pathname.split("/")[1];
    if (
      prevBaseRoute !== baseRoute ||
      (baseRoute !== "my-account" && baseRoute !== "account")
    ) {
      document.body.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    setPrevPath(location.pathname);
  }, [location]);

  return null;
};

const Root = (): JSX.Element => {
  return (
    <Web3ContextProvider>
      <Provider store={store}>
        <BrowserRouter>
          <ScrollToTop />
          <App />
        </BrowserRouter>
      </Provider>
    </Web3ContextProvider>
  );
};

export default Root;
