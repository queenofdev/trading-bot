import { Grid } from "@mui/material";
import style from "./icon-grid.module.scss";
import {
  WalletIcon,
  TradFiIcon,
  BankIcon,
  BridgeIcon,
  xFhmIcon,
  MintIcon,
} from "@fantohm/shared/images";
import IconLink from "../../../components/icon-link/icon-link";

export const IconGrid = (): JSX.Element => {
  return (
    <Grid container rowSpacing={6} className={style["productGrid"]}>
      {/* <Grid item md={4} xs={6}>
        <IconLink title="Traditional Finance" icon={TradFiIcon} link="/trad-fi" />
      </Grid>
      <Grid item md={4} xs={6}>
        <IconLink title="Stablecoin Farming" icon={WalletIcon} link="/staking" />
      </Grid> */}
      <Grid item md={4} xs={6}>
        <IconLink title="Minter" icon={MintIcon} link="/mint" />
        {/*<IconLink title="Mint USDB" icon={MintIcon} />*/}
      </Grid>
      {/* <Grid item md={4} xs={6}>
        //<IconLink title="xFHM" icon={xFhmIcon} link="/xfhm"/>
        <IconLink title="xFHM" icon={xFhmIcon} />
      </Grid>
      <Grid item md={4} xs={6}>
        <IconLink title="USDB Bank" icon={BankIcon} />
      </Grid> */}
      <Grid item md={4} xs={6}>
        <IconLink
          title="Bridge"
          icon={BridgeIcon}
          link="https://synapseprotocol.com/?inputCurrency=USDB&outputCurrency=USDB&outputChain=1"
        />
      </Grid>
      <Grid item md={4} xs={6}>
        <IconLink title="Vault" icon={WalletIcon} link="/vault" />
      </Grid>
      {/* <Grid item md={4} xs={6}>
       <IconLink title="Backed NFT" icon={WalletIcon} link="/backed-nft" />
      </Grid> */}

      {/* <Grid item md={4} xs={6}>
        <IconLink title="AMPS Model" icon={WalletIcon} />
      </Grid> */}
    </Grid>
  );
};

export default IconGrid;
