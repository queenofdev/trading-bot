import { Box, Container, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import BlueLongArrowRight from "../../../assets/icons/blue-long-arrow-right.svg";
import BlackLongArrowRight from "../../../assets/icons/black-long-arrow-right.svg";
import BlueChip from "../../../assets/icons/blue-chip.svg";
import BoredApeYachtClub from "../../../assets/images/bored-ape-yacht-club.png";
import CryptoPunks from "../../../assets/images/crypto-punks.png";
import Doodles from "../../../assets/images/doodles.png";

import style from "./verified-collections.module.scss";
export const VerifiedCollections = (): JSX.Element => {
  const collections = [
    {
      title: "BoredApeYachtClub",
      image: BoredApeYachtClub,
    },
    {
      title: "Crypto Punks",
      image: CryptoPunks,
    },
    {
      title: "Doodles",
      image: Doodles,
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: "100px", md: "150px" } }}>
      <Grid container spacing={2} sx={{ mt: "50px" }}>
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              pr: "30px",
            }}
          >
            <Typography variant="subtitle2" style={{ color: "#384BFF" }}>
              BlueChips only
            </Typography>
            <Box sx={{ my: "20px" }}>
              <Typography variant="h4">Verified Collections</Typography>
            </Box>
            <Typography variant="subtitle2">
              We`re partnering with some of the top NFT collections in the space to ensure
              a secure service for lenders — with more bluechip collections to be added
              soon.
            </Typography>
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
                    Explore collections
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
        <Grid item xs={12} md={8} className={style["collectionRow"]}>
          <Grid container spacing={4}>
            {collections.map((collection: any, index: number) => {
              return (
                <Grid item xs={12} md={4} key={`verified_collection_${index}`}>
                  <Box
                    sx={{
                      borderRadius: "15px",
                      p: "10px",
                    }}
                    className={style["collectionBoxElem"]}
                  >
                    <Box sx={{ width: "100%" }}>
                      <img
                        style={{ width: "100%" }}
                        src={collection.image}
                        alt={collection.title}
                      />
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "center", width: "100%" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "calc(100% - 40px)",
                          borderRadius: "25px",
                          mt: "-25px",
                          backdropFilter: "blur(10px)",
                          background: "rgba(255,255,255,0.5)",
                        }}
                        className={style["collectionTitle"]}
                      >
                        <Typography
                          style={{
                            color: "#384BFF",
                            fontSize: "12px",
                            padding: "10px 0",
                          }}
                        >
                          {collection.title}
                        </Typography>
                        <Box sx={{ ml: "5px", mt: "3px" }}>
                          <img style={{ width: "14px" }} src={BlueChip} alt="Blue Chip" />
                        </Box>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: "30px",
                        mb: "10px",
                      }}
                    >
                      <Link to="/lend">
                        <Box sx={{ display: "flex" }}>
                          <Typography variant="subtitle2" style={{ color: "black" }}>
                            Explore listings
                          </Typography>
                          <Box sx={{ ml: "5px" }}>
                            <img
                              style={{ width: "16px" }}
                              src={BlackLongArrowRight}
                              alt="Explore listings"
                            />
                          </Box>
                        </Box>
                      </Link>
                    </Box>
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

export default VerifiedCollections;
