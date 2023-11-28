import { Box, Button, Container, Grid, Typography } from "@mui/material";
import React from "react";

import BlueCheckImage from "../../../assets/images/blue-check.png";
import { Link } from "react-router-dom";

import style from "./borrowers.module.scss";

export const BackedLoan = (): JSX.Element => {
  const reasons = [
    {
      description: "Get Funds Without Selling",
    },
    {
      description: "Borrow in Stablecoins",
    },
    {
      description: "No Credit Checks",
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ my: { xs: "100px", md: "150px" } }}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Box sx={{ mb: "50px" }}>
          <Typography variant="h4">Why Get an NFT-Backed Loan</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", mb: "50px" }}>
          <Link to="/borrow">
            <Button variant="contained" sx={{ mr: "10px" }}>
              Get started
            </Button>
          </Link>
        </Box>
      </Box>
      <Grid container spacing={2} sx={{ mt: "50px" }} className={style["borrowRow"]}>
        <Grid item xs={12} md={12}>
          <Grid container spacing={4}>
            {reasons.map((reason: any, index: number) => {
              return (
                <Grid item xs={12} md={4} key={`backed_loan_${index}`}>
                  <Box
                    sx={{
                      borderRadius: "25px",
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
                      {reason.description}
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

export default BackedLoan;
