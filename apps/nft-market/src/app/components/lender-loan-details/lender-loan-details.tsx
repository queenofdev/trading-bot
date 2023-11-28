import { formatCurrency } from "@fantohm/shared-helpers";
import { useWeb3Context } from "@fantohm/shared-web3";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  LinearProgress,
  Paper,
  SxProps,
  Theme,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateLoanMutation } from "../../api/backend-api";
import { desiredNetworkId } from "../../constants/network";
import store, { RootState } from "../../store";
import { loadCurrencyFromAddress } from "../../store/reducers/currency-slice";
import {
  forceCloseLoan,
  LoanDetails,
  getLoanDetailsFromContract,
} from "../../store/reducers/loan-slice";
import { selectCurrencyByAddress } from "../../store/selectors/currency-selectors";
import { Asset, AssetStatus, Loan, LoanStatus } from "../../types/backend-types";
import style from "./lender-loan-details.module.scss";

/* eslint-disable-next-line */
export interface LenderLoanDetailsProps {
  loan: Loan;
  asset: Asset;
  sx: SxProps<Theme>;
}

type AppDispatch = typeof store.dispatch;

export function LenderLoanDetails({ loan, asset, sx }: LenderLoanDetailsProps) {
  const dispatch: AppDispatch = useDispatch();
  const { provider } = useWeb3Context();
  const [isPending, setIsPending] = useState(false);
  const [loanDetails, setLoanDetails] = useState<LoanDetails>({} as LoanDetails);
  // select logged in user
  const { user } = useSelector((state: RootState) => state.backend);

  const currency = useSelector((state: RootState) =>
    selectCurrencyByAddress(state, loan.term.currencyAddress)
  );

  useEffect(() => {
    dispatch(loadCurrencyFromAddress(loan.term.currencyAddress));
  }, []);

  const [updateLoan] = useUpdateLoanMutation();

  useEffect(() => {
    if (!loan || loan.contractLoanId == null || !provider) {
      return;
    }
    dispatch(
      getLoanDetailsFromContract({
        loan,
        networkId: desiredNetworkId,
        provider,
      })
    )
      .unwrap()
      .then((loanDetails: LoanDetails) => setLoanDetails(loanDetails));
  }, [loan]);

  const handleForecloseLoan = useCallback(async () => {
    if (loan.contractLoanId == null || !provider) {
      console.warn("Missing provider");
      return;
    }
    setIsPending(true);
    try {
      const forceCloseLoanResult = await dispatch(
        forceCloseLoan({
          loan,
          provider,
          networkId: desiredNetworkId,
        })
      ).unwrap();
      if (!forceCloseLoanResult) {
        return; //todo: throw nice error
      }
      const updateLoanRequest: Loan = {
        ...loan,
        assetListing: {
          ...loan.assetListing,
          asset: {
            ...loan.assetListing.asset,
            status: AssetStatus.Ready,
            wallet: loan.lender.address,
            owner: loan.lender,
          },
        },
        status: LoanStatus.Default,
      };
      updateLoan(updateLoanRequest);
    } catch (e) {
      console.log(e);
    } finally {
      setIsPending(false);
    }
  }, [loan, provider]);

  const canClaim = useMemo(() => {
    return loanDetails.endTime < Date.now() / 1000;
  }, [loanDetails]);

  const getLoanExpires = () => {
    if (loan && loan.term && loanDetails) {
      if (canClaim) {
        return "Overdue";
      }
      const duration = loan.term.duration * 24 * 60 * 60;
      const passedDays = Math.floor(
        (duration - Math.max(loanDetails.endTime - Date.now() / 1000, 0)) / (24 * 60 * 60)
      );

      return Math.max(passedDays, 0) + " / " + loan.term.duration + " days";
    }
    return "";
  };

  const getLoanProgress = () => {
    if (loan && loan.term && loanDetails) {
      const duration = loan.term.duration * 24 * 60 * 60;
      return (
        ((duration - Math.max(loanDetails.endTime - Date.now() / 1000, 0)) * 100) /
        duration
      );
    }

    return 0;
  };

  if (!loan || !loan.term || !loanDetails.amountDue) {
    return <Box className="flex fr fj-c"></Box>;
  }
  return (
    <Container sx={sx}>
      <Paper>
        <Box className="flex fr fj-sa fw">
          <Box className="flex fc">
            <Typography className={style["label"]}>Loan amount</Typography>
            <Typography
              className={`${style["data"]}`}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <img
                src={currency.icon}
                style={{ width: "20px", height: "20px", marginRight: "7px" }}
                alt=""
              />
              <Tooltip
                title={
                  !!currency &&
                  currency?.lastPrice &&
                  "~" &&
                  (loan.term.amount * currency?.lastPrice).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
                }
              >
                <Typography component="span">
                  {formatCurrency(
                    loan.term.amount,
                    Number(loan.term?.usdPrice) < 1.1 ? 2 : 5
                  ).replace("$", "")}
                </Typography>
              </Tooltip>
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>Total repayment</Typography>
            <Typography
              className={`${style["data"]} ${style["primary"]}`}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <img
                src={currency.icon}
                style={{ width: "20px", height: "20px", marginRight: "7px" }}
                alt=""
              />
              <Tooltip
                title={
                  !!currency &&
                  currency?.lastPrice &&
                  "~" &&
                  (loanDetails.amountDue * currency?.lastPrice).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
                }
              >
                <Typography component="span">
                  {formatCurrency(
                    loanDetails.amountDue,
                    Number(loan.term?.usdPrice) < 1.1 ? 2 : 5
                  ).replace("$", "")}
                </Typography>
              </Tooltip>
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>Time until loan expires</Typography>
            <Box className="flex fr w100" sx={{ alignItems: "center" }}>
              <Typography
                className={`${style["data"]}`}
                sx={{ color: canClaim ? "#fb1868" : undefined }}
              >
                {getLoanExpires()}
              </Typography>
              <LinearProgress
                variant="determinate"
                className={!canClaim ? style["progress-info"] : style["progress-error"]}
                value={getLoanProgress()}
                sx={{
                  width: "10rem",
                  marginLeft: "20px",
                  height: "8px",
                  borderRadius: "8px",
                }}
              />
            </Box>
          </Box>
          <Box className="flex fc">
            {!isPending && loanDetails.lender === user.address && (
              <Button
                variant="contained"
                onClick={handleForecloseLoan}
                disabled={!canClaim}
              >
                Claim NFT
              </Button>
            )}
            {isPending && (
              <Button variant="contained">
                <CircularProgress color="inherit" />
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default LenderLoanDetails;
