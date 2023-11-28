import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Backdrop, Box, Button, CssBaseline, Fade, Paper } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { NftLight, NftDark } from "@fantohm/shared-ui-themes";
import {
  useWeb3Context,
  defaultNetworkId,
  isDev,
  saveNetworkId,
  NetworkIds,
} from "@fantohm/shared-web3";
import { Header, Footer } from "./components/template";
// import { Messages } from "./components/messages/messages";
import { RootState } from "./store";
import { BorrowPage } from "./pages/borrow-page/borrow-page";
import { LendPage } from "./pages/lend-page/lend-page";
import { MyAccountPage } from "./pages/my-account-page/my-account-page";
import MyAccountDetails from "./pages/my-account-page/my-account-details/my-account-details";
import MyAccountLoans from "./pages/my-account-page/my-account-loans/my-account-loans";
import MyAccountOffers from "./pages/my-account-page/my-account-offers/my-account-offers";
import MyAccountAssets from "./pages/my-account-page/my-account-assets/my-account-assets";
import MyAccountActivity from "./pages/my-account-page/my-account-activity/my-account-activity";
import { setCheckedConnection } from "./store/reducers/app-slice";
import { authorizeAccount, logout } from "./store/reducers/backend-slice";
import Typography from "@mui/material/Typography";
import { AssetDetailsPage } from "./pages/asset-details-page/asset-details-page";
import { TestHelper } from "./pages/test-helper/test-helper";
import Growl from "./components/growl/growl";
import { desiredNetworkId } from "./constants/network";
import BlogPage from "./pages/blog/blog-page";
import BlogPostPage from "./pages/blog/blog-post-page";
import { DebugHelper } from "@fantohm/shared-helpers";
import PrivacyPage from "./components/Privacy/privacy";
import TermsPage from "./components/Terms-Condition/terms";
import { NewHomePage } from "./pages/home-page";
import HelpPage from "./components/help/help";
import { InfoBtn } from "./components/template/info/info";
import Referral from "./pages/referral";
import { saveAffiliateCode } from "./store/reducers/affiliate-slice";

export const App = (): JSX.Element => {
  const dispatch = useDispatch();

  // if we're on dev but testnets aren't enabled, do it.
  const navigate = useNavigate();
  const location = useLocation();
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

  const themeType = useSelector((state: RootState) => state.theme.mode);
  const { user, authorizedAccount, accountStatus } = useSelector(
    (state: RootState) => state.backend
  );
  const { authSignature } = useSelector((state: RootState) => state.backend);
  const [promptTerms, setPromptTerms] = useState<boolean>(
    true
    //TODO localStorage.getItem("termsAgreedUsdb") !== "true"
  );
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [theme, setTheme] = useState(NftLight);
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
    setTheme(themeType === "light" ? NftLight : NftDark);
    switch (themeType) {
      case "dark":
        document.body.classList.add("darkTheme");
        document.body.classList.remove("lightTheme");
        break;
      case "light":
        document.body.classList.add("lightTheme");
        document.body.classList.remove("darkTheme");
    }
  }, [themeType]);

  // if the wallet address doesn't equal the logged in user, log out
  useEffect(() => {
    if (
      address &&
      user &&
      user.address &&
      address.toLowerCase() !== user.address.toLowerCase()
    ) {
      dispatch(logout());
    }
  }, [address, user]);

  // check for cached wallet connection
  useEffect(() => {
    // if there's a cached provider, try and connect
    if (hasCachedProvider && hasCachedProvider() && !connected) {
      try {
        connect(true, isDev ? NetworkIds.Goerli : NetworkIds.Ethereum);
      } catch (e) {
        console.log("Connection metamask error", e);
      }
    }
    // if there's a cached provider and it has connected, connection check is good.
    if (hasCachedProvider && hasCachedProvider() && connected)
      dispatch(setCheckedConnection(true));

    // if there's not a cached provider and we're not connected, connection check is good
    if (hasCachedProvider && !hasCachedProvider() && !connected)
      dispatch(setCheckedConnection(true));
  }, [connected, hasCachedProvider, connect]);

  // when a user connects their wallet login to the backend api
  useEffect(() => {
    const curStorage: string = localStorage.getItem("termsAgreedUsdb") + "";
    if (promptTerms && !curStorage?.includes(address)) {
      setPromptTerms(false);
    }
    if (
      provider &&
      connected &&
      address &&
      (!authorizedAccount || address.toLowerCase() !== authorizedAccount.toLowerCase()) &&
      accountStatus !== "pending" &&
      typeof user.address == "undefined" &&
      promptTerms
    ) {
      dispatch(
        authorizeAccount({
          networkId: chainId || defaultNetworkId,
          address,
          provider,
          onFailed: () => {
            disconnect();
            dispatch(logout());
          },
        })
      );
    }
  }, [provider, address, connected, authorizedAccount, accountStatus, user, promptTerms]);

  // when a user connects their wallet login to the backend api
  useEffect(() => {
    if (provider && connected && address) {
      const focused = localStorage.getItem("tabFocused") === "true";
      if (focused && switchEthereumChain && chainId !== desiredNetworkId) {
        switchEthereumChain(desiredNetworkId).then((result) => {
          if (!result) {
            disconnect();
            dispatch(logout());
          }
        });
      }
    }
  }, [provider, address, connected]);

  // Affilate system
  const [params] = useSearchParams();
  const referralCode = params.get("ref");

  const isWalletConnected = useMemo(() => {
    return address && authSignature && connected && chainId === desiredNetworkId;
  }, [address, authSignature, connected, chainId]);

  useEffect(() => {
    if (address && connected && referralCode && isWalletConnected) {
      dispatch(
        saveAffiliateCode({
          address,
          referralCode,
        })
      );
    }
  }, [address, connected, referralCode, isWalletConnected]);

  // User has switched back to the tab
  const onFocus = () => {
    localStorage.setItem("tabFocused", "true");
  };

  // User has switched away from the tab (AKA tab is hidden)
  const onBlur = () => {
    localStorage.setItem("tabFocused", "false");
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

  const handleAgree = () => {
    setPromptTerms(true);
    let curStorage: string = localStorage.getItem("termsAgreedUsdb") ?? "";
    if (!curStorage?.includes(address)) {
      curStorage = curStorage?.concat(" ", address);
    }
    localStorage.setItem("termsAgreedUsdb", curStorage);
  };
  const handleCheck = () => {
    setIsChecked(!isChecked);
  };

  saveNetworkId(isDev ? NetworkIds.Goerli : NetworkIds.Ethereum);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!promptTerms ? (
        <Box paddingTop={5} paddingBottom={12} sx={{ height: "100vh" }}>
          <Fade in={true} mountOnEnter unmountOnExit>
            <Backdrop open={true} className={` ${"backdropElement"}`}>
              <Paper className={` ${"paperContainer"}`}>
                <Box
                  sx={{ display: "block", justifyContent: "flex-end" }}
                  className={"closeDeposit"}
                >
                  <Typography>
                    Accept the Terms of Service and Privacy Policy.{" "}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "20px",
                    }}
                    className={"closeDeposit"}
                  >
                    <input
                      type="checkbox"
                      onChange={() => setIsChecked(!isChecked)}
                      checked={isChecked}
                    />
                    <Typography onClick={handleCheck}>
                      I agree that I have read, understood and accepted all of the{" "}
                      <a
                        href={"./../assets/Terms_and_Conditions.pdf"}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Terms
                      </a>{" "}
                      and{" "}
                      <a href="./../assets/Privacy_Policy.pdf" target="_blank">
                        Privacy Policy
                      </a>{" "}
                      .
                    </Typography>
                  </Box>
                </Box>
                <Button
                  style={{ marginTop: "20px" }}
                  variant="contained"
                  color="primary"
                  disabled={!isChecked}
                  onClick={handleAgree}
                >
                  Agree
                </Button>
              </Paper>
            </Backdrop>
          </Fade>
        </Box>
      ) : (
        <Box paddingTop={5} paddingBottom={12} sx={{ height: "100vh" }}>
          <Header />
          <InfoBtn />
          <Growl />
          <Box sx={{ minHeight: "calc(100% - 194px)" }} className={"mainContent"}>
            <Routes>
              <Route path="/" element={<NewHomePage />} />
              <Route path="/borrow" element={<BorrowPage />} />
              <Route path="/lend" element={<LendPage />} />
              <Route
                path="/asset/:contractAddress/:tokenId"
                element={<AssetDetailsPage />}
              />
              <Route path="/my-account" element={<MyAccountPage />}>
                <Route index element={<MyAccountDetails />} />
                <Route path="detail" element={<MyAccountDetails />} />
                <Route path="loans" element={<MyAccountLoans />} />
                <Route path="offers" element={<MyAccountOffers />} />
                <Route path="assets" element={<MyAccountAssets />} />
                <Route path="activity" element={<MyAccountActivity />} />
              </Route>
              <Route path="/account/:walletAddress" element={<MyAccountPage />}>
                <Route index element={<MyAccountDetails />} />
                <Route path="detail" element={<MyAccountDetails />} />
                <Route path="assets" element={<MyAccountAssets />} />
              </Route>
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogPostPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/term" element={<TermsPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/referral" element={<Referral />} />
              <Route
                path="/th"
                element={
                  isDev ? (
                    <TestHelper />
                  ) : (
                    <main style={{ padding: "1rem" }}>
                      <h1>404</h1>
                      <p>There's nothing here!</p>
                    </main>
                  )
                }
              />
              <Route
                path="*"
                element={
                  <main style={{ padding: "1rem" }}>
                    <h1>404</h1>
                    <p>There's nothing here!</p>
                  </main>
                }
              />
            </Routes>
          </Box>
          <Footer />
        </Box>
      )}
    </ThemeProvider>
  );
};

export default App;
