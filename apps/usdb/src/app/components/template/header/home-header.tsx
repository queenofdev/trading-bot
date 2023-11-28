import {
  useWeb3Context,
  setWalletConnected,
  getBalances,
  useBonds,
  trim,
  defaultNetworkId,
  enabledNetworkIds,
} from "@fantohm/shared-web3";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import { Skeleton } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { SvgIcon } from "@mui/material";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import MenuLink from "./menu-link";
import { RootState } from "../../../store";
import { setCheckedConnection, setTheme } from "../../../store/reducers/app-slice";
import { BalanceLogo, BalanceLogoDark } from "@fantohm/shared/images";
import styles from "./home-header.module.scss";
import { NetworkMenu } from "./network-menu";
import { balanceheaderPages, Page } from "../../../constants/nav";
import style from "../../../pages/home/balance-home-page.module.scss";

export const HomeHeader = (): JSX.Element => {
  const { connect, disconnect, connected, address, hasCachedProvider, chainId } =
    useWeb3Context();
  const dispatch = useDispatch();
  const allowedChain = chainId && enabledNetworkIds.includes(chainId);
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElProductsMenu, setAnchorElProductsMenu] = useState<null | HTMLElement>(
    null
  );
  const [connectButtonText, setConnectButtonText] = useState<string>("Connect Wallet");
  const [accountBondsLoading, setAccountBondsLoading] = useState<boolean>(true);
  const [totalBalances, setTotalBalances] = useState<number>(0);

  const themeType = useSelector((state: RootState) => state.app.theme);
  const { bonds } = useBonds(chainId ?? defaultNetworkId);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const toggleTheme = useCallback(() => {
    const type = themeType === "light" ? "dark" : "light";
    dispatch(setTheme(type));
    localStorage.setItem("use-theme", type);
  }, [dispatch, themeType]);

  const useTheme = localStorage.getItem("use-theme");
  if (useTheme) {
    dispatch(setTheme(useTheme === "dark" ? "dark" : "light"));
  }

  const handleCloseProductsMenu = () => {
    setAnchorElProductsMenu(null);
  };

  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    console.log(hash);
    if (hash === "#docs") {
      window.open("https://fantohm.gitbook.io/documentation/", "_blank");
    }

    // if not a hash link, scroll to top
    if (hash === "") {
      window.scrollTo(0, 0);
    }
    // else scroll to id
    else {
      setTimeout(() => {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView();
        }
      }, 0);
    }
  }, [pathname, hash, key]); // do this on route change

  return (
    <AppBar position="static" color="transparent" elevation={0} style={{ margin: 0 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            noWrap
            component="div"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              alignItems: "center",
            }}
          >
            <Link to="/">
              <img
                src={themeType === "light" ? BalanceLogo : BalanceLogoDark}
                alt="USDB logo"
                width="40%"
              />
            </Link>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              className={`${styles["navWrap"]}`}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {balanceheaderPages.map((page: Page) => (
                <MenuLink
                  // href={page.href ? page.href : '#'}
                  href={page?.params?.comingSoon ? "#" : page.href}
                  onClick={handleCloseNavMenu}
                  key={page.title}
                >
                  <Typography
                    textAlign="center"
                    style={{ opacity: page?.params?.comingSoon ? 0.2 : 1 }}
                  >
                    <Button style={{ width: "100%" }}>{page.title}</Button>
                  </Typography>
                </MenuLink>
              ))}
            </Menu>
          </Box>
          <Typography
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            <Link to="/">
              <img
                src={BalanceLogo}
                alt="USDB logo"
                className={`${styles["usdbLogo"]}`}
              />
            </Link>
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "end",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Box>
              <Link
                to={pathname}
                className={
                  themeType === "light" ? styles["headerLink"] : styles["headerLinkDark"]
                }
                onClick={(e) => setAnchorElProductsMenu(e.currentTarget)}
              >
                Products
              </Link>
              <Menu
                id="products-menu"
                anchorEl={anchorElProductsMenu}
                open={Boolean(anchorElProductsMenu)}
                onClose={handleCloseProductsMenu}
                MenuListProps={{
                  "aria-labelledby": "products-button",
                }}
              >
                {balanceheaderPages.map((page: any) => {
                  return (
                    <MenuLink
                      // href={page.href ? page.href : '#'}
                      href={page.params.comingSoon ? "#" : page.href}
                      onClick={handleCloseProductsMenu}
                      key={page.title}
                    >
                      <Typography
                        textAlign="center"
                        style={{ opacity: page.params.comingSoon ? 0.2 : 1 }}
                      >
                        <Button style={{ width: "100%" }}>{page.title}</Button>
                      </Typography>
                    </MenuLink>
                  );
                })}
              </Menu>
            </Box>
            <Link
              to="/about"
              className={
                themeType === "light" ? styles["headerLink"] : styles["headerLinkDark"]
              }
            >
              About
            </Link>
            <Link
              to={{ pathname: "/#docs" }}
              className={
                themeType === "light" ? styles["headerLink"] : styles["headerLinkDark"]
              }
            >
              Docs
            </Link>
            <Link
              to="/#audit"
              className={
                themeType === "light" ? styles["headerLink"] : styles["headerLinkDark"]
              }
            >
              Audits
            </Link>
            <Button
              variant="contained"
              color="primary"
              href="/#get-started"
              sx={{
                px: "3em",
                display: {
                  xs: "none",
                  md: "flex",
                  width: "100%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "clip",
                },
              }}
              className={style["link"]}
              style={{ display: "flex" }}
            >
              Get started
            </Button>
          </Box>
          <Tooltip title="Toggle Light/Dark Mode">
            <Button
              onClick={toggleTheme}
              sx={{ display: { xs: "none", md: "flex" } }}
              color="primary"
              className={`menuButton ${styles["toggleTheme"]}`}
            >
              <SvgIcon component={WbSunnyOutlinedIcon} fontSize="large" />
            </Button>
          </Tooltip>
        </Toolbar>
      </Container>
      {!allowedChain && connected && (
        <div className={styles["errorNav"]}>
          Network unsupported. Please change to one of: [Fantom, Ethereum]
        </div>
      )}
    </AppBar>
  );
};
