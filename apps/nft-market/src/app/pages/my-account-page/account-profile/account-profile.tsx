import { Box, Button } from "@mui/material";
import profileImagePlaceholder from "../../../../assets/images/profile-placeholder.svg";
import style from "./account-profile.module.scss";
import { addressEllipsis, copyToClipboard } from "@fantohm/shared-helpers";
import contentCopyIcon from "../../../../assets/icons/content-copy.svg";
import openInNewIcon from "../../../../assets/icons/open-in-new.svg";
import shareIcon from "../../../../assets/icons/share.svg";
import bluechip from "../../../../assets/icons/blue-chip.svg";
import openseaIcon from "../../../../assets/icons/opensea-icon.svg";
import raribleIcon from "../../../../assets/icons/rarible-icon.svg";
import { AppDispatch } from "../../../store";
import { useDispatch } from "react-redux";
import { addAlert, GrowlNotification } from "../../../store/reducers/app-slice";
import { isDev } from "@fantohm/shared-web3";

export type AccountProfileProps = {
  address: string;
};

export const AccountProfile = ({ address }: AccountProfileProps): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();

  const handleCopyAddress = () => {
    copyToClipboard(address);
    const notification: Partial<GrowlNotification> = {
      message: "Address copied to clipboard",
      duration: 5000,
    };
    dispatch(addAlert(notification));
  };

  const handleShareLink = () => {
    const baseUrl = isDev ? "https://mvp.liqdnft.com" : "https://liqdnft.com";
    const copyString = `${baseUrl}/account/${address}`;
    copyToClipboard(copyString);
    const notification: Partial<GrowlNotification> = {
      message: "Share link copied to clipboard",
      duration: 5000,
    };
    dispatch(addAlert(notification));
  };

  return (
    <Box sx={{ mt: "5em", mb: "2em" }}>
      <Box className={`flex fr fj-sb ai-c fw`}>
        <Box className={`flex fr fj-sb ai-c fw ${style["left"]}`}>
          <Box className={`${style["profileImageContainer"]} flex fr ai-c`}>
            <img
              src={profileImagePlaceholder}
              style={{
                width: "175px",
                height: "175px",
                border: "10px solid white",
                boxShadow: "0 25px 50px #7e9aa92b",
                borderRadius: "100%",
              }}
              alt="User's profile avatar"
            />
          </Box>
          <Box className="flex fc" sx={{ ml: "6em" }}>
            <h1 style={{ margin: "0.4em 0em" }}>
              {addressEllipsis(address)}
              <img
                src={bluechip}
                style={{ marginLeft: "10px", width: "28px" }}
                alt="bluechip"
              />
            </h1>
            <Button
              className={`lowContrast slim ${style["accountButton"]} ${style["noInvert"]}`}
              variant="contained"
              onClick={handleCopyAddress}
            >
              {addressEllipsis(address)}{" "}
              <img
                src={contentCopyIcon}
                style={{ margin: "0px 0px 0px 4px", width: "1em", height: "1em" }}
                alt=""
              />
            </Button>
          </Box>
        </Box>
        <Box className={`flex fr ai-c ${style["right"]}`}>
          <span>
            <a href={`https://opensea.io/${address}`} target="_blank" rel="noreferrer">
              <img
                src={openseaIcon}
                alt="opensea icon"
                style={{ boxShadow: "0px 25px 50px #7e9aa92b", marginRight: "7px" }}
                className={style["iconWrapper"]}
              />
            </a>
          </span>
          <span>
            <a
              href={`https://rarible.com/user/${address}/owned`}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={raribleIcon}
                style={{ boxShadow: "0px 25px 50px #7e9aa92b", marginRight: "7px" }}
                alt="opensea icon"
                className={style["iconWrapper"]}
              />
            </a>
          </span>
          <Button
            className={`lowContrast slim ${style["accountButton"]}`}
            variant="contained"
            sx={{ ml: "7px" }}
            href={`https://etherscan.io/address/${address}`}
            target="_blank"
          >
            <img
              src={openInNewIcon}
              style={{ margin: "0px 4px 2px 0px", width: "1em", height: "1em" }}
              alt=""
            />{" "}
            View on Etherscan
          </Button>
          <Button
            className={`lowContrast slim ${style["accountButton"]}`}
            variant="contained"
            sx={{ ml: "7px" }}
            onClick={handleShareLink}
          >
            <img
              src={shareIcon}
              style={{ margin: "0px 4px 2px 0px", width: "1em", height: "1em" }}
              alt=""
            />
            Share
          </Button>
          {/* <span>
            <IconButton className="lowContrast" sx={{ ml: "7px" }}>
              <Icon component={MoreHorizOutlinedIcon} />
            </IconButton>
          </span> */}
        </Box>
      </Box>
    </Box>
  );
};
