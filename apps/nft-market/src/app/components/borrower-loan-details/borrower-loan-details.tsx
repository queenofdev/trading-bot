import { formatCurrency } from "@fantohm/shared-helpers";
import {
  checkErc20Allowance,
  error,
  requestErc20Allowance,
  selectErc20AllowanceByAddress,
  selectErc20BalanceByAddress,
  useWeb3Context,
} from "@fantohm/shared-web3";
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
import store, { RootState } from "../../store";
import { useUpdateLoanMutation } from "../../api/backend-api";
import {
  getLoanDetailsFromContract,
  LoanDetails,
  repayLoan,
} from "../../store/reducers/loan-slice";
import { Asset, AssetStatus, Loan, LoanStatus } from "../../types/backend-types";
import style from "./borrower-loan-details.module.scss";
import { desiredNetworkId } from "../../constants/network";
import { selectCurrencyByAddress } from "../../store/selectors/currency-selectors";
import { loadCurrencyFromAddress } from "../../store/reducers/currency-slice";
import { addAlert } from "../../store/reducers/app-slice";

export interface BorrowerLoanDetailsProps {
  asset: Asset;
  loan: Loan;
  sx?: SxProps<Theme>;
}

type AppDispatch = typeof store.dispatch;

export const BorrowerLoanDetails = ({
  asset,
  loan,
  sx,
}: BorrowerLoanDetailsProps): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const { provider } = useWeb3Context();
  const [isPending, setIsPending] = useState(false);
  const [loanDetails, setLoanDetails] = useState<LoanDetails>({} as LoanDetails);
  // select logged in user
  const { user } = useSelector((state: RootState) => state.backend);
  const { repayLoanStatus } = useSelector((state: RootState) => state.loans);

  const currency = useSelector((state: RootState) =>
    selectCurrencyByAddress(state, loan.term.currencyAddress)
  );

  useEffect(() => {
    dispatch(loadCurrencyFromAddress(loan.term.currencyAddress));
  }, []);

  // status of allowance check or approval
  const { checkErc20AllowanceStatus, requestErc20AllowanceStatus } = useSelector(
    (state: RootState) => state.wallet
  );

  // select the currency allowance provided to lending contract for this address
  const erc20Allowance = useSelector((state: RootState) =>
    selectErc20AllowanceByAddress(state, {
      walletAddress: user.address,
      erc20TokenAddress: loanDetails.currency || "",
    })
  );

  const currencyBalance = useSelector((state: RootState) =>
    selectErc20BalanceByAddress(state, currency?.currentAddress)
  );

  const notEnoughBalance = useMemo(() => {
    return (
      currencyBalance &&
      loanDetails.amountDueGwei &&
      currencyBalance.lt(loanDetails.amountDueGwei)
    );
  }, [currencyBalance, loanDetails.amountDueGwei]);

  const [updateLoan, { isLoading: isLoanUpdating }] = useUpdateLoanMutation();

  // check to see if we have an approval for the amount required for this txn
  useEffect(() => {
    if (
      user.address &&
      provider &&
      loanDetails.currency &&
      loanDetails.currency !== "0x0000000000000000000000000000000000000000" &&
      !erc20Allowance
    ) {
      dispatch(
        checkErc20Allowance({
          networkId: desiredNetworkId,
          provider,
          walletAddress: user.address,
          assetAddress: loanDetails.currency,
          lendingContractAddress: loanDetails.lendingContractAddress,
        })
      );
    }
  }, [user.address, provider, loanDetails.currency, erc20Allowance]);

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

  const handleRepayLoan = useCallback(async () => {
    if (loan.contractLoanId == null || !provider) {
      return;
    }
    if (erc20Allowance && erc20Allowance.gte(loanDetails.amountDueGwei)) {
      const repayLoanParams = {
        loan,
        amountDue: loanDetails.amountDueGwei,
        provider,
        networkId: desiredNetworkId,
      };
      try {
        const repayLoanResult = await dispatch(repayLoan(repayLoanParams)).unwrap();
        if (!repayLoanResult) {
          return; //todo: throw nice error
        }
        const updateLoanRequest: Loan = {
          ...loan,
          assetListing: {
            ...loan.assetListing,
            asset: { ...loan.assetListing.asset, status: AssetStatus.Ready },
          },
          status: LoanStatus.Complete,
        };
        const result: any = await updateLoan(updateLoanRequest);
        if (result?.error) {
          if (result?.error?.status === 403) {
            dispatch(
              addAlert({
                message:
                  "Failed to repay a loan because your signature is expired or invalid.",
                severity: "error",
              })
            );
          } else {
            dispatch(
              addAlert({ message: result?.error?.data.message, severity: "error" })
            );
          }
        } else {
          dispatch(addAlert({ message: "Loan is repaid." }));
        }
      } catch (e: any) {
        if (e.error === undefined) {
          let message;
          if (e.message === "Internal JSON-RPC error.") {
            message = e.data.message;
          } else {
            message = e.message;
          }
          if (typeof message === "string") {
            dispatch(
              addAlert({ message: `Unknown error: ${message}`, severity: "error" })
            );
          }
        } else {
          dispatch(
            addAlert({ message: `Unknown error: ${e.error.message}`, severity: "error" })
          );
        }
        return;
      }
    } else {
      console.warn(`insufficient allowance: ${erc20Allowance}`);
    }
  }, [
    checkErc20AllowanceStatus,
    requestErc20AllowanceStatus,
    erc20Allowance,
    loanDetails.amountDueGwei,
  ]);

  const handleRequestAllowance = useCallback(async () => {
    if (!provider) return;
    dispatch(
      requestErc20Allowance({
        networkId: desiredNetworkId,
        provider,
        walletAddress: user.address,
        assetAddress: loanDetails.currency,
        amount: loanDetails.amountDueGwei,
        lendingContractAddress: loanDetails.lendingContractAddress,
      })
    );
  }, [
    checkErc20AllowanceStatus,
    requestErc20AllowanceStatus,
    erc20Allowance,
    loanDetails.amountDueGwei,
  ]);

  useEffect(() => {
    // if nothing is loading and pending is true, stop pending
    if (
      isLoanUpdating === false &&
      requestErc20AllowanceStatus !== "loading" &&
      checkErc20AllowanceStatus !== "loading" &&
      repayLoanStatus !== "loading" &&
      isPending === true
    ) {
      setIsPending(false);
    }

    // if pending is false, but something is loading, start pending
    if (
      isPending === false &&
      (isLoanUpdating === true ||
        requestErc20AllowanceStatus === "loading" ||
        checkErc20AllowanceStatus === "loading" ||
        repayLoanStatus === "loading")
    ) {
      setIsPending(true);
    }
  }, [
    isPending,
    isLoanUpdating,
    requestErc20AllowanceStatus,
    checkErc20AllowanceStatus,
    repayLoanStatus,
  ]);

  const [currentBlockTime, setCurrentBlockTime] = useState<number>();

  useEffect(() => {
    if (!provider) {
      return;
    }
    provider.getBlockNumber().then((blockNumber) => {
      provider.getBlock(blockNumber).then((block) => {
        setCurrentBlockTime(block?.timestamp);
      });
    });
  }, [provider]);

  const canRepay = useMemo(() => {
    return (
      loanDetails?.endTime && currentBlockTime && loanDetails.endTime >= currentBlockTime
    );
  }, [loanDetails, currentBlockTime]);

  if (!loan || !loan.term || !loanDetails.amountDue) {
    return (
      <Box className="flex fr fj-c">
        <CircularProgress />
      </Box>
    );
  }

  const getLoanExpires = () => {
    if (loan && loan.term && loanDetails) {
      if (!canRepay) {
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
                    Number(currency?.lastPrice) < 1.1 ? 2 : 5
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
                    Number(currency?.lastPrice) < 1.1 ? 2 : 5
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
                sx={{ color: !canRepay ? "#fb1868" : undefined }}
              >
                {getLoanExpires()}
              </Typography>
              <LinearProgress
                variant="determinate"
                className={canRepay ? style["progress-info"] : style["progress-error"]}
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
            {canRepay && (
              <>
                {" "}
                {!!erc20Allowance &&
                  erc20Allowance.gte(loanDetails.amountDueGwei) &&
                  !isPending && (
                    <Button variant="contained" onClick={handleRepayLoan}>
                      Repay loan
                    </Button>
                  )}
                {(!erc20Allowance || erc20Allowance.lt(loanDetails.amountDueGwei)) &&
                  !notEnoughBalance &&
                  !isPending && (
                    <Button variant="contained" onClick={handleRequestAllowance}>
                      Approve {currency?.symbol} for repayment
                    </Button>
                  )}
                {notEnoughBalance && (
                  <Button variant="contained" disabled={true}>
                    Insufficient Funds for Repayment
                  </Button>
                )}
                {isPending && (
                  <Button variant="contained">
                    <CircularProgress color="inherit" />
                  </Button>
                )}
              </>
            )}
            {!canRepay && !notEnoughBalance && (
              <Button variant="contained" onClick={handleRepayLoan} disabled>
                Repay loan
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default BorrowerLoanDetails;
