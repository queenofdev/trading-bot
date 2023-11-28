import { Box, Grid } from "@mui/material";

import Jumbotron from "./jumbotron";
import Borrowers from "./borrowers";
import Lenders from "./lenders";
import VerifiedCollections from "./verified-collections";
import BackedLoan from "./backed-loan";

import style from "./jumbotron.module.scss";

export const HomePage = (): JSX.Element => {
  return (
    <Box
      sx={{
        width: "100%",
        mt: { xs: "-80px", md: "-145px" },
      }}
    >
      <Grid
        container
        sx={{
          display: { xs: "none", md: "flex" },
          width: "100%",
          height: "100%",
          zIndex: "-1",
          position: "absolute",
        }}
      >
        <Grid item xs={12} md={6}></Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ background: "#F5F5F5" }}
          className={style["jumboRight"]}
        ></Grid>
      </Grid>
      <Jumbotron />
      <Borrowers />
      <Lenders />
      <VerifiedCollections />
      <BackedLoan />
    </Box>
  );
};

export default HomePage;
