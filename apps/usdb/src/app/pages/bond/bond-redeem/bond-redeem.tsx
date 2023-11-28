import { Box, Button, Grid, Icon } from "@mui/material";
import rootStyle from "../bond.module.scss";
import style from "./bond-redeem.module.scss";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DAISVG from "../../../../assets/tokens/DAI.svg";

interface IBondRedeemProps {
  bondType: string | undefined;
}

export const BondRedeem = (props: IBondRedeemProps): JSX.Element => {
  return (
    <div id="bond-redeem">
      {typeof props.bondType == "string" ? (
        <Grid container sx={{ justifyContent: "center" }} spacing={3}>
          <Grid xs={6} item>
            <Box className={rootStyle["flexCenterCol"]}>
              <div className={rootStyle["flexCenterRow"]}>
                <img src={DAISVG} />
                <h2>DAI LP</h2>
              </div>
              <div>Single sided</div>
            </Box>
          </Grid>
          <Grid xs={12} item>
            <Box
              className={`${rootStyle["flexCenterRow"]} ${rootStyle["spaceBetween"]} ${style["depositAmountBox"]}`}
            >
              <input type="number" value="100.00" />
              <span>Max</span>
            </Box>
          </Grid>
          <Grid xs={12} item>
            <Box className={`${rootStyle["flexCenterRow"]} ${rootStyle["spaceBetween"]}`}>
              <div className={rootStyle["flexCenterRow"]}>
                Reward amount <Icon component={InfoOutlinedIcon} />
              </div>
              <div>20.00 FHM</div>
            </Box>
          </Grid>
          <Grid xs={12} item>
            <Button>Redeem</Button>
          </Grid>
        </Grid>
      ) : (
        <h2>Bond Type Not Found </h2>
      )}
    </div>
  );
};

export default BondRedeem;
