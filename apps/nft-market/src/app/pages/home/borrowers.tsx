import { Box, Container, Grid, Typography } from "@mui/material";

import ConnectWalletImage from "../../../assets/images/connect-wallet.png";
import ChooseNftCollateraliseImage from "../../../assets/images/choose-nft-collateralise.png";
import AcceptOfferImage from "../../../assets/images/accept-offer.png";

import style from "./borrowers.module.scss";

export const Borrowers = (): JSX.Element => {
  const steps = [
    {
      backgroundImage: ConnectWalletImage,
      title: "Connect your wallet",
      description: "We’ll scan your wallet to find eligible NFTs to borrow against",
    },
    {
      backgroundImage: ChooseNftCollateraliseImage,
      title: "Choose an NFT to collateralise",
      description: "Pick your NFT, set your terms and wait for the offers to roll in",
    },
    {
      backgroundImage: AcceptOfferImage,
      title: "Accept the best offer and receive the funds immediately",
      description: "Funds can be accessed immediately",
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: "100px", md: "150px" } }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: { xs: "start", md: "space-between" },
          alignItems: { xs: "end", md: "center" },
        }}
      >
        <Box id="about-section">
          <Typography variant="subtitle2" style={{ color: "#384BFF" }}>
            For borrowers
          </Typography>
          <Box sx={{ mt: "20px", maxWidth: "500px" }}>
            <Typography variant="h4">Unleash the value of your NFTs</Typography>
          </Box>
        </Box>
      </Box>
      <Grid container spacing={4} sx={{ mt: "50px" }} className={style["borrowRow"]}>
        {steps.map((step: any, index: number) => {
          return (
            <Grid item xs={12} md={4} key={`borrower_steps_${index}`}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "end",
                  height: "300px",
                  borderRadius: "30px",
                  p: "40px",
                }}
                className={style["borrowBoxElem"]}
              >
                <Box sx={{ display: "flex", justifyContent: "center", mb: "20px" }}>
                  <img src={step?.backgroundImage} alt={step?.title} />
                </Box>
                <Typography variant="h6" textAlign="center">
                  {step?.title}
                </Typography>
                <Box sx={{ mt: "10px" }}>
                  <Typography variant="body1" textAlign="center">
                    {step?.description}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default Borrowers;
