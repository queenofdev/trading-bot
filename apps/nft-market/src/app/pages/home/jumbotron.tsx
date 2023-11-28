import { Box, Button, Container, Grid, Tooltip, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import BackgroundImage from "../../../assets/images/homepage-bg.png";
import ArrowRightDown from "../../../assets/icons/arrow-right-down.svg";
import ArrowRightUp from "../../../assets/icons/arrow-right-up.svg";

import style from "./jumbotron.module.scss";

export const Jumbotron = (): JSX.Element => {
  return (
    <Container maxWidth="xl" sx={{ pt: { xs: "100px", md: "200px" } }}>
      <Grid container spacing={4}>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            position: "relative",
            order: { xs: "2", md: "1" },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Box sx={{ mb: "30px", mt: { xs: "0px", sm: "100px" } }}>
              <Typography variant="h4">
                Unlock the liquidity you need with the NFTs you already own
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: { xs: "center", md: "flex-start" },
                mb: "100px",
              }}
            >
              <Link to="/borrow">
                <Tooltip title="Get liquidity">
                  <Button variant="contained" sx={{ mr: "10px" }}>
                    Borrow
                  </Button>
                </Tooltip>
              </Link>
              <Link to="/lend">
                <Tooltip title="Earn interest">
                  <Button variant="outlined">Lend</Button>
                </Tooltip>
              </Link>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                borderTop: "2px solid #7E9AA936",
                position: { xs: "unset", md: "absolute" },
                bottom: "0",
              }}
            >
              <Grid container>
                <Grid
                  item
                  xs={6}
                  sx={{ borderRight: "2px solid #7E9AA936" }}
                  className={style["jumboText"]}
                >
                  <Box sx={{ p: { xs: "40px 10px 20px 10px", md: "40px" } }}>
                    <Box sx={{ mb: "20px" }}>
                      <img src={ArrowRightDown} alt="Borrow" />
                    </Box>
                    <Box>
                      <Typography variant="h6">
                        Borrow against the value of your NFTs
                      </Typography>
                      <Typography variant="h6" style={{ fontWeight: "bolder" }}>
                        without selling them.
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6} className={style["jumboText"]}>
                  <Box sx={{ p: { xs: "40px 10px 20px 10px", md: "40px" } }}>
                    <Box sx={{ mb: "20px" }}>
                      <img src={ArrowRightUp} alt="Lend" />
                    </Box>
                    <Box>
                      <Typography variant="h6">
                        Lend with USDB and earn a passive yield,
                      </Typography>
                      <Typography variant="h6" style={{ fontWeight: "bolder" }}>
                        on your own terms.
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6} sx={{ order: { xs: "1", md: "2" } }}>
          <Box
            sx={{ display: "flex", justifyContent: "center", px: "15px" }}
            className={style["jumboImg"]}
          >
            <img
              src={BackgroundImage}
              alt="Colorful rectangles with rounded corners stacked"
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Jumbotron;
