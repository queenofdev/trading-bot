import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import BgCard from "../../../assets/images/bg-card.png";
import BgCardHover from "../../../assets/images/bg-card-hover.png";

export const WorkBanner = ({ isDark }: { isDark: boolean }): JSX.Element => {
  const [data, setData] = useState([
    {
      id: 1,
      title: "CONNECT",
      heading: "Connect your wallet and choose an NFT to collateralise",
      description: "We’ll scan your wallet to find eligible NFTs to borrow against",
      over: false,
    },
    {
      id: 2,
      title: "ACCEPT",
      heading: "Pick your NFT, set your terms and wait for the offers to roll in",
      description: "Accept the best offer and receive the funds immediately",
      over: false,
    },
    {
      id: 3,
      title: "REPAY",
      heading: "At the end of your loan term, repay your credit and get your NFT",
      description:
        "Once your loan has been repaid, we’ll immediately transfer your NFT back to you",
      over: false,
    },
  ]);

  const toggleImage = (obj: any) => {
    const arr = data.map((v: any) => {
      return v.id === obj.id ? { ...obj, over: !obj.over } : { ...v };
    });
    setData(arr);
  };

  return (
    <Box sx={{ width: "100%", marginTop: "150px", textAlign: "center" }}>
      <Typography
        sx={{
          fontSize: { xs: "14px", sm: "16px" },
          color: isDark ? "#374FFF" : "#8FA0C3",
          fontFamily: "SequelBlack",
        }}
      >
        ITS SIMPLE
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: "31px", xl: "45px" },
          color: isDark ? "#E6EDFF" : "#0A0C0F",
          marginTop: "20px",
          fontFamily: "MonumentExtended",
        }}
      >
        How does it work?
      </Typography>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: "50px",
          marginTop: "50px",
        }}
      >
        {data.map((obj: any) => (
          <Box
            sx={{
              width: { xs: "354px", sm: "470px" },
              height: { xs: "272px", sm: "361px" },
              position: "relative",
            }}
            onMouseOver={() => toggleImage(obj)}
            onMouseOut={() => toggleImage(obj)}
            key={obj.id}
          >
            <img
              style={{
                position: "absolute",
                left: "0",
                top: "0",
                zIndex: "-1",
                width: "100%",
                height: "100%",
              }}
              src={obj.over ? BgCardHover : BgCard}
              alt=""
            />

            <Typography
              sx={{
                fontSize: { xs: "28px", xl: "38px" },
                color: isDark ? "#8FA0C3" : "#0A0C0F",
                height: { xs: "136px", sm: "180px" },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "MonumentExtended",
                "&:hover": {
                  color: isDark ? "#CAD6EE" : "#0A0C0F",
                },
              }}
            >
              {obj.title}
            </Typography>
            <Box
              sx={{
                height: { xs: "136px", sm: "180px" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "15px", xl: "22px" },
                  color: isDark ? "#CAD6EE" : "#000",
                  width: "80%",
                  fontFamily: "inter",
                  fontWeight: "600",
                }}
              >
                {obj.heading}
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: "13px", xl: "18px" },
                  color: isDark ? "#8FA0C3" : "#7988A8",
                  width: "80%",
                  fontFamily: "inter",
                }}
              >
                {obj.description}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default WorkBanner;
