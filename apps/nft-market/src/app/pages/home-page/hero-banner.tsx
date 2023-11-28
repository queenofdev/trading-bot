import Box from "@mui/material/Box";
import { HashLink as Link } from "react-router-hash-link";
import HeroBannerImg from "../../../assets/images/hero-banner.png";
import HeroBannerLightImg from "../../../assets/images/hero-banner-light.png";
import HeroBannerMobileImg from "../../../assets/images/hero-banner-mobile.png";
import HeroBannerMobileLightImg from "../../../assets/images/hero-banner-mobile-light.png";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import style from "./hero-banner.module.scss";

export const HeroBanner = ({ isDark }: { isDark: boolean }): JSX.Element => {
  return (
    <Box sx={{ position: "relative" }}>
      <Box
        sx={{
          position: "absolute",
          zIndex: "-1",
          top: "-142px",
          left: "-100px",
          height: "1080px",
          backgroundImage: {
            xs: isDark
              ? `url('${HeroBannerMobileImg}')`
              : `url('${HeroBannerMobileLightImg}')`,
            sm: isDark ? `url('${HeroBannerImg}')` : `url('${HeroBannerLightImg}')`,
          },
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className={style["bgImgWidth"]}
      ></Box>
      <Box
        sx={{
          height: "936px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "31px", xl: "50px" },
            width: "80%",
            textAlign: "center",
            fontFamily: "MonumentExtended",
            color: isDark ? "#E6EDFF" : "#0A0C0F",
          }}
        >
          Unlock the value of your NFTs, without selling
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "16px", xl: "20px" },
            marginTop: "20px",
            width: "80%",
            textAlign: "center",
            fontFamily: "inter",
            color: isDark ? "#8FA0C3" : "#0A0C0F",
          }}
        >
          Don’t sell your NFT, borrow against it and unlock the value on your own terms
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", xl: "row" },
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <Link to="/borrow">
            <Button
              sx={{
                width: "310px",
                height: { xs: "68px", xl: "76px" },
                border: "2px solid #374FFF",
                borderRadius: "50px",
                fontFamily: "inter",
                fontSize: { xs: "14px", xl: "18px" },
              }}
            >
              Borrow
            </Button>
          </Link>
          <Link to="/lend">
            <Button
              sx={{
                width: "310px",
                height: { xs: "68px", xl: "76px" },
                border: "2px solid #374FFF",
                borderRadius: "50px",
                fontFamily: "inter",
                fontSize: { xs: "14px", xl: "18px" },
              }}
            >
              Lend
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default HeroBanner;
