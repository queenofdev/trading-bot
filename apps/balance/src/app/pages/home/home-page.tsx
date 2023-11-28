import { Box, Container, Grid, Icon } from "@mui/material";
import style from "./home-page.module.scss";
import IconGrid from "./icon-grid/icon-grid";
import USDBLogoLight from "../../../assets/images/USDB-logo.png";
import USDBLogoDark from "../../../assets/images/USDB-logo-dark.png";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export const HomePage = (): JSX.Element => {
  const themeType = useSelector((state: RootState) => state.app.theme);

  return (
    <Container
      maxWidth="xl"
      className={style["heroContainer"]}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: { xs: "52px", md: "112px" },
        }}
        className={style["hero"]}
      >
        <Grid
          container
          className={style["heroWrap"]}
          sx={{ marginTop: "55px" }}
          columnSpacing={2}
          rowSpacing={{ xs: 4, md: 0 }}
        >
          <Grid
            item
            lg={6}
            md={12}
            order={{ lg: 1, xs: 2 }}
            className={style["iconsElement"]}
          >
            <IconGrid />
          </Grid>
          <Grid
            item
            lg={6}
            md={12}
            order={{ lg: 2, xs: 1 }}
            className={style["heroTextContent"]}
          >
            <Box className={style["heroRight"]}>
              <Box
                sx={{
                  height: { xs: "132px", md: "180px" },
                  display: { xs: "none", md: "flex" },
                }}
              >
                <img
                  src={themeType === "light" ? USDBLogoLight : USDBLogoDark}
                  alt="USDB Logo"
                  className={style["heroLogo"]}
                />
              </Box>
              <h1 className={style["heroTitle"]}>Where traditional finance meets DeFi</h1>
              <h3 className={style["heroSubtitle"]}>
                USDB provides a wide range of financial tools and services to individuals
                and institutions
              </h3>
              <a href="/usdb" className={style["heroLink"]} rel="noreferrer">
                Learn more
                <Icon component={ArrowUpwardIcon} className={style["linkArrow"]} />
              </a>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;
