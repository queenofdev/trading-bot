import { copyToClipboard, formatCurrency } from "@fantohm/shared-helpers";
import {
  getErc20CurrencyFromAddress,
  prettifySeconds,
  useWeb3Context,
  NetworkIds,
  getRedeemStatus,
} from "@fantohm/shared-web3";

import { useEffect, useState, useMemo, useCallback } from "react";
import { DaiToken, TakepileLogo } from "@fantohm/shared/images";
import { ContentCopy, NorthEast, OpenInNew } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Icon,
  IconButton,
  LinearProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useBalanceVault, useBalanceVaultPosition } from "../../hooks/use-balance-vault";
import { AppDispatch, RootState } from "../../store";
import style from "./balance-vault-details-page.module.scss";
import { ExternalLink } from "./external-link";
import { PositionTemplate } from "./position-template";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VaultActionForm from "../../components/vault-action/vault-action-form";
import Faq from "../../components/faq-takepile/faq";

export const BalanceVaultDetailsPage = (): JSX.Element => {
  const { vaultId } = useParams();
  const themeType = useSelector((state: RootState) => state.app.theme);

  const { chainId, connected, connect, address, provider, defaultProvider } =
    useWeb3Context();

  const { vaultData } = useBalanceVault(vaultId as string);
  const { positionData } = useBalanceVaultPosition(vaultId as string);
  const dispatch: AppDispatch = useDispatch();

  const getDate = (UNIX_timestamp: any) => {
    const a = new Date(UNIX_timestamp * 1000);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const time = date + " " + month + " " + year + " " + a.toLocaleTimeString();
    return time;
  };

  const handleCopyAddress = () => {
    copyToClipboard(vaultData?.ownerWallet ?? "");
  };
  const [vaultActionFormOpen, setVaultActionFormOpen] = useState(false);
  const [isDeposit, setIsDeposit] = useState(false);
  const [redeemStatus, setRedeemStatus] = useState(false);

  useEffect(() => {
    const fetchRedeemStatus = async () => {
      if (provider !== null || defaultProvider !== null) {
        const status = await dispatch(
          getRedeemStatus({
            nftAddress: vaultData?.nftAddress || "",
            provider: provider || defaultProvider,
          })
        ).unwrap();
        setRedeemStatus(status);
      }
    };

    fetchRedeemStatus();
  }, [vaultData, provider, defaultProvider]);

  // theme relevant style data
  const borderStyle = themeType === "light" ? "2px solid #ECECF4" : "2px solid #101112";
  const lowContrastBg =
    themeType === "light"
      ? style["low-contrast-bg-light"]
      : style["low-contrast-bg-dark"];
  const lowContrastText =
    themeType === "light"
      ? style["low-contrast-text-light"]
      : style["low-contrast-text-dark"];

  const handleConnect = useCallback(async () => {
    try {
      await connect();
    } catch (e) {
      console.log("Connection metamask error", e);
    }
  }, [connect]);

  const onDeposit = () => {
    if (!connected) {
      handleConnect();
      return;
    }
    setIsDeposit(true);
    setVaultActionFormOpen(true);
  };

  const onWithdraw = () => {
    if (!connected) {
      handleConnect();
      return;
    }
    setIsDeposit(false);
    setVaultActionFormOpen(true);
  };

  const onRedeem = () => {
    if (!connected) {
      handleConnect();
      return;
    }
    setVaultActionFormOpen(true);
  };

  const onVaultActionFormClose = () => {
    setVaultActionFormOpen(false);
  };

  const shouldSwitch = useMemo(() => {
    return chainId !== NetworkIds.FantomOpera && !vaultData;
  }, [vaultData, chainId]);

  const shouldNotifyFreeze = useMemo(() => {
    return (
      connected &&
      address === vaultData?.ownerWallet &&
      vaultData?.shouldBeFrozen &&
      !vaultData.frozen
    );
  }, [connected, address, vaultData]);

  const shouldNotifyClose = useMemo(() => {
    return vaultData?.redeemPrepared && redeemStatus;
  }, [connected, address, vaultData]);

  return !shouldSwitch ? (
    <Box>
      {(shouldNotifyFreeze || shouldNotifyClose) && (
        <Box className="flex fj-c" sx={{ mt: "60px" }}>
          <Typography sx={{ fontSize: "40px" }}>
            {shouldNotifyFreeze
              ? "Vault should be frozen, Freeze!"
              : "This vault is closed"}
          </Typography>
        </Box>
      )}
      <Box
        className="flexCenterRow"
        id="content-centering-container"
        sx={{ mt: shouldNotifyFreeze || shouldNotifyClose ? "0px" : "100px" }}
      >
        <VaultActionForm
          vaultId={vaultId as string}
          onClose={onVaultActionFormClose}
          deposit={isDeposit}
          open={vaultActionFormOpen}
          redeemPrepared={vaultData?.redeemPrepared || false}
        />
        <Box className="grid g-x-2" sx={{ m: "2em" }} maxWidth="xl" id="grid-container">
          <Box
            className="rounded-lg"
            sx={{ border: borderStyle, background: themeType === "light" ? "#FFF" : "" }}
            id="left-box"
          >
            <Box
              className="flex fr fj-sb ai-c gap-x-1"
              sx={{ borderBottom: borderStyle, p: "2em" }}
              id="left-box-header"
            >
              <Box className="flex fr ai-c">
                <Avatar
                  src={vaultData?.ownerContacts[0]}
                  sx={{ p: "5px", border: borderStyle, mr: "1em" }}
                />
                <h2 className={`${style["text-lg"]}`}>{vaultData?.name}</h2>
              </Box>
              <Box className="flex fr">
                <Button
                  variant="contained"
                  className={`thinSquaredButton ${style["btn-action"]}`}
                  sx={{
                    backgroundColor: themeType === "light" ? "#0a0c0f0a" : "#0D1014",
                    color: themeType === "light" ? "#000" : "#8A99A8",
                  }}
                  onClick={onDeposit}
                >
                  + Deposit
                </Button>
                <Button
                  variant="contained"
                  className={`thinSquaredButton ${style["btn-action"]}`}
                  sx={{
                    backgroundColor: themeType === "light" ? "#0a0c0f0a" : "#0D1014",
                    color: themeType === "light" ? "#000" : "#8A99A8",
                  }}
                  onClick={onWithdraw}
                >
                  - Withdraw
                </Button>
              </Box>
            </Box>
            <Box sx={{ p: "2em" }} id="left-box-content">
              <Box
                sx={{ p: "1em" }}
                className={`flex fr ai-c gap-x-2 fj-sb rounded ${lowContrastBg}`}
              >
                <Box>
                  <Typography>Vault Funding</Typography>
                  <h2 className={`${style["text-lg"]}`}>
                    {vaultData?.fundsRaised &&
                      formatCurrency(
                        +ethers.utils.formatUnits(vaultData?.fundsRaised, 18),
                        2
                      )}{" "}
                    /{" "}
                    {vaultData?.fundingAmount &&
                      formatCurrency(
                        +ethers.utils.formatUnits(vaultData?.fundingAmount, 18),
                        2
                      )}
                  </h2>
                </Box>
                <Box>
                  <Button
                    variant="contained"
                    className={`thinButton ${
                      vaultData?.redeemPrepared ? style["btn-redeem"] : ""
                    }`}
                    onClick={vaultData?.redeemPrepared ? onRedeem : onDeposit}
                  >
                    {vaultData?.redeemPrepared ? "Redeem" : "Open"}
                  </Button>
                </Box>
              </Box>
              <Box className="grid g-x-3" sx={{ mt: "1em" }}>
                <Box
                  sx={{ p: "1em" }}
                  className={`flex fc jf-c ai-c gap-x-2 fj-sb rounded ${lowContrastBg}`}
                >
                  <span>Vault APR</span>
                  <h2 className={style["text-md"]}>
                    {vaultData && vaultData?.apr / 100}%
                  </h2>
                </Box>
                <Box
                  sx={{ p: "1em" }}
                  className={`flex fc jf-c ai-c gap-x-2 fj-sb rounded ${lowContrastBg}`}
                >
                  <span>Lock duration</span>
                  <h2 className={style["text-md"]}>
                    {prettifySeconds(vaultData?.lockDuration ?? 0)}
                  </h2>
                </Box>
                <Box
                  sx={{ p: "1em" }}
                  className={`flex fc jf-c ai-c gap-x-2 fj-sb rounded ${lowContrastBg}`}
                >
                  <span>Currencies</span>
                  <h2 className={style["text-md"]}>
                    {vaultData &&
                      vaultData?.allowedTokens.map((currency) => (
                        <span key={currency}>
                          {getErc20CurrencyFromAddress(currency, chainId || 4).symbol}
                        </span>
                      ))}
                  </h2>
                </Box>
              </Box>
              <Box className="grid g-x-2">
                <Box>
                  <h2 className={style["text-md"]}>Overview</h2>
                  <p className={lowContrastText}>
                    Deposit{" "}
                    {vaultData &&
                      vaultData?.allowedTokens.map((currency) => (
                        <span key={currency}>
                          {getErc20CurrencyFromAddress(currency, chainId || 4).symbol}{" "}
                        </span>
                      ))}{" "}
                    to earn from this vault. Funds are locked for{" "}
                    {prettifySeconds(vaultData?.lockDuration ?? 0)} once the vault’s
                    desired financing has been met.
                  </p>
                  <Box className="flex ai-c">
                    <h2 className={style["text-md"]}>Lock Duration</h2>
                    <Tooltip
                      title={
                        <div style={{ whiteSpace: "pre-line" }}>{`FreezeTime : ${getDate(
                          vaultData?.freezeTimestamp
                        )} \n RepaymentTime : ${getDate(
                          vaultData?.repaymentTimestamp
                        )}`}</div>
                      }
                    >
                      <Icon
                        component={InfoOutlinedIcon}
                        fontSize={"medium"}
                        sx={{ ml: "5px" }}
                      />
                    </Tooltip>
                  </Box>
                  <Box className="flex fr jf-sb ai-c" sx={{ textAlign: "center" }}>
                    <span>{vaultData?.time.completedTime}</span>
                    <LinearProgress
                      value={vaultData?.time.percentComplete ?? 0}
                      variant="determinate"
                      sx={{ width: "50%", ml: "10px", mr: "10px" }}
                    />
                    <span>{prettifySeconds(vaultData?.lockDuration ?? 0)}</span>
                  </Box>
                </Box>
                <Box className="flex fc fj-sb">
                  <Box className="flex fr fj-sb ai-c">
                    <h2 className={style["text-md"]}>My Position</h2>
                    <Typography sx={{ color: "#69D9C8" }}>
                      {formatCurrency(positionData?.totalUsdValue ?? 0, 2)}
                    </Typography>
                    {/* todo: replace with position total */}
                  </Box>
                  <Box className="flex fr fj-sb ai-c">
                    <span>Asset</span>
                    <span>My position</span>
                  </Box>
                  {positionData &&
                    positionData.positionEntries.map((position) => (
                      <PositionTemplate
                        key={position.tokenId}
                        currency={getErc20CurrencyFromAddress(
                          position.tokenId,
                          chainId || 4
                        )}
                        amount={position.amount}
                      />
                    ))}
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            className="rounded-lg"
            sx={{ border: borderStyle, background: themeType === "light" ? "#FFF" : "" }}
            id="right-box"
          >
            <Box
              className="flex fr fj-sb gap-x-2"
              sx={{ borderBottom: borderStyle, p: "2em" }}
              id="right-box-header"
            >
              <h2 className={`${style["text-lg"]}`}>About</h2>
              {/* <Button
                variant="contained"
                disabled={true}
                className="thinSquaredButton"
                sx={{
                  backgroundColor: "#0D1014",
                  color: "#8A99A8",
                }}
              >
                + Edit
              </Button> */}
            </Box>
            <Box sx={{ p: "2em" }}>
              <h2 className={`${style["text-md"]}`}>Description</h2>
              <p className={lowContrastText}>
                {vaultData?.description?.replaceAll("&#9166;", "\n")}
              </p>
              <h2 className={`${style["text-md"]}`}>Vault owner</h2>
              <Box
                sx={{ p: "0.75em" }}
                className={`flex fr jf-c ai-c gap-x-2 fj-sb rounded ${lowContrastBg}`}
              >
                <span className={lowContrastText}>
                  {vaultData && vaultData?.ownerWallet}
                </span>
                <Box>
                  <IconButton onClick={handleCopyAddress}>
                    <ContentCopy sx={{ color: "#8A99A8" }} />
                  </IconButton>
                  <IconButton
                    href={`https://ftmscan.com/address/${vaultData?.ownerWallet}`}
                    target="_blank"
                  >
                    <OpenInNew sx={{ color: "#8A99A8" }} />
                  </IconButton>
                </Box>
              </Box>
              <h2 className={`${style["text-md"]}`}>External Links</h2>
              <Box className="flex fr ai-c gap-x-1">
                {vaultData?.ownerContacts.map(
                  (item, index) =>
                    item.search("~!_") > -1 && (
                      <ExternalLink
                        key={index}
                        href={item.split("~!_")[1]}
                        title={item.split("~!_")[0]}
                        target="_blank"
                      />
                    )
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Faq />
    </Box>
  ) : (
    <Box className="flex fj-c" sx={{ mt: "100px" }}>
      <Typography sx={{ fontSize: "40px" }}>Switch wallet to FTM chain</Typography>
    </Box>
  );
};

export default BalanceVaultDetailsPage;
