import { Box, Container, Grid, Icon } from "@mui/material";
import style from "./home-page.module.scss";
import IconGrid from "./icon-grid/icon-grid";
import USDBLogoLight from "../../../assets/images/USDB-logo.svg";
import USDBLogoDark from "../../../assets/images/USDB-logo-dark.svg";
import CallMadeIcon from "@mui/icons-material/CallMade";
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
              <h1 className={style["heroTitle"]}>The Optimized Stablecoin</h1>
              <h3 className={style["heroSubtitle"]}>
                USDB is a stablecoin built for economic adoption. Combining the
                conventional and non-conventional, USDB provides a wide range of financial
                tools and services to individuals and institutions.
              </h3>
              <Box className="flex">
                <a
                  href="https://beets.fi/swap"
                  className={style["heroLink"]}
                  target="_blank"
                  rel="noreferrer"
                  style={
                    themeType === "light"
                      ? {
                          background: "black",
                          color: "white",
                        }
                      : { background: "white", color: "black" }
                  }
                >
                  Buy USDB
                  <Icon component={CallMadeIcon} className={style["linkArrow"]} />
                </a>
                <a
                  href="https://www.balance.capital/blog/usdb-stablecoin-and-how-it-stands-apart"
                  className={style["heroLink"]}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    opacity: 0.7,
                    ...(themeType === "light"
                      ? { background: "white", color: "black" }
                      : {
                          background: "black",
                          color: "white",
                        }),
                  }}
                >
                  Learn more
                  <Icon component={CallMadeIcon} className={style["linkArrow"]} />
                </a>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;
