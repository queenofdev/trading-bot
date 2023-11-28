import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import LongArrowRight from "../../../assets/icons/long-arrow-right.svg";
import style from "./trad-fi.module.scss";
import DepositChoice from "./deposit-choice/deposit-choice";
import Graph from "./graph/graph";
import Headline from "../../components/headline/headline";
import { Faq, FaqItem } from "../../components/faq/faq";
import Logo from "../../components/logo/logo";
import { ThemeImage } from "../../components/theme-image/theme-image";
import { useWeb3Context } from "@fantohm/shared-web3";
import { useEffect, useState } from "react";
import { WaringIcon } from "@fantohm/shared/images";

const faqItems: FaqItem[] = [
  {
    title: "What is USDB?",
    content:
      "USDB is a truly decentralised stablecoin backed by FHM. It uses a method known as proof of burn to cement its value at $1. Proof of burn is a concept in which a coin is destroyed at a specific point in time and value.  At that moment it is recorded in a blockchain transaction. USDB is valued and maintained at $1 through its relationship with FHM, a decentralised reserve asset and an arbitrage mechanism that anyone can participate in.",
  },
  {
    title: "How to use TradFi Bonds",
    content:
      "Connect your wallet using the button in the upper right corner of this page and use the interface just above these FAQs. Deposit your DAI and return in 3-6 months for your returns. The interface will only appear on the ETH and FTM networks.",
  },
  {
    title: "Is it really only 2 steps?",
    content: "Yes! We've streamlined this process for your convenience.",
  },
  {
    title: "What happens if I want my money back?",
    content:
      "You can withdraw your funds early, but you will receive your original value in USDB and will be subject to a fee of 5%.",
  },
  {
    title: "What happens at the end of the term of my Deposit?",
    content:
      "You will need to withdraw the bond back into your wallet. That action is not automatic. You will be paid out in USDB.",
  },
];

export const TradFi = (): JSX.Element => {
  const { chainId } = useWeb3Context();

  const availableNetworkIds = [1, 4, 250];
  const [showNetworkBanner, setShowNetworkBanner] = useState<boolean>(false);

  const heroContent = {
    hero: true,
    title: "Take your investing to the next level",
    subtitle: ["The most streamlined way to earn up to 32.25% on your stables."],
  };
  const simpleSafe = {
    title: "Simple Returns",
    subtitle: [
      "USDB offers the most convenient way to earn up to 32.25% on your stables.",
      "Below are some comparative yields for different market offerings",
    ],
  };
  const bSimpleSafe = {
    title: "Simple & Safe returns",
    subtitle: ["USDB offers the safest way to earn up to 32.25% on your stables."],
  };
  const getStarted = {
    title: "Get started today",
    subtitle: [
      "TradFi bonds are suitable for long-term, savvy investors to safely park their funds and earn stable yields",
    ],
  };

  const invert = () => {
    if (localStorage.getItem("use-theme") === "dark") return 1;
    return 0;
  };

  useEffect(() => {
    if (availableNetworkIds.indexOf(chainId || 0) >= 0) {
      setShowNetworkBanner(false);
    } else {
      setShowNetworkBanner(true);
    }
  }, [chainId]);

  return (
    <>
      {/* {showNetworkBanner && (
        <Box className={style["network-banner"]}>
          <Typography variant="body2" color="primary">
            Please select the correct network, ethereum or fantom.
          </Typography>
        </Box>
      )}
      <Box className={style["__heading"]}>
        <Headline {...heroContent} />
        <a href="/trad-fi#get-started">
          <Button
            sx={{ marginTop: "55px", px: "3em", py: "1em" }}
            variant="outlined"
            className={style["getStarted"]}
          >
            Get started
            <img
              src={LongArrowRight}
              alt="Arrow to the right"
              style={{ marginLeft: "2em", filter: "invert(" + invert() + ")" }}
            />
          </Button>
        </a>
      </Box>
      <Box className={style["__section"]}>
        <Headline {...simpleSafe} />
        <div className="embed-container">
          <iframe
            src="https://www.youtube.com/embed/MJjdoQBGig4"
            frameBorder="0"
            allowFullScreen
            title="Single Sided Staking is Live & USDB Is Stronger For It!"
          ></iframe>
        </div>
        <Graph style={{ margin: "auto" }} />
        <Box className={style["__icons"]}>
          <Grid item xs={12} md={4}>
            <Paper
              className={`${style["infoIcon"]} ${style["lightBG"]} softGradient`}
              elevation={0}
            >
              <ThemeImage image="CardsIcon" />
              <span>No investment fee</span>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              className={`${style["infoIcon"]} ${style["lightBG"]} softGradient`}
              elevation={0}
            >
              <ThemeImage image="DoughnutChartIcon" />
              <span>No management fee</span>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              className={`${style["infoIcon"]} ${style["lightBG"]} softGradient`}
              elevation={0}
            >
              <ThemeImage image="ShieldIcon" />
              <span>Low risk of capital loss</span>
            </Paper>
          </Grid>
        </Box>
      </Box> */}
      <Box className={style["bannerDiv"]}>
        <Box>
          <img src={WaringIcon} alt="Warning Icon" className={style["warningDiv"]} />
        </Box>
        <Typography className={style["contentDiv"]}>
          The TradFi Bonds have been discontinued If you have an unclaimed USDB you can
          still redeem. For more info please check out our discord.
        </Typography>
      </Box>
      <Box className={style["__section"]}>
        {/* <Headline {...getStarted} /> */}
        <DepositChoice id="get-started" />
        {/* <Outlet /> */}
        {/* <Faq faqItems={faqItems} /> */}
        {/* <Box className={`${style["tradFiBlock"]} flexCenterCol`}>
          <Box sx={{ height: "10em" }} />
          <Headline {...bSimpleSafe} />
        </Box>
        <Box
          className={`${style["tradFiBlock"]} flexCenterCol`}
          sx={{ paddingBottom: "4em" }}
        >
          <Logo />
        </Box> */}
      </Box>
    </>
  );
};

export default TradFi;
