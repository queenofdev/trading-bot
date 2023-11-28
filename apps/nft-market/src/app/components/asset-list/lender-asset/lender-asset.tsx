import {
  Box,
  Chip,
  IconButton,
  Paper,
  Popover,
  Tooltip,
  Typography,
  Link,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import PreviewImage from "../preview-image/preview-image";
import React, { useEffect, useMemo, useState } from "react";
import { formatCurrency, capitalizeFirstLetter } from "@fantohm/shared-helpers";
import { Asset, AssetStatus } from "../../../types/backend-types";
import { AppDispatch, RootState } from "../../../store";
import { selectListingFromAsset } from "../../../store/selectors/listing-selectors";
import { useDispatch, useSelector } from "react-redux";
import { useTermDetails } from "../../../hooks/use-term-details";
import { isDev, prettifySeconds } from "@fantohm/shared-web3";
import { loadCurrencyFromAddress } from "../../../store/reducers/currency-slice";
import { selectCurrencyByAddress } from "../../../store/selectors/currency-selectors";
import style from "./lender-asset.module.scss";
import search from "../../../../assets/icons/search.svg";
import searchDark from "../../../../assets/icons/search-dark.svg";
import etherScan from "../../../../assets/icons/etherscan.svg";
import etherScanDark from "../../../../assets/icons/etherscan-dark.svg";
import grayArrowRightUp from "../../../../assets/icons/gray-arrow-right-up.svg";
import refresh from "../../../../assets/icons/refresh.svg";
import refreshDark from "../../../../assets/icons/refresh-dark.svg";
import openSea from "../../../../assets/icons/opensea-icon.svg";
import { useMediaQuery } from "@material-ui/core";
import { useGetNftAssetQuery } from "../../../api/backend-api";

export type LenderAssetProps = {
  asset: Asset;
};

export function LenderAsset({ asset }: LenderAssetProps) {
  const dispatch: AppDispatch = useDispatch();
  const [addressToRefresh, setAddressToRefresh] = useState<string>("");
  const [tokenIdToRefresh, setTokenIdToRefresh] = useState<string>("");
  const listing = useSelector((state: RootState) => selectListingFromAsset(state, asset));
  const currency = useSelector((state: RootState) =>
    selectCurrencyByAddress(state, listing?.term?.currencyAddress || "")
  );

  // load asset data from backend
  const { data: metaDataResponse, isLoading: isMetaDataLoading } = useGetNftAssetQuery(
    {
      contractAddress: addressToRefresh,
      tokenId: tokenIdToRefresh,
    },
    { skip: !addressToRefresh || !tokenIdToRefresh }
  );

  const [flagMoreDropDown, setFlagMoreDropDown] = useState<null | HTMLElement>(null);
  const themeType = useSelector((state: RootState) => state.theme.mode);
  const isTablet = useMediaQuery("(min-width:576px)");

  const { repaymentAmount } = useTermDetails(listing?.term);
  const chipColor = useMemo(() => {
    if (!asset) return;
    switch (asset.status) {
      case AssetStatus.New:
      case AssetStatus.Ready:
        return "grey";
      case AssetStatus.Listed:
        return "blue";
      case AssetStatus.Locked:
        return "dark";
      default:
        return;
    }
  }, [asset]);

  const openMoreDropDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFlagMoreDropDown(event.currentTarget);
  };

  const refreshMetaData = () => {
    setAddressToRefresh(asset.assetContractAddress);
    setTokenIdToRefresh(asset.tokenId);
  };

  const viewLinks = [
    {
      startIcon: themeType === "dark" ? searchDark : search,
      alt: "Search",
      title: "View Listing",
      url: `/asset/${asset.assetContractAddress}/${asset.tokenId}`,
      endIcon: null,
      isSelfTab: true,
    },
    {
      startIcon: themeType === "dark" ? refreshDark : refresh,
      alt: "Refresh",
      title: "Refresh Metadata",
      endIcon: null,
      isSelfTab: true,
    },
    {
      startIcon: themeType === "dark" ? etherScanDark : etherScan,
      alt: "EtherScan",
      title: "View on Etherscan",
      url: `https://${isDev ? "goerli." : ""}etherscan.io/token/${
        asset?.assetContractAddress
      }?a=${asset?.tokenId}`,
      endIcon: grayArrowRightUp,
      isSelfTab: false,
    },
    {
      startIcon: openSea,
      alt: "OpenSea",
      title: "View on OpenSea",
      url: `${
        !isDev
          ? "https://opensea.io/assets/ethereum/"
          : "https://testnets.opensea.io/assets/goerli/"
      }${asset.assetContractAddress}/${asset.tokenId}`,
      endIcon: grayArrowRightUp,
      isSelfTab: false,
    },
  ];

  useEffect(() => {
    dispatch(loadCurrencyFromAddress(listing?.term?.currencyAddress));
  }, [listing]);

  if (!asset || !listing) {
    return <h3>Loading...</h3>;
  }

  return (
    <Paper
      style={{
        borderRadius: isTablet ? "28px" : "14px",
        display: "flex",
        flexDirection: "column",
        padding: "0",
        position: "relative",
        paddingTop: 0,
      }}
      className={style["assetBox"]}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: isTablet ? "space-between" : "center",
          position: "absolute",
          width: "100%",
          mt: isTablet ? "20px" : "0px",
          paddingLeft: isTablet ? "10px" : 0,
          paddingRight: isTablet ? "10px" : 0,
        }}
      >
        <Chip
          label={capitalizeFirstLetter(asset?.status.toLowerCase()) || "Unlisted"}
          className={`nft-status ${chipColor}`}
          style={{ zIndex: "1" }}
        />
        <IconButton
          sx={{
            position: isTablet ? "relative" : "absolute",
            zIndex: 10,
            right: isTablet ? "0" : "-4px",
            top: isTablet ? "0" : "-8px",
          }}
          className={style["moreButton"]}
          aria-haspopup="true"
          aria-expanded={flagMoreDropDown ? "true" : undefined}
          onClick={openMoreDropDown}
        >
          <MoreHorizOutlinedIcon />
        </IconButton>
        <Popover
          id="moreDropDown"
          open={Boolean(flagMoreDropDown)}
          anchorEl={flagMoreDropDown}
          onClose={() => setFlagMoreDropDown(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          disableScrollLock={true}
        >
          {viewLinks.map((link, index) => (
            <Link
              key={link.title}
              href={link.url}
              style={{ textDecoration: "none", cursor: "pointer" }}
              target={`${link.isSelfTab ? "_self" : "_blank"}`}
              onClick={() => {
                if (link.alt === "Refresh") refreshMetaData();
                setFlagMoreDropDown(null);
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: `${index === viewLinks.length - 1 ? "0" : "15px"}`,
                }}
              >
                <Box sx={{ display: "flex" }}>
                  <img
                    src={link.startIcon}
                    style={{ width: "20px", marginRight: "10px" }}
                    alt={link.alt}
                  />
                  <Typography
                    variant="h6"
                    style={{
                      fontWeight: "normal",
                      fontSize: "1em",
                      textAlign: "center",
                      color: `${themeType === "light" ? "black" : "white"}`,
                    }}
                  >
                    {link.title}
                  </Typography>
                </Box>
                {link?.endIcon && (
                  <Box sx={{ ml: "7px", mt: "-2px" }}>
                    <img src={link.endIcon} style={{ width: "9px" }} alt={link.alt} />
                  </Box>
                )}
              </Box>
            </Link>
          ))}
        </Popover>
      </Box>
      <RouterLink
        to={`/asset/${asset.assetContractAddress}/${asset.tokenId}`}
        className="flex"
        style={{ flexGrow: "1" }}
      >
        {asset.tokenId && (
          <PreviewImage asset={asset} metaDataResponse={metaDataResponse} />
        )}
      </RouterLink>
      <Box className={style["assetSpecs"]}>
        <Box className="flex fr fj-sb ai-c w100" style={{ margin: "15px 0 0 0" }}>
          <span
            style={{ color: "rgba(255,255,255,0.7)" }}
            className={style["termHeading"]}
          >
            Duration
          </span>
          <span
            style={{ color: "rgba(255,255,255,0.7)" }}
            className={style["termHeading"]}
          >
            APR
          </span>
        </Box>
        <Box className="flex fr fj-sb ai-c w100">
          <span className={style["termValue"]}>
            {prettifySeconds(listing.term.duration * 86400, "day")}
          </span>
          <span className={style["termValue"]}>{listing.term.apr}%</span>
        </Box>
      </Box>
      <Box
        className="flex fc fj-fs ai-c"
        sx={{
          margin: {
            xs: "10px 0 0 0",
          },
        }}
      >
        {asset.collection && asset.collection.name && (
          <Box sx={{ position: "absolute" }}>
            <span
              style={{
                fontWeight: "400",
                fontSize: "15px",
                position: "relative",
                top: "-12px",
                background: "#FFF",
                borderRadius: "2em",
                padding: "0.1em",
                width: "80%",
                alignSelf: "center",
                textAlign: "center",
                opacity: "0.90",
              }}
            >
              {asset.collection.name}
            </span>
          </Box>
        )}
        <Box
          className="flex fc fj-c ai-c w100"
          sx={{
            p: {
              xs: "20px",
              sm: "20px",
              md: "20px",
              lg: "20px",
              xl: "30px",
            },
          }}
        >
          <Box
            className={`${style["asset-loan-info"]} w100`}
            sx={{
              alignItems: "top",
              flexFlow: {
                xs: "wrap",
              },
            }}
          >
            <Box
              sx={{
                flex: 1,
                flexFlow: "wrap",
                alignItems: "center",
                alignContent: "center",
              }}
            >
              <span style={{ color: "rgba(0,0,0,0.7)" }} className={style["loanHeading"]}>
                Loan amount
              </span>
              <Tooltip title={currency?.name || ""}>
                <img
                  className={style["loanIcon"]}
                  src={currency?.icon}
                  alt={currency?.name}
                  style={{
                    marginRight: "5px",
                    height: "22px",
                    width: "22px",
                    transform: "translateY(3px)",
                  }}
                />
              </Tooltip>
              <Tooltip
                title={formatCurrency(listing.term.amount * currency?.lastPrice, 2)}
              >
                <span className={style["assetPrice"]}>
                  {parseFloat(listing.term.amount.toFixed(5))}
                </span>
              </Tooltip>
            </Box>
            <Box
              className={style["interestElem"]}
              sx={{
                flex: 1,
                flexFlow: "wrap",
              }}
            >
              <span style={{ color: "rgba(0,0,0,0.7)" }} className={style["loanHeading"]}>
                Interest
              </span>
              <Tooltip title={formatCurrency(repaymentAmount * currency?.lastPrice, 2)}>
                <span className={style["assetPriceStable"]}>
                  <img
                    src={currency?.icon}
                    alt={currency?.name}
                    style={{
                      marginRight: "5px",
                      height: "22px",
                      width: "22px",
                      transform: "translateY(3px)",
                    }}
                  />
                  {repaymentAmount.toFixed(2)}
                </span>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

export default LenderAsset;
