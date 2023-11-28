import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Avatar, CircularProgress } from "@mui/material";
import { AffiliateData, AffiliateFee } from "../../types/backend-types";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useCallback, useState, useEffect } from "react";
import { useWeb3Context } from "@fantohm/shared-web3";
import { useDispatch } from "react-redux";
import { claimFees } from "../../store/reducers/affiliate-slice";
import { AppDispatch } from "../../store";
import { addAlert, GrowlNotification } from "../../store/reducers/app-slice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  maxWidth: "400px",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "20px",
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
};

export const ClaimModal = ({
  data,
  open,
  setOpen,
}: {
  data?: AffiliateData;
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  const { address, provider, chainId } = useWeb3Context();
  const [isPending, setPending] = useState<boolean>(false);
  const [isClaimable, setClaimable] = useState<boolean>(false);

  const dispatch: AppDispatch = useDispatch();

  const handleClose = () => setOpen(false);
  const [claimableFeeData, setClaimableFeeData] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      let sum = 0;
      let sum_claimed = 0;
      // fee: cumulative amount
      // total: claimed amount
      console.log("___: ", data.affiliateFees, data.totalAmounts);
      const _claimableFeeData = data.affiliateFees?.map((fee) => {
        sum += parseFloat(formatUnits(BigNumber.from(fee.fee), fee.decimals)) * fee.price;
        const claimedAmountData = data.totalAmounts?.find(
          (token) =>
            token.token.currentAddress.toLowerCase() === fee.currency.toLowerCase()
        );
        return {
          ...fee,
          fee: parseFloat(fee.fee) - (claimedAmountData?.amount?.toNumber() || 0),
        };
      });

      data.totalAmounts?.map((token) => {
        sum_claimed +=
          parseFloat(formatUnits(token.amount, token.token.decimals)) *
          token.token.lastPrice;
      });
      setClaimable(sum - sum_claimed > 0);
      setClaimableFeeData(_claimableFeeData || []);
    }
  }, [data]);

  const onClaim = useCallback(async () => {
    if (address && provider && chainId) {
      try {
        setPending(true);
        await dispatch(
          claimFees({
            tokens: data?.affiliateFees?.map((fee) => fee.currency) || [],
            fees: data?.affiliateFees?.map((fee) => fee.fee) || [],
            proofs: data?.proofs || [],
            provider,
            networkId: chainId,
          })
        ).unwrap();
        setPending(false);
        const notification: Partial<GrowlNotification> = {
          message: "Successfully claimed.",
          duration: 2000,
        };
        dispatch(addAlert(notification));
      } catch (e) {
        console.log("claim_error: ", e);
        const notification: Partial<GrowlNotification> = {
          message: "Sorry. Something wroing",
          duration: 2000,
          severity: "error",
        };
        dispatch(addAlert(notification));
      } finally {
        setPending(false);
        setOpen(false);
      }
    }
  }, [address, provider, chainId, data]);

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Claim
            </Typography>
            <TableContainer>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Token</TableCell>
                    <TableCell align="center">Amount</TableCell>
                    <TableCell align="right">Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data &&
                    claimableFeeData &&
                    claimableFeeData?.map((row: AffiliateFee, index: number) => (
                      <TableRow key={`claim-list-${index}`} sx={{ border: 0 }}>
                        <TableCell sx={{ display: "flex", gap: "5px" }}>
                          <Avatar
                            src={row.icon}
                            sx={{ width: "24px", height: "24px" }}
                            alt="icon"
                          />
                          <Typography>{row.tokenSymbol}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          {formatUnits(BigNumber.from(row.fee), row.decimals)}
                        </TableCell>
                        <TableCell align="right">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(
                            parseFloat(
                              formatUnits(BigNumber.from(row.fee), row.decimals)
                            ) * row.price
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            {!isPending && (
              <Button variant="contained" onClick={onClaim} disabled={!isClaimable}>
                Claim fees
              </Button>
            )}
            {isPending && (
              <Button variant="contained">
                <CircularProgress color="inherit" />
              </Button>
            )}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};
