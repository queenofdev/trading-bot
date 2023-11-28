import { Box, Container, Grid, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

import BlueLongArrowRight from "../../../assets/icons/blue-long-arrow-right.svg";
import BlueCheckImage from "../../../assets/images/blue-check.png";

import style from "./borrowers.module.scss";

export const Lenders = (): JSX.Element => {
  const steps = [
    {
      description: "Set your\n own terms",
    },
    {
      description: "Earn\n juicy yields",
    },
    {
      description: "Get a bluechip\n NFT as collateral",
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: "100px", md: "150px" } }}>
      <Grid container spacing={2} sx={{ mt: "50px" }}>
        <Grid item xs={12} md={4}>
          <Box>
            <Typography variant="subtitle2" style={{ color: "#384BFF" }}>
              For lenders
            </Typography>
            <Box sx={{ mt: "20px", maxWidth: "500px" }}>
              <Typography variant="h4">
                Earn a juicy yield or get a bluechip NFT
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                ml: "20px",
                mt: "50px",
                cursor: "pointer",
              }}
            >
              <Link to="/lend">
                <Box sx={{ display: "flex" }}>
                  <Typography variant="subtitle2" style={{ color: "#384BFF" }}>
                    Explore listings
                  </Typography>
                  <Box sx={{ ml: "5px" }}>
                    <img
                      style={{ width: "16px" }}
                      src={BlueLongArrowRight}
                      alt="Explore collections"
                    />
                  </Box>
                </Box>
              </Link>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={8} className={style["borrowRow"]}>
          <Grid container spacing={4} sx={{ mt: "0px" }}>
            {steps.map((step: any, index: number) => {
              return (
                <Grid item xs={12} md={4} key={`lender_${index}`}>
                  <Box
                    sx={{
                      borderRadius: "30px",
                    }}
                    className={style["borrowBoxElem"]}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                        mb: "20px",
                      }}
                    >
                      <img src={BlueCheckImage} alt="Check" />
                    </Box>
                    <Typography variant="subtitle2" textAlign="center">
                      {step.description
                        .split(/\r\n|\n|\r/gm)
                        .map((line: string, index: number) => {
                          return (
                            <React.Fragment key={`line_split_${index}`}>
                              {line}
                              <br />
                            </React.Fragment>
                          );
                        })}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Lenders;
