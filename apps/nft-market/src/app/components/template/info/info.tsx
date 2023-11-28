import { useEffect, useState, MouseEvent } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import Typography from "@mui/material/Typography";
import { Dialog, Link, useMediaQuery, useTheme, Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { HashLink } from "react-router-hash-link";
import { useSelector } from "react-redux";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useLocation } from "react-router-dom";
import { addAlert } from "../../../store/reducers/app-slice";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import infoSvg from "../../../../assets/icons/info.svg";
import infoDarkSvg from "../../../../assets/icons/info-dark.svg";
import infoClosePng from "../../../../assets/images/info-close.png";
import infoIconPng from "../../../../assets/images/info-icon.png";
import { useSendReportMutation } from "../../../api/backend-api";
import style from "./info.module.scss";

export const InfoBtn = (): JSX.Element => {
  const location = useLocation();
  const themeType = useSelector((state: RootState) => state.theme.mode);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [nftContract, setNftContract] = useState<string>();
  const [nftTokenID, setNftTokenID] = useState<string>();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch: AppDispatch = useDispatch();
  const [
    sendReport,
    { isLoading: isSendReportLoading, data: sendReportResponse, reset: sendReportReset },
  ] = useSendReportMutation();

  useEffect(() => {
    if (!isSendReportLoading && !!sendReportResponse) {
      sendReportReset();
    }
  }, [isSendReportLoading, sendReportResponse]);

  useEffect(() => {
    const paramArr = location.pathname.split("/");
    if (paramArr[1] === "asset") {
      setNftContract(paramArr[2]);
      setNftTokenID(paramArr[3]);
    } else {
      setNftContract(undefined);
      setNftTokenID(undefined);
    }
  }, [location]);

  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setFormOpen(false);
  };

  const handleFormOpen = () => {
    setFormOpen(true);
  };

  const handleSendReport = () => {
    const reportParam = {
      subject: "My NFT isn't showing",
      text: `NFT in contract address: ${nftContract}, tokenID ${nftTokenID} isn't showing`,
      to: "info@nftport.xyz",
    };

    sendReport(reportParam);
    dispatch(addAlert({ message: "Report sent!" }));
  };
  const backgroundColor = () =>
    themeType === "dark" ? "#fff !important" : "#16181A !important";

  return (
    <>
      <Box
        sx={{
          position: "absolute",
          right: 20,
          bottom: 10,
          zIndex: 10,
        }}
      >
        <IconButton
          onClick={handleClick}
          sx={{
            background: backgroundColor(),
            width: { xs: "49px", lg: "64px" },
            height: { xs: "49px", lg: "64px" },
          }}
          aria-controls={open ? "info-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar
            sx={{ width: { xs: "29px", lg: "37px" }, height: { xs: "29px", lg: "37px" } }}
            src={themeType === "dark" ? infoDarkSvg : infoSvg}
          />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          id="info-menu"
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              background: backgroundColor(),
              overflow: "visible",
              width: "406px",
              paddingBottom: "28px !important",
              top: "auto !important",
              bottom: { xs: "68px", lg: "84px" },
              "& ul": {
                padding: "5px 10px",
                margin: 0,
              },
            },
          }}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Box sx={{ color: "#fff" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontSize: "20px" }}>Need some help?</Typography>
              <Avatar
                sx={{ width: "23px", height: "23px" }}
                onClick={handleClose}
                src={infoClosePng}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                mt: "10px",
              }}
            >
              <Avatar
                sx={{ width: "23px", height: "23px" }}
                onClick={handleClose}
                src={infoIconPng}
              />
              <Typography sx={{ fontSize: "14px" }}>
                Need help getting started? Click{" "}
                <HashLink
                  to="/lend"
                  onClick={handleClose}
                  style={{ color: "#fff", borderBottom: "1px solid #fff" }}
                >
                  here
                </HashLink>
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                mt: "10px",
              }}
            >
              <Avatar
                sx={{ width: "23px", height: "23px" }}
                onClick={handleClose}
                src={infoIconPng}
              />
              <Typography sx={{ fontSize: "14px" }}>
                Report an issue or bug{" "}
                <Link
                  href="https://liqd.nolt.io"
                  style={{ color: "#fff", borderBottom: "1px solid #fff" }}
                  target="_blank"
                  onClick={handleClose}
                >
                  here
                </Link>
              </Typography>
            </Box>
            {nftContract && nftTokenID && (
              <Box
                sx={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  mt: "10px",
                }}
              >
                <Avatar
                  sx={{ width: "23px", height: "23px" }}
                  onClick={handleClose}
                  src={infoIconPng}
                />
                <Typography sx={{ fontSize: "14px" }}>
                  My NFT isn't showing. Click{" "}
                  <Link
                    style={{
                      color: "#fff",
                      borderBottom: "1px solid #fff",
                      cursor: "pointer",
                    }}
                    target="_blank"
                    onClick={handleFormOpen}
                  >
                    here
                  </Link>
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              background: "#374FFF",
              width: "319px",
              height: "9px",
              position: "absolute !important",
              left: "-8px",
              bottom: " -28px",
              borderBottomLeftRadius: "25px",
            }}
          ></Box>
        </Menu>
      </Box>
      <Dialog
        open={formOpen}
        className={(style["dialogContainer"], style["dialogBody"])}
        fullScreen={isSmall}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <h1 style={{ margin: "0" }}>Report an issue</h1>
          <IconButton onClick={handleClose} style={{ position: "absolute", right: 15 }}>
            <CancelOutlinedIcon sx={{ fontSize: 40 }} />
          </IconButton>
        </Box>
        <Box
          className="flex fc"
          sx={{ borderTop: "1px solid lightgrey", mt: "1em", p: "1em" }}
        >
          <span className={style["title"]}>Issue to report</span>
          <input
            className={style["inputBox"]}
            disabled
            value="My NFT isn't showing"
          ></input>
          <span className={style["title"]}>NFT contract</span>
          <input
            className={style["inputBox"]}
            onChange={(e) => setNftContract(e.target.value)}
            value={nftContract}
          ></input>
          <span className={style["title"]}>NFT Token ID</span>
          <input
            className={style["inputBox"]}
            onChange={(e) => setNftTokenID(e.target.value)}
            value={nftTokenID}
          ></input>
          <Button
            variant="contained"
            style={{ marginTop: 20 }}
            onClick={() => handleSendReport()}
          >
            Send
          </Button>
        </Box>
      </Dialog>
    </>
  );
};
