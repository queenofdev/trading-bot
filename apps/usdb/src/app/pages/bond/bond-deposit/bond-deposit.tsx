import { Box, Button, Grid, Icon, SvgIcon } from "@mui/material";
import rootStyle from "../bond.module.scss";
import style from "./bond-deposit.module.scss";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { DaiToken } from "@fantohm/shared/images";

interface IBondDepositProps {
  bondType: string | undefined;
}

export const BondDeposit = (props: IBondDepositProps): JSX.Element => {
  return (
    <div id="bond-deposit">
      {typeof props.bondType == "string" ? (
        <Grid container sx={{ justifyContent: "center" }} spacing={3}>
          <Grid item>
            <div className={`${rootStyle["flexCenterRow"]} ${rootStyle["infoBlock"]}`}>
              <Icon component={InfoOutlinedIcon} /> no impermanent loss and no deposit fee
            </div>
          </Grid>
          <Grid xs={6} item>
            <Box className={rootStyle["flexCenterCol"]}>
              <div className={rootStyle["flexCenterRow"]}>
                <img src={DaiToken} alt="DAI Token" />
                <h2>DAI LP</h2>
              </div>
              <div>Single sided</div>
            </Box>
          </Grid>
          <Grid xs={6} item>
            <Box className={rootStyle["flexCenterCol"]}>
              <h2>20.00%</h2>
              <div>APR</div>
            </Box>
          </Grid>
          <Grid xs={6} item>
            <Box
              className={`${rootStyle["flexCenterCol"]} ${style["depositTokenSelectorBox"]}`}
            >
              <span>DAI balance</span>
              <span>1000 DAI</span>
            </Box>
          </Grid>
          <Grid xs={6} item>
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
                Your Deposit <Icon component={InfoOutlinedIcon} />
              </div>
              <div>100.00 DAI</div>
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
            <Button>Deposit</Button>
          </Grid>
        </Grid>
      ) : (
        <h2>Bond Type Not Found </h2>
      )}
    </div>
  );
};

export default BondDeposit;
