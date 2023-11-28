import { Avatar, Box, Button, Icon, Popover, IconButton } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LaunchIcon from "@mui/icons-material/Launch";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { addressEllipsis } from "@fantohm/shared-helpers";
import { isDev, NetworkIds, useWeb3Context, networks } from "@fantohm/shared-web3";
import { MouseEvent, useMemo, useState } from "react";

import { desiredNetworkId } from "../../core/constants/network";
import AvatarPlaceholder from "../../../assets/images/temp-avatar.png";
import AvatarAccount from "../../../assets/images/avatar-account.png";
const ConnectWallet = () => {
  const { connect, disconnect, address, connected, chainId } = useWeb3Context();
  const [flagAccountDropDown, setFlagAccountDropDown] = useState<null | HTMLElement>(
    null
  );

  const isWalletConnected = useMemo(() => {
    return address && connected && chainId === desiredNetworkId;
  }, [address, connected, chainId]);

  const onClickConnect = (event: MouseEvent<HTMLButtonElement>) => {
    try {
      connect(true, isDev ? NetworkIds.Goerli : NetworkIds.Ethereum);
    } catch (e: unknown) {
      console.warn(e);
    }
  };

  const onClickDisconnect = () => {
    disconnect();
  };

  const accountDrop = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFlagAccountDropDown(event.currentTarget);
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

  const handleExplorer = () => {
    if (!chainId) return;
    else window.open(networks[chainId].getEtherscanAddress(address), "_blank");
  };

  return isWalletConnected ? (
    <div className="rounded-2xl">
      <Button
        id="user-menu-button"
        aria-controls={flagAccountDropDown ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={flagAccountDropDown ? "true" : undefined}
        onClick={accountDrop}
        sx={{
          background: "#0B0F10",
          py: "0.5em",
          fontSize: "14px",
          borderRadius: "20px",
          "& .css-8je8zh-MuiTouchRipple-root": { display: "none" },
        }}
        className="bg-woodsmoke hover:bg-bunker"
      >
        <Box sx={{ display: "block" }}>
          <Avatar
            sx={{
              mr: { sm: "0", md: "1em" },
              borderRadius: "2rem",
              bgcolor: "#161B1D",
              width: "35px",
              height: "35px",
              padding: "8px",
            }}
            src={AvatarPlaceholder}
            className="xs:hidden sm:block "
          />
        </Box>
        <p className="text-primary">{addressEllipsis(address)}</p>
        <Box
          sx={{ display: "flex", alignItems: "center", ml: { xs: "0.2em", sm: "1em" } }}
        >
          <Icon component={KeyboardArrowDownIcon} className="text-white"></Icon>
        </Box>
      </Button>
      <Popover
        id={"Account"}
        open={Boolean(flagAccountDropDown)}
        anchorEl={flagAccountDropDown}
        onClose={() => setFlagAccountDropDown(null)}
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        className="accountDropdown  mt-20"
        disableScrollLock={true}
        sx={{
          "& .MuiPopover-paper": { backgroundColor: "#0B0F10", borderRadius: "25px" },
        }}
      >
        <div className="pt-20 bg-woodsmoke text-primary xs:w-250 sm:w-420 cursor-default shadow-3xl">
          <div className="flex justify-between items-center px-20">
            <h3 className="text-primary ">Account</h3>
            <button
              className="text-primary bg-[#0f1617] px-10 py-5 rounded-lg"
              onClick={onClickDisconnect}
            >
              Disconnect
            </button>
          </div>
          <div className="account flex justify-start items-center p-20">
            <Avatar
              sx={{
                mr: { sm: "0", md: "1em" },
                borderRadius: "2rem",
                bgcolor: "#161B1D",
                width: "42px",
                height: "42px",
              }}
              src={AvatarAccount}
            />
            <p className="text-18 pl-10">{addressEllipsis(address)}</p>
          </div>
          <div className="bg-[#0E1214] flex justify-between items-center xs:px-40 xs:py-20 sm:p-20">
            <div className="copy-address flex items-center">
              <IconButton
                size="small"
                aria-label="copy address"
                sx={{
                  width: 40,
                  height: 40,
                }}
                className={"text-primary"}
                onClick={copyToClipboard}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
              <h3 className="xs:hidden sm:block text-18">Copy Address</h3>
            </div>
            <div className="view-explorer flex items-center">
              <IconButton
                size="small"
                aria-label="copy address"
                sx={{
                  width: 40,
                  height: 40,
                }}
                className={"text-primary"}
                onClick={() => {
                  handleExplorer();
                }}
              >
                <LaunchIcon fontSize="small" />
              </IconButton>
              <h3 className="xs:hidden sm:block text-18">View Explorer</h3>
            </div>
          </div>
        </div>
      </Popover>
    </div>
  ) : (
    <button
      onClick={onClickConnect}
      className="px-30 py-10 bg-success rounded-2xl text-18 sm:font-bold text-primary"
    >
      Connect
    </button>
  );
};

export default ConnectWallet;
