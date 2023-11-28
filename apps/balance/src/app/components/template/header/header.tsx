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
import { Link } from "react-router-dom";
import MenuLink from "./menu-link";
import { RootState } from "../../../store";
import { setCheckedConnection, setTheme } from "../../../store/reducers/app-slice";
import USDBLogoLight from "../../../../assets/images/USDB-logo.png";
import USDBLogoDark from "../../../../assets/images/USDB-logo-dark.png";
import styles from "./header.module.scss";
import { NetworkMenu } from "./network-menu";
import { headerPages, Page } from "../../../constants/nav";

export const Header = (): JSX.Element => {
  const dispatch = useDispatch();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElProductsMenu, setAnchorElProductsMenu] = useState<null | HTMLElement>(
    null
  );
  const [accountBondsLoading, setAccountBondsLoading] = useState<boolean>(true);
  const [totalBalances, setTotalBalances] = useState<number>(0);

  const themeType = useSelector((state: RootState) => state.app.theme);

  const accountLoading = useSelector((state: RootState) => {
    return state.account.loading;
  });
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
                src={themeType === "light" ? USDBLogoLight : USDBLogoDark}
                alt="USDB logo"
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
              {headerPages.map((page: Page) => (
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

              <MenuItem
                sx={{ display: "flex", justifyContent: "start", padding: "0" }}
                onClick={handleCloseNavMenu}
                className={`${styles["mobileTheme"]}`}
              >
                <Typography textAlign="center">
                  <Button onClick={toggleTheme}>
                    <SvgIcon component={WbSunnyOutlinedIcon} fontSize="medium" />
                  </Button>
                </Typography>
              </MenuItem>

              <MenuItem
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  paddingLeft: "20px",
                }}
                onClick={handleCloseNavMenu}
                className={`${styles["mobilePortfolio"]}`}
              >
                <Typography textAlign="center">
                  <Link to="/my-account">
                    <Button className="portfolio">
                      <Box display="flex" alignItems="center" mr="10px">
                        <SvgIcon component={AnalyticsIcon} fontSize="large" />
                      </Box>
                      <Box
                        display="flex"
                        alignItems="center"
                        mt="2px"
                        className={`${styles["portfolioText"]}`}
                      >
                        My Portfolio:&nbsp;
                      </Box>
                      {!accountBondsLoading ? (
                        <Box display="flex" alignItems="center" mt="2px">
                          ${trim(totalBalances, 2)}
                        </Box>
                      ) : (
                        <Skeleton width="100px" />
                      )}
                    </Button>
                  </Link>
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Typography
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            <Link to="/">
              <img
                src={themeType === "light" ? USDBLogoLight : USDBLogoDark}
                alt="USDB logo"
                className={`${styles["usdbLogo"]}`}
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
            <Box>
              <Button
                className={`menuButton ${styles["productsButton"]}`}
                onClick={(e) => setAnchorElProductsMenu(e.currentTarget)}
              >
                Products
              </Button>
              <Menu
                id="products-menu"
                anchorEl={anchorElProductsMenu}
                open={Boolean(anchorElProductsMenu)}
                onClose={handleCloseProductsMenu}
                MenuListProps={{
                  "aria-labelledby": "products-button",
                }}
              >
                {headerPages.map((page: any) => {
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
          </Box>

          <Box mr="1em">
            <NetworkMenu />
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
    </AppBar>
  );
};
