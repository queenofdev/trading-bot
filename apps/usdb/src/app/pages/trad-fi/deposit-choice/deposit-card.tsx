import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import css from "./deposit-choice.module.scss";
import DAIIcon from "../../../../assets/tokens/DAI.svg";
import { Link } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { USDBLight } from "@fantohm/shared-ui-themes";
import { IAllBondData, useWeb3Context, Bond } from "@fantohm/shared-web3";

interface IDepositCardParams {
  bondType: string;
  months: number;
  roi: number;
  apy: number;
  vestingTermPretty: string;
  bond: IAllBondData | Bond;
}

export const DepositCard = (params: IDepositCardParams): JSX.Element => {
  const { connect, connected } = useWeb3Context();

  return (
    <ThemeProvider theme={USDBLight}>
      <Box className={`${css["bondCard"]} flexCenterCol`}>
        <Paper
          sx={{ marginTop: "47px", maxWidth: "470px" }}
          elevation={0}
          className={`${css["bondElement"]}`}
        >
          <Grid container rowSpacing={3}>
            <Grid item xs={12}>
              <Box className={`flexCenterCol`}>
                <div className={`${css["iconWrapper"]}`}>
                  <img src={DAIIcon} alt="DAI token" className={css["daiIcon"]} />
                </div>
              </Box>
              <Grid container rowSpacing={3}>
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: "50px",
                  }}
                >
                  <Box className={css["titleWrapper"]}>
                    <h3>Fixed deposit</h3>
                  </Box>
                  <Typography variant="h1">{params.months} months</Typography>
                  <span style={{ color: "#696C80" }}>{params.vestingTermPretty}</span>
                </Grid>
                <Grid item xs={12}>
                  <hr />
                </Grid>
                <Grid item xs={6}>
                  <Box className={css["lowerStats"]}>
                    <Typography variant="h2">{params.roi}%</Typography>
                    <span>ROI</span>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box className={css["lowerStats"]}>
                    <Typography variant="h2">{params.apy}%</Typography>
                    <span>APY</span>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    disabled={true}
                    color="primary"
                    id="bond-btn"
                    className="paperButton transaction-button"
                    onClick={() => connect(true)}
                  >
                    Sold Out
                  </Button>
                  {/* {!connected ? (
                    <Button
                      variant="contained"
                      color="primary"
                      id="bond-btn"
                      className="paperButton transaction-button"
                      onClick={() => connect(true)}
                    >
                      Connect Wallet
                    </Button>
                  ) : (
                    <Link
                      to={`/trad-fi/deposit/${params.bondType}`}
                      style={{ color: "inherit" }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        id="bond-btn"
                        className="paperButton transaction-button"
                      >
                        Deposit
                      </Button>
                    </Link>
                  )} */}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default DepositCard;
