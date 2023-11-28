import { useEffect, useState } from "react";
import { Box, Button, Grid, Paper, Typography, useMediaQuery } from "@mui/material";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import BonusModal from "./BonusModal";
import { ClaimModal } from "./ClaimModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { getAccountAffiliateState } from "../../store/selectors/affilate-selectors";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { BigNumber } from "ethers";

export const EarningView = (): JSX.Element => {
  const [bonusModalOpen, setBonusModalOpen] = useState<boolean>(false);
  const [claimModalOpen, setClaimModalOpen] = useState<boolean>(false);

  const data = useSelector((state: RootState) => getAccountAffiliateState(state));
  const isDesktop = useMediaQuery("(min-width:767px)");

  const [claimableAmount, setClaimableAmount] = useState<number>(0);
  const [totalAmounts, setTotalAmounts] = useState<number>(0);

  useEffect(() => {
    let sum = 0;
    let sum_claimed = 0;
    // fee: cumulative amount
    // total: claimed amount
    data.data.affiliateFees?.map((fee) => {
      sum += parseFloat(formatUnits(BigNumber.from(fee.fee), fee.decimals)) * fee.price;
    });
    data.data.totalAmounts?.map((token) => {
      sum_claimed +=
        parseFloat(formatUnits(token.amount, token.token.decimals)) *
        token.token.lastPrice;
    });
    setClaimableAmount(sum - sum_claimed);
    setTotalAmounts(sum_claimed);
  }, [data]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: isDesktop ? "row" : "column",
          alignItems: isDesktop ? "flex-end" : "flex-start",
          justifyContent: "space-between",
          width: "100%",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        }}
      >
        <Typography variant="h5" component="h5">
          Earnings
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            variant="caption"
            component="span"
            style={{
              color: "#7e9aa9",
              fontSize: "14px",
            }}
          >
            Balance Pass Bonus:
          </Typography>
          <Box
            display={"flex"}
            flexDirection={"row"}
            ml="10px"
            alignItems="center"
            sx={{
              bgcolor: "rgba(27,147,133,0.10196078431372549 )",
              padding: "5px 10px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
            onClick={() => setBonusModalOpen(true)}
          >
            <Typography variant="subtitle2" component="span">
              {data.data.isBonus ? "Active" : "Inactive"}
            </Typography>
            <Box ml={1} display={"flex"}>
              <InfoIcon />
            </Box>
          </Box>
        </Box>
      </Box>
      <Grid container sx={{ marginTop: "30px" }} spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper
            variant="elevation"
            elevation={6}
            sx={{
              width: "100%",
              minHeight: isDesktop ? "200px" : "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: isDesktop ? "flex-start" : "center",
            }}
          >
            <Box display={"flex"} flexDirection={"row"} alignItems="center">
              <Typography variant="subtitle2" component="span">
                Users referred
              </Typography>
              <Box ml={1} display={"flex"}>
                <InfoIcon />
              </Box>
            </Box>
            <Typography style={{ fontSize: "22px" }}>
              {new Intl.NumberFormat().format(data?.data?.referredAddresses?.length || 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            variant="elevation"
            elevation={6}
            sx={{
              width: "100%",
              minHeight: isDesktop ? "200px" : "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: isDesktop ? "flex-start" : "center",
            }}
          >
            <Box display={"flex"} flexDirection={"row"} alignItems="center">
              <Typography variant="subtitle2" component="span">
                Total fees earned
              </Typography>
              <Box ml={1} display={"flex"}>
                <InfoIcon />
              </Box>
            </Box>
            <Typography style={{ fontSize: "22px" }}>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(totalAmounts || 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            variant="elevation"
            elevation={6}
            sx={{
              width: "100%",
              minHeight: isDesktop ? "200px" : "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: isDesktop ? "flex-start" : "center",
            }}
          >
            <Box display={"flex"} flexDirection={"row"} alignItems="center">
              <Typography variant="subtitle2" component="span">
                Claimable fees
              </Typography>
              <Box ml={1} display={"flex"}>
                <InfoIcon />
              </Box>
            </Box>
            <Typography style={{ fontSize: "22px" }}>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(claimableAmount)}
            </Typography>
            <Button
              variant="contained"
              style={{ marginTop: "10px" }}
              disabled={claimableAmount === 0}
              onClick={() => setClaimModalOpen(true)}
            >
              Claim
            </Button>
          </Paper>
        </Grid>
      </Grid>
      <BonusModal open={bonusModalOpen} setOpen={setBonusModalOpen} />
      <ClaimModal data={data.data} open={claimModalOpen} setOpen={setClaimModalOpen} />
    </>
  );
};
