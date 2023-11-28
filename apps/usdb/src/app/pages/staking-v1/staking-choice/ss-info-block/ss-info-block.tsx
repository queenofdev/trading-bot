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
          <Box className={`${style["mdRow"]} flexCenterCol`}>
            <Paper
              className={`${style["mdElem"]} softGradient`}
              sx={{ marginBottom: "2em", minHeight: "309px", width: "100%" }}
            >
              <Box className="flexCenterCol">
                <Typography variant="h1">No Deposit Fees</Typography>
                <Box className="flexCenterCol h-full">
                  <ThemeImage image="CardsIcon" />
                </Box>
              </Box>
            </Paper>
            <Paper className={`${style["mdElem"]} softGradient`} sx={{ width: "100%" }}>
              <Box className="flexCenterCol">
                <Typography variant="h1">No Lock-Up Periods</Typography>
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
                <Typography variant="h2">
                  Investors only need to provide DAI, while our protocol provides the
                  other token in the pair, USDB, and you can withdraw at any time with
                  effectively zero impermanent loss.
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
              sx={{ marginBottom: "2em", minHeight: "309px", width: "100%" }}
            >
              <Box className="flexCenterCol">
                <Typography variant="h1">Zero Impermanent Loss</Typography>
                <Box className="flexCenterCol h-full">
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
