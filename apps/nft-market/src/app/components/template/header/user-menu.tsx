import { CustomInnerSwitch, setTheme } from "@fantohm/shared-ui-themes";
import {
  isDev,
  loadErc20Balance,
  NetworkIds,
  networks,
  useWeb3Context,
} from "@fantohm/shared-web3";
import {
  Avatar,
  Box,
  Button,
  Icon,
  IconButton,
  Popover,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import { MouseEvent, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import LaunchIcon from "@mui/icons-material/Launch";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import NorthEastOutlinedIcon from "@mui/icons-material/NorthEastOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { addressEllipsis } from "@fantohm/shared-helpers";
import { AppDispatch, RootState } from "../../../store";
import { logout } from "../../../store/reducers/backend-slice";
import AvatarPlaceholder from "../../../../assets/images/temp-avatar.png";
import { desiredNetworkId } from "../../../constants/network";
import { selectCurrencies } from "../../../store/selectors/currency-selectors";
import styles from "./header.module.scss";
import { WalletBalances } from "./wallet-balances";

type PageParams = {
  sx?: SxProps<Theme> | undefined;
  comingSoon?: boolean;
};

type AccountSubMenu = {
  title: string;
  params?: PageParams;
  href?: string;
  icon?: string;
};

export const UserMenu = (): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  // menu controls
  const [flagAccountDropDown, setFlagAccountDropDown] = useState<null | HTMLElement>(
    null
  );

  const accountSubMenu: AccountSubMenu[] = [
    { title: "My profile", href: "/my-account", icon: "user" },
    { title: "My assets", href: "/my-account/assets", icon: "photo" },
    { title: "My loans", href: "/my-account/loans", icon: "loan" },
    { title: "Dark theme", href: "#", icon: "sun" },
  ];

  // web3 wallet
  const { connect, disconnect, address, connected, chainId } = useWeb3Context();

  const currencies = useSelector((state: RootState) => selectCurrencies(state));
  const { authSignature } = useSelector((state: RootState) => state.backend);

  useEffect(() => {
    if (!address) return;
    dispatch(
      loadErc20Balance({
        networkId: desiredNetworkId,
        address,
        currencyAddress: networks[desiredNetworkId].addresses["USDB_ADDRESS"],
      })
    );
  }, [address]);

  const onClickConnect = (event: MouseEvent<HTMLButtonElement>) => {
    console.log(
      "connect: ",
      isDev,
      desiredNetworkId,
      address,
      isWalletConnected,
      authSignature
    );
    try {
      connect(true, isDev ? NetworkIds.Goerli : NetworkIds.Ethereum);
    } catch (e: unknown) {
      console.warn(e);
    }
  };

  const onClickDisconnect = () => {
    dispatch(logout());
    disconnect();
  };

  // theme control
  const themeType = useSelector((state: RootState) => state.theme.mode);

  const accountDrop = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFlagAccountDropDown(event.currentTarget);
  };

  const toggleTheme = () => {
    dispatch(setTheme(themeType === "light" ? "dark" : "light"));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address).then(
      function () {
        //console.log("Async: Copying to clipboard was successful!");
      },
      function (err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  };

  const isWalletConnected = useMemo(() => {
    return address && authSignature && connected && chainId === desiredNetworkId;
  }, [address, authSignature, connected, chainId]);

  useEffect(() => {
    if (currencies && isWalletConnected) {
      Object.values(currencies).forEach((currency) => {
        return dispatch(
          loadErc20Balance({
            networkId: desiredNetworkId,
            address: address,
            currencyAddress: currency.currentAddress,
          })
        );
      });
    }
  }, [currencies, isWalletConnected]);

  return isWalletConnected ? (
    <>
      <Button
        id="user-menu-button"
        aria-controls={flagAccountDropDown ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={flagAccountDropDown ? "true" : undefined}
        onClick={accountDrop}
        sx={{ background: "#FFF", py: "0.5em", fontSize: "16px" }}
        className={styles["accountButton"]}
      >
        <Box sx={{ display: "block" }} className={styles["accountAvatar"]}>
          <Avatar
            sx={{ mr: { sm: "0", md: "1em" }, borderRadius: "2rem" }}
            src={AvatarPlaceholder}
          ></Avatar>
        </Box>
        {addressEllipsis(address)}
        <Box
          sx={{ display: "flex", alignItems: "center", ml: { xs: "0.2em", sm: "1em" } }}
        >
          <Icon component={ArrowDropDownIcon}></Icon>
        </Box>
      </Button>
      <Popover
        id={"Account"}
        open={Boolean(flagAccountDropDown)}
        anchorEl={flagAccountDropDown}
        onClose={() => setFlagAccountDropDown(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        className="accountDropdown"
        disableScrollLock={true}
      >
        <h3 style={{ marginBottom: "5px", marginTop: "5px" }}>
          {addressEllipsis(address)}
        </h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "3px",
          }}
        >
          <h6
            style={{
              color: "grey",
              marginRight: "10px",
              marginTop: "5px",
              marginBottom: "5px",
            }}
          >
            {addressEllipsis(address)}
          </h6>
          <IconButton
            size="small"
            aria-label="copy address"
            sx={{
              width: 40,
              height: 40,
            }}
            className={styles["addressSvg"]}
            onClick={copyToClipboard}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            aria-label="copy address"
            sx={{
              width: 40,
              height: 40,
            }}
            className={styles["addressSvg"]}
            href={`https://etherscan.io/address/${address}`}
            target="_blank"
          >
            <LaunchIcon fontSize="small" />
          </IconButton>
        </div>
        <WalletBalances />
        {/* <Button
          variant="contained"
          sx={{ mt: "10px", mb: "20px", width: "300px", fontSize: "14px" }}
        >
          Buy USDB on Exchanges &nbsp;&nbsp;
          <NorthEastOutlinedIcon />
        </Button> */}

        {accountSubMenu.map((dropMenu: AccountSubMenu, index: number) => {
          return (
            <Typography
              key={`btn-${dropMenu.title}-${index}`}
              textAlign="left"
              style={{ opacity: dropMenu?.params?.comingSoon ? 0.2 : 1 }}
            >
              {dropMenu.icon === "sun" ? (
                <Button
                  style={{
                    minWidth: "110px",
                    padding: "0.5em 1em",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <LightModeOutlinedIcon />
                    &nbsp;&nbsp;
                    {dropMenu.title}
                  </div>
                  {/* <Switch
                                  onChange={themeChange}
                                  inputProps={{ 'aria-label': 'controlled' }}
                                /> */}
                  {/* <Switch checked={checked} onChange={themeChangeColor} /> */}
                  <CustomInnerSwitch
                    checked={themeType === "dark" ? true : false}
                    onClick={toggleTheme}
                  />
                </Button>
              ) : (
                <Link to={dropMenu.href || "#"}>
                  <Button
                    sx={{
                      minWidth: "110px",
                      padding: "0.5em 1em",
                      width: "100%",
                      justifyContent: "left",
                    }}
                    onClick={() => setFlagAccountDropDown(null)}
                  >
                    {dropMenu.icon === "user" ? (
                      <PersonOutlineOutlinedIcon />
                    ) : dropMenu.icon === "photo" ? (
                      <InsertPhotoOutlinedIcon />
                    ) : dropMenu.icon === "loan" ? (
                      <CreditCardOutlinedIcon />
                    ) : null}
                    &nbsp;&nbsp;
                    {dropMenu.title}
                  </Button>
                </Link>
              )}
            </Typography>
          );
        })}

        <Typography
          textAlign="left"
          sx={{
            marginTop: "10px",
            paddingTop: "10px",
            borderTop: "1px solid #CCCCCC",
          }}
        >
          <Button
            sx={{
              minWidth: "110px",
              padding: "0.5em 1em",
              width: "100%",
              justifyContent: "left",
            }}
            onClick={onClickDisconnect}
          >
            <LogoutOutlinedIcon />
            &nbsp;&nbsp; Disconnect
          </Button>
        </Typography>
      </Popover>
    </>
  ) : (
    <Box>
      <Button
        onClick={onClickConnect}
        sx={{
          backgroundColor: "#FFF",
          color: "#000",
          padding: "0.9em",
          minWidth: { xs: "60px", sm: "250px" },
          fontSize: "16px",
          border: "1px solid #8080801f",
        }}
      >
        Connect
      </Button>
    </Box>
  );
};

export default UserMenu;
