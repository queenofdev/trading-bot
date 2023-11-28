import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { HashLink as Link } from "react-router-hash-link";

import BgStarted from "../../../assets/images/bg-started.png";

export const StartedBanner = ({ isDark }: { isDark: boolean }): JSX.Element => {
  return (
    <Box
      sx={{
        width: "100%",
        marginTop: "150px",
        marginBottom: "200px",
        backgroundImage: `url('${BgStarted}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
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
            color: "#374FFF",
            fontFamily: "SequelBlack",
          }}
        >
          GET STARTED
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
          Are you ready to get started with Liqd?
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
            With ZERO fees for the first month, now is the time to utilise Liqd and get
            liquidity for your favourite NFTs without selling.
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            marginTop: "20px",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <Link to="/borrow">
            <Button
              sx={{
                width: { xs: "310px", md: "309px" },
                height: "62px",
                border: "2px solid #374FFF",
                color: "#fff",
                background: "#374FFF",
                borderRadius: "50px",
                fontFamily: "inter",
                fontSize: { xs: "14px", md: "17px" },
                "&:active": {
                  background: "#374FFF",
                },
                "&:hover": {
                  background: "#374FFF",
                },
              }}
            >
              Launch App
            </Button>
          </Link>

          <a
            href="https://www.balance.capital/balancepass"
            target="_blank"
            rel="noreffer noreferrer"
          >
            <Button
              sx={{
                width: { xs: "310px", md: "309px" },
                height: "62px",
                border: "2px solid #374FFF",
                color: isDark ? "#fff" : "#0A0C0F",
                borderRadius: "50px",
                fontFamily: "inter",
                fontSize: { xs: "14px", md: "17px" },
              }}
            >
              Get a pass
            </Button>
          </a>
        </Box>
      </Box>
    </Box>
  );
};

export default StartedBanner;
