import { Button, Grid, Icon, Paper, Tooltip, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useState } from "react";
import { useSelector } from "react-redux";
import style from "./my-account.module.scss";
import AccountDetails from "./my-account-details";

export const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

export const MyAccountDetailsTable = ({
  accountDetails,
  onRedeemAll,
}: {
  accountDetails: AccountDetails;
  onRedeemAll: () => void;
}): JSX.Element => {
  const themeType = useSelector((state: any) => state.app.theme);
  const backgroundColor = themeType === "light" ? "#f7f7ff" : "#0E0F10";
  const [isPending, setIsPending] = useState(false);

  const onRedeemAllInternal = async () => {
    try {
      setIsPending(true);
      await onRedeemAll();
    } catch (e) {
      console.log(e);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{ marginTop: "10px" }}
      className={style["rowCard"]}
      style={{ backgroundColor: `${backgroundColor}` }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle2" className={style["subTitle"]}>
            Portfolio value
            <Tooltip
              sx={{ marginLeft: "5px" }}
              arrow
              title="Total value of your portfolio"
            >
              <Icon component={InfoOutlinedIcon} fontSize="small" />
            </Tooltip>
          </Typography>
          <Typography variant="h5">
            {accountDetails && currencyFormat.format(accountDetails.balance)}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle2" className={style["subTitle"]}>
            Claimable rewards
            <Tooltip
              sx={{ marginLeft: "5px" }}
              arrow
              title="Value of rewards you will receive at the end of the vesting period(s)"
            >
              <Icon component={InfoOutlinedIcon} fontSize="small" />
            </Tooltip>
          </Typography>
          <Typography variant="h5">
            +{accountDetails && currencyFormat.format(accountDetails.claimableRewards)}
          </Typography>
        </Grid>
        {accountDetails?.claimableRewards >= 0.005 && (
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              disableElevation
              disabled={isPending}
              onClick={() => {
                onRedeemAllInternal().then();
              }}
            >
              {isPending ? "Pending" : "Claim all"}
            </Button>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default MyAccountDetailsTable;
