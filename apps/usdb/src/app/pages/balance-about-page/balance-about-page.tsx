import { Box, Button, Grid, Icon, Input, Paper } from "@mui/material";
import { useEffect } from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Headline from "../../components/headline/headline";
import Logo from "../../components/logo/logo";
import style from "./balance-about-page.module.scss";
import {
  TeammateProfile,
  Teammate,
} from "../../components/teammate-profile/teammate-profile";
import {
  AboutBridge,
  AboutDivider,
  AboutFHM,
  AboutFinancialNFT,
  AboutLiquidity,
  AboutUSDB,
  AboutUSDBBank,
  AboutBalanceEcosystem,
  AboutNFTMarketplace,
} from "@fantohm/shared/images";
import BalanceAboutTile from "./balance-about-tile";

export const BalanceAboutPage = (): JSX.Element => {
  // mailchimp integration
  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src =
  //     "https://chimpstatic.com/mcjs-connected/js/users/30ce909d3542b1d245b54e5b8/8e00ffff339710be3d1981967.js%22";
  //   script.async = true;
  //   document.body.appendChild(script);
  // }, []);

  return (
    <>
      <Grid
        container
        rowSpacing={6}
        className={style["productGrid"]}
        style={{ marginTop: "50px" }}
      >
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: { sm: "0%", md: "5%" },
            paddingRight: { sm: "0%", md: "5%" },
            width: { sm: "300px", md: "100%" },
          }}
        >
          <img
            src={AboutBalanceEcosystem as string}
            style={{ width: "100%" }}
            className={style["image"]}
            alt=""
          />
        </Grid>
        <Grid
          item
          sm={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "center",
            paddingTop: "30px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
            className={style["iconLinkContainer"]}
          >
            <Grid item xs={10} md={12}>
              <h1 className={style["title"]}>The Balance Ecosystem</h1>
            </Grid>

            <Grid item xs={10} md={12}>
              <h1 className={style["text"]}>
                The Balance Ecosystem is an open-source economy of conjoined banking and
                commerce initiatives formed in March of 2022.The Balance Ecosystem is an
                open-source economy of conjoined banking and commerce initiatives formed
                in March of 2022 with the unveiling of investment opportunities derived
                solely from the technical application, maintenance, and consumer use of
                USDB.
              </h1>
            </Grid>
            <Grid item xs={10} md={12}>
              <h1 className={style["text"]}>
                The Balance Ecosystem depends on the administration of the Balance
                Organisation to produce and refine the collected systems of FHM & USDB’s
                use cases until such a time as they might be further decentralised.
                Through a continuing dialogue between the Balance Organisation and the FHM
                Stakeholders’ DAO via governance throughout the development and
                implementation of these systems, the Balance Ecosystem aims to produce the
                first, ever, decentralised reserve currency.
              </h1>
            </Grid>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "30px",
          }}
        >
          <img src={AboutDivider as string} style={{ width: "100%" }} />
        </Grid>
      </Grid>
      <BalanceAboutTile
        icon={AboutUSDB}
        title="USDB Stablecoin"
        text="The Balance ecosystem / organization is formed to carry out the purpose of its name– to balance FHM & USDB against one another in a way that feeds value into the continued use case of both assets. FHM, as a value capturing mechanism, feeds the minting of USDB through a proof of burn mechanism similar to UST on Luna."
        link="https://www.usdbalance.com/"
        docsLink="https://fantohm.gitbook.io/documentation/usdb/introduction"
      />
      <BalanceAboutTile
        icon={AboutFHM}
        title="FHM Protocol"
        text="FHM is a Reserve & Rewards Protocol inspired by the Protocol Owned Liquidity software developments of OHM. FHM features compounding, single disbursement bonds as the safest possible bonding mechanism to ensure the longevity of exchange liquidity in relation to neighbouring protocols with similar principles."
        link="https://fantohm.com/"
        docsLink="https://fantohm.gitbook.io/documentation/"
        learnMore="/fhm"
      />
      <BalanceAboutTile
        icon={AboutBridge}
        title="DEX & Bridge"
        text="USDB and FHM are expanding beyond the EVM realm with the first bridge to Terra being completed in the near future. We have successfully bridged both ways and are now awaiting the completion of audits to confirm our capability in this regard."
        link="https://app.fantohm.com/#/dex"
      />
      <BalanceAboutTile
        icon={AboutLiquidity}
        title="Liquidity Solution"
        text="We understand that managing token liquidity is tough. We’ve built the perfect solution to help projects maximise the liquidity they can unlock. Making sure deep liquidity is available for your ecosystem. Helping you achieve your long-term mission and short-term needs."
        link="https://beets.fi/#/pool/0x20dc8f03ece2bca3e262314f6ede7b32939331d70002000000000000000001f0"
        learnMore="./../../../assets/USDB_Liquiduty_Solution.pdf"
      />
      <BalanceAboutTile
        icon={AboutUSDBBank}
        title="USDB Bank"
        text="We are building a lending and borrowing structure that will fall under our USDBank which you may have already seen teased in the usdbalance.com site ui."
      />
      <BalanceAboutTile
        icon={AboutNFTMarketplace}
        title="NFT Marketplace"
        text="Coming soon"
      />
      <BalanceAboutTile
        icon={AboutFinancialNFT}
        title="Financial NFTs"
        text="We are building a financial NFTs that will act as a receipt for a new game-changing financial product."
      />
    </>
  );
};

export default BalanceAboutPage;
