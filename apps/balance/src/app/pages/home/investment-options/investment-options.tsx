import { Box, Grid, Typography } from "@mui/material";
import BalanceIconLink from "../../../components/balance-icon-link/balance-icon-link";
import style from "./investment-options.module.scss";
import { OneIcon, TwoIcon, ThreeIcon } from "@fantohm/shared/images";
import InvestmentLink from "./investment-link";

export const InvestmentOptions = (): JSX.Element => {
  return (
    <Grid container rowSpacing={6} className={style["productGrid"]}>
      <Grid item md={4} sm={12} className={style["investmentElem"]}>
        <InvestmentLink
          title="Build"
          icon={OneIcon}
          link="/#partner-form"
          linkText="For protocols"
          text="Our organization includes financial engineers and developers with top level mastery within the fields of risk management and software engineering."
        />
      </Grid>
      <Grid item md={4} sm={12} className={style["investmentElem"]}>
        <InvestmentLink
          title="Grow"
          icon={TwoIcon}
          link="/#partner-form"
          linkText="For institutions"
          text="Through the systems in place, new financial interests are welcome to take part in both the continued success of the Balance ecosystem."
        />
      </Grid>
      <Grid item md={4} sm={12} className={style["investmentElem"]}>
        <InvestmentLink
          title="Earn"
          icon={ThreeIcon}
          link="/#get-started"
          linkText="For investors"
          text="We serve our stakeholders through a shared purpose of advancing sustainable economic growth and opportunity."
        />
        {/*<BalanceIconLink title="Mint USDB" icon={MintIcon} />*/}
      </Grid>
    </Grid>
  );
};

export default InvestmentOptions;
