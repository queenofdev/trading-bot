import { Box, Grid, Typography } from "@mui/material";
import style from "./partners-grid.module.scss";
import {
  BeetsIcon,
  CIcon,
  CoinTelegraphIcon,
  DebridgeIcon,
  DefiantIcon,
  DIAIcon,
  HuobiIcon,
  IncognitoIcon,
  LiquidDriverIcon,
  RangoIcon,
  SpookySwapIcon,
  SynapseIcon,
  UnknownIcon,
  WanchainIcon,
  WarpIcon,
  BeetsIconDark,
  CIconDark,
  CoinTelegraphIconDark,
  DebridgeIconDark,
  DefiantIconDark,
  DIAIconDark,
  HuobiIconDark,
  IncognitoIconDark,
  LiquidDriverIconDark,
  RangoIconDark,
  SpookySwapIconDark,
  SynapseIconDark,
  UnknownIconDark,
  WanchainIconDark,
  WarpIconDark,
} from "@fantohm/shared/images";
import lightBG from "../../../../../../../libs/shared/ui-themes/src/lib/images/USDB_gradient_light.png";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useEffect, useState } from "react";
import { USDBDark, USDBLight } from "@fantohm/shared-ui-themes";

export const PartnersGrid = (): JSX.Element => {
  const themeType = useSelector((state: RootState) => state.app.theme);
  const [theme, setTheme] = useState(USDBDark);

  useEffect(() => {
    setTheme(themeType === "light" ? USDBLight : USDBDark);
  }, [themeType]);
  return (
    <Box
      style={{ alignContent: "center", justifyContent: "center", marginTop: "150px" }}
      className={style["productGrid"]}
    >
      <Grid
        container
        rowSpacing={6}
        style={{
          width: "80%",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "10%",
        }}
        className={style["productGrid"]}
      >
        <Grid
          item
          md={12}
          xs={12}
          style={{
            justifyContent: "center",
            alignContent: "center",
            marginBottom: "30px",
          }}
        >
          <h2
            className={style["partnerTitle"]}
            style={{
              textAlign: "center",
              fontSize: "40px",
              fontWeight: "400",
              marginBottom: "50px",
            }}
          >
            Our partners
          </h2>
        </Grid>
        <Grid
          container
          rowSpacing={6}
          className={style["productGrid"]}
          style={{
            height: "100%",
            justifyContent: "center",
            alignContent: "center",
          }}
          justifyContent="center"
        >
          <Grid item md={3} xs={6} className={style["partnerElem"]}>
            <a href="https://spookyswap.finance/">
              <img
                src={theme === USDBLight ? SpookySwapIcon : SpookySwapIconDark}
                alt="USDB logo"
                className={style["partnerIcon"]}
              />
            </a>
          </Grid>
          <Grid item md={3} xs={6} className={style["partnerElem"]}>
            <a href="https://debridge.finance/">
              <img
                title="FHM"
                src={theme === USDBLight ? DebridgeIcon : DebridgeIconDark}
                alt="USDB logo"
                className={style["partnerIcon"]}
              />
            </a>
          </Grid>
          <Grid item md={3} xs={6} className={style["partnerElem"]}>
            <a href="https://www.liquiddriver.finance/">
              <img
                title="Liquidity Solutions"
                src={theme === USDBLight ? LiquidDriverIcon : LiquidDriverIconDark}
                alt="USDB logo"
                className={style["partnerIcon"]}
              />
            </a>
          </Grid>
          <Grid item md={3} xs={6} className={style["partnerElem"]}>
            <a href="https://rango.exchange/">
              <img
                title="NFT Lending"
                src={theme === USDBLight ? RangoIcon : RangoIconDark}
                alt="USDB logo"
                className={style["partnerIcon"]}
              />
            </a>
          </Grid>
          <Grid item md={3} xs={6} className={style["partnerElem"]}>
            <a href="https://beets.fi/#/">
              <img
                title="Financial NFTs"
                src={theme === USDBLight ? BeetsIcon : BeetsIconDark}
                alt="USDB logo"
                className={style["partnerIcon"]}
              />
            </a>
          </Grid>
          <Grid item md={3} xs={6} className={style["partnerElem"]}>
            <a href="https://synapseprotocol.com/landing">
              <img
                title="USDB Bank"
                src={theme === USDBLight ? SynapseIcon : SynapseIconDark}
                alt="USDB logo"
                className={style["partnerIcon"]}
              />
            </a>
          </Grid>
          <Grid item md={3} xs={6} className={style["partnerElem"]}>
            <a href="https://incognito.org/">
              <img
                src={theme === USDBLight ? IncognitoIcon : IncognitoIconDark}
                alt="USDB logo"
                className={style["partnerIcon"]}
              />
            </a>
          </Grid>
          <Grid item md={3} xs={6} className={style["partnerElem"]}>
            <a href="https://www.huobiwallet.com/en">
              <img
                src={theme === USDBLight ? HuobiIcon : HuobiIconDark}
                alt="USDB logo"
                className={style["partnerIcon"]}
              />
            </a>
          </Grid>
          <Grid item md={3} xs={6} className={style["partnerElem"]}>
            <a href="https://cointelegraph.com/">
              <img
                src={theme === USDBLight ? CoinTelegraphIcon : CoinTelegraphIconDark}
                alt="USDB logo"
                className={style["partnerIcon"]}
              />
            </a>
          </Grid>
          <Grid item md={3} xs={6} className={style["partnerElem"]}>
            <a href="https://thedefiant.io/">
              <img
                src={theme === USDBLight ? DefiantIcon : DefiantIconDark}
                alt="USDB logo"
                className={style["partnerIcon"]}
              />
            </a>
          </Grid>
          <Grid item md={3} xs={6} className={style["partnerElem"]}>
            <a href="https://creaticles.com/">
              <img
                src={theme === USDBLight ? CIcon : CIconDark}
                alt="USDB logo"
                className={style["partnerIcon"]}
              />
            </a>
          </Grid>
          <Grid item md={3} xs={6} className={style["partnerElem"]}>
            <a href="https://www.xdefi.io/">
              <img
                src={theme === USDBLight ? UnknownIcon : UnknownIconDark}
                alt="USDB logo"
                className={style["partnerIcon"]}
              />
            </a>
          </Grid>
          <Grid item md={3} xs={6} className={style["partnerElem"]}>
            <a href="https://www.diadata.org/">
              <img
                src={theme === USDBLight ? DIAIcon : DIAIconDark}
                alt="USDB logo"
                className={style["partnerIcon"]}
              />
            </a>
          </Grid>
          <Grid item md={3} xs={6} className={style["partnerElem"]}>
            <a href="https://www.wanchain.org/">
              <img
                src={theme === USDBLight ? WanchainIcon : WanchainIconDark}
                alt="USDB logo"
                className={style["partnerIcon"]}
              />
            </a>
          </Grid>
          <Grid item md={3} xs={6} className={style["partnerElem"]}>
            <a href="https://www.warp.finance/">
              <img
                src={theme === USDBLight ? WarpIcon : WarpIconDark}
                alt="USDB logo"
                className={style["partnerIcon"]}
              />
            </a>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PartnersGrid;
