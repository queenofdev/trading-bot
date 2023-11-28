import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { HashLink as Link } from "react-router-hash-link";

import NftOne from "../../../assets/images/nft-1.png";
import NftTwo from "../../../assets/images/nft-2.png";
import NftOneLight from "../../../assets/images/nft-1-light.png";
import NftTwoLight from "../../../assets/images/nft-2-light.png";

export const LendersBanner = ({ isDark }: { isDark: boolean }): JSX.Element => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "100px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "60px",
          flexDirection: { sm: "column", xl: "row" },
        }}
      >
        <Box
          sx={{
            width: { xs: "360px", md: "386px" },
            height: { xs: "556px", md: "582px" },
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              position: "absolute",
              marginTop: { xs: "0px", xl: "100px" },
            }}
          >
            <img
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
              }}
              src={isDark ? NftOne : NftOneLight}
              alt=""
            />
          </Box>
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
            FOR LENDERS
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
            Earn a juicy yield or get a bluechip NFT
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "start",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <Typography
              sx={{
                width: "80%",
                fontSize: "18px",
                color: isDark ? "#8FA0C3" : "#7988A8",
                fontFamily: "inter",
              }}
            >
              Liqd unlocks a peer-to-peer lending opportunities for crypto holders to
              passively earn interest on their capital, backed by the value of the
              underlying NFT asset.
            </Typography>
          </Box>
          <Link to="/lend">
            <Button
              sx={{
                width: { xs: "360px", md: "400px" },
                height: "62px",
                border: "2px solid #374FFF",
                color: "#374FFF",
                borderRadius: "50px",
                fontFamily: "MonumentExtended",
                fontSize: { xs: "14px", md: "17px" },
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
              <span>Explore collections</span>
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
            width: { xs: "360px", md: "407px" },
            height: { xs: "470px", md: "516px" },
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              position: "absolute",
              marginTop: { xs: "0px", xl: "-50px" },
            }}
          >
            <img
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
              }}
              src={isDark ? NftTwo : NftTwoLight}
              alt=""
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LendersBanner;
