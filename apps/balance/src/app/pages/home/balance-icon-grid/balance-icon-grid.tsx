import { Box, Grid, Typography } from "@mui/material";
import BalanceIconLink from "../../../components/balance-icon-link/balance-icon-link";
import style from "./balance-icon-grid.module.scss";
import {
  WalletIcon,
  TradFiIcon,
  BankIcon,
  BridgeIcon,
  xFhmIcon,
  MintIcon,
  USDBFHMIcon,
  FinancialNftsIcon,
  LiquidityIcon,
  NFTLendingIcon,
} from "@fantohm/shared/images";

export const BalanceIconGrid = (): JSX.Element => {
  return (
    <Grid container rowSpacing={6} className={style["productGrid"]}>
      <Grid
        container
        rowSpacing={6}
        style={{
          justifyContent: "center",
          alignContent: "center",
          textAlign: "center",
        }}
      >
        <Grid item md={12} sm={12}>
          <h2 style={{ fontSize: "36px" }}>Our products</h2>
        </Grid>
        <Grid item lg={3} md={4} sm={12} className={style["productCard"]}>
          <BalanceIconLink
            title="USDB Stablecoin"
            icon={TradFiIcon}
            link="/about#usdb"
            text="USDB is an ideal tool of decentralised commerce"
          />
        </Grid>
        <Grid item lg={3} md={4} sm={12} className={style["productCard"]}>
          <BalanceIconLink
            title="FHM"
            icon={USDBFHMIcon}
            link="/fhm"
            text="The FHM protocol is ideal as a value-capturing reserve"
          />
        </Grid>
        <Grid item lg={3} md={4} sm={12} className={style["productCard"]}>
          <BalanceIconLink
            title="Liquidity Solutions"
            icon={LiquidityIcon}
            link="../../../../assets/USDB_Liquidity_Solution.pdf"
            text="Our business-to-business solution for on-chain liquidity"
          />
          {/*<BalanceIconLink title="Mint USDB" icon={MintIcon} />*/}
        </Grid>
      </Grid>
      <Grid item md={3} sm={6} className={style["productCard"]}>
        <BalanceIconLink
          title="NFT Lending"
          icon={NFTLendingIcon}
          link="https://liqdnft.com"
          text="Unlock the value of your NFTs without selling them."
        />
        {/*<BalanceIconLink title="Mint USDB" icon={MintIcon} />*/}
      </Grid>
      <Grid item md={3} sm={6} className={style["productCard"]}>
        <BalanceIconLink
          title="Financial NFTs"
          icon={FinancialNftsIcon}
          text="Coming soon"
        />
      </Grid>
      <Grid item md={3} sm={6} className={style["productCard"]}>
        <BalanceIconLink title="USDB Bank" icon={BankIcon} text="Coming soon" />
      </Grid>
      <Grid item md={3} sm={6} className={style["productCard"]}>
        <BalanceIconLink
          title="Dex & Bridge"
          icon={BridgeIcon}
          link="https://app.fantohm.com/#/dex"
          text="Bridge & swap thousands of assets across multiple chains with the lowest fees."
        />
      </Grid>
    </Grid>
  );
};

export default BalanceIconGrid;
