import { MouseEvent, useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  SxProps,
  Theme,
  Toolbar,
  Tooltip,
  Popover,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { enabledNetworkIds, useWeb3Context } from "@fantohm/shared-web3";
import styles from "./header.module.scss";
import UserMenu from "./user-menu";
import { RootState } from "../../../store";
import NotificationMenu from "./notification-menu";
import logoDarkMode from "../../../../assets/images/logo-darkmode.svg";
import logoLightMode from "../../../../assets/images/logo-lightmode.svg";
import ArrowTopRight from "../../../../assets/images/arrow-top-right.png";
import ArrowTopRightWhite from "../../../../assets/images/arrow-top-right-white.png";
import Indacoin from "../../../../assets/images/indacoin.png";
import Fantohm from "../../../../assets/images/fantohm.png";
import { HashLink as Link } from "react-router-hash-link";
import { useSelector } from "react-redux";

type PageParams = {
  sx?: SxProps<Theme> | undefined;
  comingSoon?: boolean;
};

type Page = {
  title: string;
  params?: PageParams;
  href?: string;
  hash?: string;
  tooltip?: string;
  external?: boolean;
};

const pages: Page[] = [
  { title: "Lend", href: "/lend", tooltip: "Earn interest" },
  { title: "Borrow", href: "/borrow", tooltip: "Get liquidity" },
  // { title: "Account", href: "/my-account" },
  // { title: "Feedback & Issues", href: "https://liqd.nolt.io/", external: true },
  // { title: "About", href: "/", hash: "#about-section" },
  { title: "Blog", href: "/blog" },
  { title: "Referral", href: "/referral" },
];

export const Header = (): JSX.Element => {
  const { connected, chainId } = useWeb3Context();
  const allowedChain = chainId && enabledNetworkIds.includes(chainId);
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorBuyUSDB, setAnchorBuyUSDB] = useState<HTMLButtonElement | null>(null);
  const themeType = useSelector((state: RootState) => state.theme.mode);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleClickBuyUSDB = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorBuyUSDB(event.currentTarget);
  };

  const handleCloseBuyUSDB = () => {
    setAnchorBuyUSDB(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      setAnchorBuyUSDB(null);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Container maxWidth="xl" sx={{ pt: { xs: "1rem", md: "2.5rem" } }}>
        <Toolbar disableGutters>
          <Typography
            noWrap
            component="div"
            sx={{
              mr: { xs: "0", md: "10px" },
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              fontSize: "28px",
              minWidth: "70px",
            }}
            className={styles["mainLogo"]}
          >
            <Link to="/">
              <img
                src={themeType === "light" ? logoLightMode : logoDarkMode}
                alt="liqd logo"
                style={{ height: "1.5em" }}
              />
            </Link>
          </Typography>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              maxWidth: { xs: "48px" },
              mr: { xs: "20px;" },
            }}
          >
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
              disableScrollLock={true}
            >
              {pages.map((page: Page) => {
                const children = (
                  <Typography
                    textAlign="center"
                    style={{ opacity: page?.params?.comingSoon ? 0.2 : 1 }}
                  >
                    {page.tooltip ? (
                      <Tooltip title={page.tooltip} placement="right">
                        <Button style={{ width: "100%" }}>{page.title}</Button>
                      </Tooltip>
                    ) : (
                      <Button style={{ width: "100%" }}>{page.title}</Button>
                    )}
                  </Typography>
                );

                return page.external ? (
                  <a
                    href={page.href}
                    onClick={handleCloseNavMenu}
                    key={page.title}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {children}
                  </a>
                ) : (
                  <Link
                    to={{ pathname: page.href || "#", hash: page.hash }}
                    onClick={handleCloseNavMenu}
                    key={page.title}
                  >
                    {children}
                  </Link>
                );
              })}

              {/* <Typography
                key={`btn-buy`}
                textAlign="center"
                style={{ order: "10", flex: "0 0 100%" }}
              >
                <Button
                  style={{ padding: "1em 1.25em" }}
                  aria-describedby="buy-usdb"
                  onClick={handleClickBuyUSDB}
                >
                  Buy USDB
                </Button>
              </Typography> */}
            </Menu>
          </Box>
          <Typography
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
            className={styles["mainLogo"]}
          >
            <Link to="/">
              <img
                src={themeType === "light" ? logoLightMode : logoDarkMode}
                alt="liqd logo"
                style={{ height: "1.5em" }}
              />
            </Link>
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              {pages.map((page: Page, index: number) => {
                const children = page.tooltip ? (
                  <Tooltip title={page.tooltip}>
                    <Button
                      style={{
                        padding: "1em 1.25em",
                      }}
                    >
                      {page.title}
                    </Button>
                  </Tooltip>
                ) : (
                  <Button
                    style={{
                      padding: "1em 1.25em",
                    }}
                  >
                    {page.title}
                  </Button>
                );

                return (
                  <Typography
                    key={`btn-${page.title}-${index}`}
                    textAlign="center"
                    style={{ opacity: page?.params?.comingSoon ? 0.2 : 1 }}
                  >
                    {page.external ? (
                      <a href={page.href} target="_blank" rel="noreferrer">
                        {children}
                      </a>
                    ) : (
                      <Link to={{ pathname: page.href || "#", hash: page.hash }}>
                        {children}
                      </Link>
                    )}
                  </Typography>
                );
              })}
              {/* <Typography key={`btn-buy`} textAlign="center">
                <Button
                  style={{
                    padding: "1em 1.25em",
                    backgroundColor: anchorBuyUSDB ? "rgba(0, 0, 0, 0.04)" : undefined,
                  }}
                  aria-describedby="buy-usdb"
                  onClick={handleClickBuyUSDB}
                >
                  Buy USDB
                </Button>
              </Typography> */}
              <Popover
                id="buy-usdb"
                open={anchorBuyUSDB ? true : false}
                anchorEl={anchorBuyUSDB}
                onClose={handleCloseBuyUSDB}
                disableScrollLock={true}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                PaperProps={{
                  style: {
                    padding: "0px",
                  },
                }}
              >
                <a
                  href="https://indacoin.io/buy-usd%20balance-with-card"
                  target="_blank"
                  rel="noreferrer"
                  className={styles["buyLink"]}
                  style={{ color: themeType === "light" ? "black" : "white" }}
                >
                  <span>
                    <img src={Indacoin} alt="indacoin" />
                    Buy on &nbsp;<u>indacoin.io</u>
                  </span>
                  <img
                    src={themeType === "light" ? ArrowTopRight : ArrowTopRightWhite}
                    alt="arrow-top-right"
                  />
                </a>
                <a
                  href="https://app.fantohm.com/#/dex"
                  target="_blank"
                  rel="noreferrer"
                  className={styles["buyLink"]}
                  style={{ color: themeType === "light" ? "black" : "white" }}
                >
                  <span>
                    <img src={Fantohm} alt="fantohm" />
                    Buy on &nbsp;<u>fantohm.com</u>
                  </span>
                  <img
                    src={themeType === "light" ? ArrowTopRight : ArrowTopRightWhite}
                    alt="arrow-top-right"
                  />
                </a>
              </Popover>
            </Box>
          </Box>
          <NotificationMenu />
          <UserMenu />
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
