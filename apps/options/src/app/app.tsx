import { useWeb3Context, isDev, NetworkIds } from "@fantohm/shared-web3";
import { DebugHelper } from "@fantohm/shared-helpers";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useMemo, useCallback } from "react";

import HomePage from "./pages/home/home-page";
import Markets from "./pages/markets/markets";
import Leaderboard from "./pages/leaderboard/leaderboard";
import Pools from "./pages/pools/pools";
import Trade from "./pages/trade/trade";
import Navbar from "./components/navbar/navbar";
import Growl from "./components/growl/growl";
import { RootState } from "./store";
import { setCheckedConnection } from "./store/reducers/app-slice";
import { loadMessages } from "./store/reducers/chat-slice";
import { loadMarkets } from "./store/reducers/markets-slice";
import { loadVault } from "./store/reducers/vaults-slice";
import { getAccountDetails } from "./store/reducers/account-slice";
import { BINARY_ADDRESSES, desiredNetworkId } from "./core/constants/network";

export function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [tabFocused, setTabFocused] = useState(false);
  const vaults = useSelector((state: RootState) => state.vaults);
  const {
    address,
    chainId,
    connected,
    disconnect,
    hasCachedProvider,
    connect,
    provider,
    switchEthereumChain,
  } = useWeb3Context();

  useEffect(() => {
    if (!DebugHelper.isActive("enable-testnet") && isDev) {
      navigate(
        `${location.pathname}${
          location.search ? location.search + "&" : "?"
        }enable-testnets=true${location.hash}`,
        { replace: true }
      );
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    if (hasCachedProvider && hasCachedProvider() && !connected) {
      try {
        connect(true, isDev ? NetworkIds.Goerli : NetworkIds.Ethereum);
      } catch (e) {
        console.log("Connection metamask error: ", e);
      }
    }
    if (hasCachedProvider && hasCachedProvider() && connected)
      dispatch(setCheckedConnection(true));
    if (hasCachedProvider && !hasCachedProvider() && !connected)
      dispatch(setCheckedConnection(true));
  }, [connected, hasCachedProvider, connect]);

  useEffect(() => {
    if (provider && connected && address) {
      const focused = tabFocused === true;
      if (focused && switchEthereumChain && chainId !== desiredNetworkId) {
        switchEthereumChain(desiredNetworkId).then((result) => {
          if (!result) {
            disconnect();
          }
        });
      }
    }
  }, [provider, address, connected]);

  useEffect(() => {
    dispatch(loadMessages());
  }, []);

  useEffect(() => {
    const underlyingTokenAddress = BINARY_ADDRESSES[desiredNetworkId].DAI_ADDRESS;
    if (provider && address && chainId) {
      dispatch(loadMarkets({ provider }));
      dispatch(loadVault({ provider, underlyingTokenAddress }));
      dispatch(
        getAccountDetails({
          address,
          networkId: desiredNetworkId,
          provider,
        })
      );
    }
  }, [provider, address, chainId]);

  // User has switched back to the tab
  const onFocus = () => {
    setTabFocused(true);
  };

  // User has switched away from the tab (AKA tab is hidden)
  const onBlur = () => {
    setTabFocused(false);
  };

  useEffect(() => {
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);
    // Specify how to clean up after this effect:
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen font-InterRegular">
      <Navbar />
      <Growl />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/pools" element={<Pools />} />
        <Route path="/trade" element={<Trade />} />
      </Routes>
    </div>
  );
}

export default App;
