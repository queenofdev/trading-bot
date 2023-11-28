import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { HashLink as Link } from "react-router-hash-link";

import FundsImg from "../../../assets/images/funds-img.png";
import OffersImg from "../../../assets/images/offers-img.png";
import FundsLightImg from "../../../assets/images/funds-light-img.png";
import OffersLightImg from "../../../assets/images/offers-light-img.png";

export const BorrowerBanner = ({ isDark }: { isDark: boolean }): JSX.Element => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "150px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: { xs: "30px", xl: "10px" },
          flexDirection: { xs: "column", xl: "row" },
        }}
      >
        <Box
          sx={{
            width: { xs: "360px", md: "495px" },
            height: { xs: "248px", md: "383px" },
          }}
        >
          <img
            style={{ width: "100%", height: "100%" }}
            src={isDark ? OffersImg : OffersLightImg}
            alt=""
          />
        </Box>
        <Box
          sx={{
            width: { xs: "360px", sm: "376px", md: "717px" },
            height: { xs: "480px", md: "323px" },
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "14px", sm: "16px" },
              color: "#8FA0C3",
              fontFamily: "SequelBlack",
            }}
          >
            FOR BORROWERS
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "28px", xl: "28px" },
              color: isDark ? "#CAD6EE" : "#0A0C0F",
              height: { xs: "200px", md: "120px" },
              padding: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontFamily: "MonumentExtended",
            }}
          >
            Get the liquidity without selling your NFT
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "start",
              justifyContent: "center",
              marginTop: "20px",
              gap: "10px",
              flexWrap: { xs: "wrap", md: "nowrap" },
            }}
          >
            {[
              "Borrow in crypto or stablecoins",
              "No credit checks neccessary",
              "Set your own loan terms and duration",
            ].map((v, i) => (
              <Typography
                key={i}
                sx={{
                  width: "180px",
                  fontSize: "18px",
                  color: isDark ? "#8FA0C3" : "#7988A8",
                  fontFamily: "inter",
                }}
              >
                {v}
              </Typography>
            ))}
          </Box>
          <Link to="/borrow">
            <Button
              sx={{
                width: "350px",
                height: "62px",
                border: "2px solid #374FFF",
                color: "#374FFF",
                borderRadius: "50px",
                fontFamily: "MonumentExtended",
                fontSize: "17px",
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
                gap: "25px",
                marginTop: "20px",
                marginInline: "auto",
                "&:hover": {
                  color: isDark ? "#fff" : "#000",
                },
                "&:hover .arrowSvg path": {
                  stroke: isDark ? "#fff" : "#000",
                },
              }}
            >
              <span>GET STARTED</span>
              <svg
                className="arrowSvg"
                xmlns="http://www.w3.org/2000/svg"
                width="27.609"
                height="18.718"
                viewBox="0 0 27.609 18.718"
              >
                <g
                  id="_8666606_arrow_right_icon"
                  data-name="8666606_arrow_right_icon"
                  transform="translate(0 0.707)"
                >
                  <path
                    id="Path_2948"
                    data-name="Path 2948"
                    d="M7.512,0H33.98"
                    transform="translate(-7.512 8.652)"
                    fill="none"
                    stroke="#374fff"
                    strokeWidth="2"
                  />
                  <path
                    id="Path_2947"
                    data-name="Path 2947"
                    d="M12,5l8.652,8.652L12,22.3"
                    transform="translate(5.543 -5)"
                    fill="none"
                    stroke="#374fff"
                    strokeWidth="2"
                  />
                </g>
              </svg>
            </Button>
          </Link>
        </Box>
        <Box
          sx={{
            width: { xs: "360px", md: "471px" },
            height: { xs: "265px", md: "376px" },
          }}
        >
          <img
            style={{ width: "100%", height: "100%" }}
            src={isDark ? FundsImg : FundsLightImg}
            alt=""
          />
        </Box>
      </Box>
    </Box>
  );
};

export default BorrowerBanner;
