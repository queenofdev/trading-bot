import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Backdrop, Box, Button, CssBaseline, Fade, Paper } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { USDBDark, USDBLight } from "@fantohm/shared-ui-themes";
import Mint from "./pages/mint/mint";
import {
  calcBondDetails,
  calcGlobalBondDetails,
  calcInvestmentDetails,
  calculateAllUserBondDetails,
  defaultNetworkId,
  fetchTokenPrice,
  isDev,
  loadAccountDetails,
  NetworkIds,
  saveNetworkId,
  useBonds,
  useInvestments,
  useWeb3Context,
} from "@fantohm/shared-web3";
import { StakingChoicePage } from "./pages/staking-choice/staking-choice";
import { Footer, Header } from "./components/template";
import { ScrollToTop } from "./components/scroll-to-top/scroll-to-top";
import { Messages } from "./components/messages/messages";
import { XfhmLqdrPage } from "./pages/xfhm-lqdr/xfhm-lqdr";
import { TradFiDeposit } from "./pages/trad-fi/deposit/deposit";
import { TradFi } from "./pages/trad-fi/trad-fi";
import { MyAccount } from "./pages/my-account/my-account";
import { RootState } from "./store";
import { loadAppDetails } from "./store/reducers/app-slice";
import StakingV1Page from "./pages/staking-v1/staking-v1";
import { MintNftPage } from "./pages/backed-nft/mint-nft";
import Amps from "./pages/amps/amps";
import HomePage from "./pages/home/home-page";
import Typography from "@mui/material/Typography";
import style from "./pages/trad-fi/deposit/deposit.module.scss";
import BalanceVault from "./pages/balance-vault/balanceVault";
import BalanceVaultDetailsPage from "./pages/balance-vault-details-page/balance-vault-details-page";
import PortfolioPage from "./pages/portfolio/portfolio-page";

export const App = (): JSX.Element => {
  const dispatch = useDispatch();

  const themeType = useSelector((state: RootState) => state.app.theme);
  const [theme, setTheme] = useState(USDBDark);
  const { address, chainId, connected } = useWeb3Context();
  const { bonds, allBonds } = useBonds(chainId || defaultNetworkId);
  const { investments } = useInvestments();
  const [promptTerms, setPromptTerms] = useState<boolean>(
    localStorage.getItem("termsAgreed") !== "true"
  );
  const [isChecked, setIsChecked] = useState<boolean>(false);

  useEffect(() => {
    setTheme(themeType === "light" ? USDBLight : USDBDark);
  }, [themeType]);

  useEffect(() => {
    // if we aren't connected or don't yet have a chainId, we shouldn't try and load details
    if (!connected || !chainId) return;
    dispatch(loadAppDetails({ networkId: chainId || defaultNetworkId }));
    bonds.map((bond) => {
      dispatch(
        calcBondDetails({ bond, value: "", networkId: chainId || defaultNetworkId })
      );
    });
    dispatch(calcGlobalBondDetails({ allBonds }));
    investments.forEach((investment) => {
      dispatch(calcInvestmentDetails({ investment }));
      dispatch(fetchTokenPrice({ investment }));
    });
  }, [chainId, address, dispatch, connected]);

  // Load account details
  useEffect(() => {
    if (address) {
      dispatch(loadAccountDetails({ networkId: chainId || defaultNetworkId, address }));
      dispatch(
        calculateAllUserBondDetails({
          address,
          allBonds: bonds,
          networkId: chainId || defaultNetworkId,
        })
      );
    }
  }, [chainId, address, dispatch]);

  const location = useLocation();
  useEffect(() => {
    //console.log(location.pathname);
    switch (location.pathname) {
      case "/trad-fi":
      case "/staking":
      case "/backed-nft":
      case "/about":
      case "/amps":
      case "/staking-v1":
        document.body.classList.add("heroBackground");
        break;
      default:
        document.body.classList.remove("heroBackground");
    }
  }, [location]);

  const handleAgree = () => {
    setPromptTerms(false);
    localStorage.setItem("termsAgreed", "true");
  };

  saveNetworkId(isDev() ? NetworkIds.FantomTestnet : NetworkIds.FantomOpera);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {promptTerms ? (
        <Box paddingTop={5} paddingBottom={12} sx={{ height: "100vh" }}>
          <Fade in={true} mountOnEnter unmountOnExit>
            <Backdrop open={true} className={` ${style["backdropElement"]}`}>
              <Paper className={` ${style["paperContainerSm"]}`}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    flexDirection: "column",
                  }}
                  className={style["closeDeposit"]}
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
                    className={style["closeDeposit"]}
                  >
                    <input
                      type="checkbox"
                      defaultChecked={isChecked}
                      onChange={() => setIsChecked(!isChecked)}
                    />
                    <Typography>
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
          <ScrollToTop />
          <Messages />
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/staking" element={<StakingChoicePage />} />
            <Route path="/staking-v1" element={<StakingV1Page />} />
            <Route path="/trad-fi" element={<TradFi />}>
              <Route path="/trad-fi/deposit/:bondType" element={<TradFiDeposit />} />
            </Route>
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/xfhm" element={<XfhmLqdrPage />} />
            <Route path="/mint" element={<Mint />} />
            <Route path="/backed-nft" element={<MintNftPage />} />
            <Route path="/amps" element={<Amps />} />
            <Route path="/my-account" element={<MyAccount />} />
            <Route path="/vault" element={<BalanceVault />} />
            <Route path="/vault/:vaultId" element={<BalanceVaultDetailsPage />} />
            <Route
              path="*"
              element={
                <main style={{ padding: "1rem" }}>
                  <p>There's nothing here!</p>
                </main>
              }
            />
          </Routes>
          <Footer />
        </Box>
      )}
    </ThemeProvider>
  );
};

export default App;
