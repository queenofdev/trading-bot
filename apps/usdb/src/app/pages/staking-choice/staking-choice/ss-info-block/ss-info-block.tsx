import { Box, Grid, Paper, Typography } from "@mui/material";
import { ThemeImage } from "../../../../components/theme-image/theme-image";
import style from "./ss-info-block.module.scss";

export const SsInfoBlock = (): JSX.Element => {
  return (
    <Box
      sx={{ mx: { xs: "1em", md: "3em" }, mb: "15em" }}
      className={style["infoBlockContainer"]}
      maxWidth="lg"
      alignSelf="center"
    >
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box className={`${style["mdRow"]} flexCenterCol`} sx={{ height: "100%" }}>
            <Paper
              className={`${style["mdElem"]} softGradient`}
              sx={{ marginBottom: "2em", minHeight: "309px", width: "100%" }}
            >
              <Box className="flexCenterCol">
                <Typography variant="h1">No Deposit Fees</Typography>
                <Box className="flexCenterCol h-full">
                  <Typography variant="h2" style={{ marginBottom: "30px" }}>
                    Deposit initial capital without worrying about fees or any hidden
                    costs
                  </Typography>
                  <ThemeImage image="CardsIcon" />
                </Box>
              </Box>
            </Paper>
            <Paper
              className={`${style["mdElem"]} softGradient`}
              sx={{ width: "100%", height: "100%" }}
            >
              <Box className="flexCenterCol">
                <Typography variant="h1">No Lock-Up Periods</Typography>
                <Typography variant="h2" style={{ marginBottom: "30px" }}>
                  Stake and unstake anytime
                </Typography>
                <Box className="flexCenterCol h-full">
                  <ThemeImage image="LockIcon" />
                </Box>
              </Box>
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box className="flexCenterCol" sx={{ height: "100%" }}>
            <Paper className="softGradient" sx={{ height: "100%", width: "100%" }}>
              <Box className={style["centerBox"]}>
                <Typography variant="h1">Risk Averse Investment</Typography>
                <Typography variant="h2" style={{ marginBottom: "30px" }}>
                  Get rewarded in our native token FHM - with low risk to the initial
                  capital
                </Typography>
                <Box className="flexCenterCol h-full">
                  <ThemeImage image="BankIcon" />
                </Box>
              </Box>
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box className={`${style["mdRow"]} flexCenterCol`} sx={{ height: "100%" }}>
            <Paper
              className={`${style["mdElem"]} softGradient`}
              sx={{ marginBottom: "2em", minHeight: "409px", width: "100%" }}
            >
              <Box className="flexCenterCol">
                <Typography variant="h1">Avoid Impermanent Loss</Typography>
                <Typography variant="h2" style={{ marginBottom: "30px" }}>
                  Claim back up to $10K impermanent losses paid in FHM on full withdrawal
                  of the investments after 100 days staking{" "}
                </Typography>
                <Box className="flexCenterCol h-full" style={{ paddingBottom: "30px" }}>
                  <ThemeImage image="DoughnutChartIcon" />
                </Box>
              </Box>
            </Paper>
            <Paper
              className={`${style["mdElem"]} softGradient`}
              sx={{ height: "100%", width: "100%" }}
            >
              <Box className="flexCenterCol">
                <Typography variant="h1">Earn 20% APR</Typography>
                <Typography variant="h2" style={{ marginBottom: "30px" }}>
                  Continuous rewards that are claimable anytime
                </Typography>
                <Box className="flexCenterCol h-full">
                  <ThemeImage image="ShieldIcon" />
                </Box>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SsInfoBlock;
