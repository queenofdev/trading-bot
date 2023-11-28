import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { USDBLight, USDBDark } from "@fantohm/shared-ui-themes";
import { Footer } from "./components/template";
import { ScrollToTop } from "./components/scroll-to-top/scroll-to-top";
import { Messages } from "./components/messages/messages";
import { BalanceHomePage } from "./pages/home/balance-home-page";
import { BalancePassPage } from "./pages/balance-pass-page/balance-pass-page";
import { RootState } from "./store";
import { loadAppDetails } from "./store/reducers/app-slice";
import BalanceAboutPage from "./pages/balance-about-page/balance-about-page";
import { HomeHeader } from "./components/template/header/home-header";
import FhmPage from "./pages/fhm/fhm-page";
import BlogPage from "./pages/blog/blog-page";
import BlogPostPage from "./pages/blog/blog-post-page";
import BalanceWhitelistMintPage from "./components/balance_whiteList/balance_whitelist_mint";

export const App = (): JSX.Element => {
  const dispatch = useDispatch();

  const themeType = useSelector((state: RootState) => state.app.theme);
  const [theme, setTheme] = useState(USDBDark);

  useEffect(() => {
    setTheme(themeType === "light" ? USDBLight : USDBDark);
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

  useEffect(() => {
    // if we aren't connected or don't yet have a chainId, we shouldn't try and load details
    dispatch(loadAppDetails());
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box paddingTop={5} paddingBottom={12} sx={{ height: "100vh" }}>
        <ScrollToTop />
        <Messages />
        <HomeHeader />
        <Routes>
          <Route path="/" element={<BalanceHomePage />} />
          <Route path="/usdb-about" element={<BalanceAboutPage />} />
          <Route path="/fhm" element={<FhmPage />} />
          <Route path="/about" element={<BalanceAboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/balancepass" element={<BalancePassPage />} />
          {/*<Route path="/balancepass-mint" element={<BalanceWhitelistMintPage />} />*/}
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
    </ThemeProvider>
  );
};

export default App;
