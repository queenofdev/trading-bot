import HeroBanner from "./hero-banner";
import WorkBanner from "./work-banner";
import BorrowerBanner from "./borrower-banner";
import LendersBanner from "./lenders-banner";
import FaqBanner from "./faq-banner";
import StartedBanner from "./started-banner";

import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";

export const NewHomePage = (): JSX.Element => {
  const themeType = useSelector((state: RootState) => state.theme.mode) as string;
  const isDark = themeType === "dark";
  return (
    <>
      <Helmet>
        <title>
          Liqd NFT - A marketplace to enable peer-to-peer lending and borrowing of blue
          chip NFTs
        </title>
      </Helmet>
      <HeroBanner isDark={isDark} />
      <WorkBanner isDark={isDark} />
      <BorrowerBanner isDark={isDark} />
      <LendersBanner isDark={isDark} />
      <FaqBanner isDark={isDark} />
      <StartedBanner isDark={isDark} />
    </>
  );
};
