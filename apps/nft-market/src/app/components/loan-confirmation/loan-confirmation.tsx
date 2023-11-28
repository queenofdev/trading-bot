import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  AssetStatus,
  BackendLoadingStatus,
  Listing,
  ListingStatus,
  Loan,
  LoanStatus,
} from "../../types/backend-types";
import style from "./loan-confirmation.module.scss";
import { useTermDetails } from "../../hooks/use-term-details";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  checkErc20Allowance,
  getLendingAddressConfig,
  loadErc20Balance,
  loadPlatformFee,
  networks,
  requestErc20Allowance,
  selectErc20AllowanceByAddress,
  selectErc20BalanceByAddress,
  useWeb3Context,
} from "@fantohm/shared-web3";
import { formatCurrency, formatDateTimeString } from "@fantohm/shared-helpers";
import { selectCurrencyByAddress } from "../../store/selectors/currency-selectors";
import { desiredNetworkId } from "../../constants/network";
import { BigNumber, ethers } from "ethers";
import { contractCreateLoan } from "../../store/reducers/loan-slice";
import {
  useCreateLoanMutation,
  useUpdateLoanMutation,
  useGetCollectionsQuery,
  useResetPartialLoanMutation,
} from "../../api/backend-api";
import { Link } from "react-router-dom";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { addAlert } from "../../store/reducers/app-slice";
import { Erc20Currency } from "../../helpers/erc20Currency";

export interface LoanConfirmationProps {
  listing: Listing;
  onClose?: () => void;
}

type CalculatedTermData = {
  amountGwei: BigNumber;
  platformFeeAmtGwei: BigNumber;
  platformFeeAmt: number;
  minRequiredBalanceGwei: BigNumber;
  totalAmt: number;
};

export const LoanConfirmation = ({
  listing,
  onClose,
}: LoanConfirmationProps): JSX.Element => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const dispatch: AppDispatch = useDispatch();
  const { provider } = useWeb3Context();

  const [open, setOpen] = useState(false);
  const { repaymentTotal, estRepaymentDate } = useTermDetails(listing.term);
  const { user } = useSelector((state: RootState) => state.backend);
  const { loanCreationStatus } = useSelector((state: RootState) => state.loans);

  const { data: collections, isLoading: isCollectionLoading } = useGetCollectionsQuery({
    contractAddress: listing.asset.assetContractAddress,
  });

  // status of contract calls for allowance and platform fee
  const { checkErc20AllowanceStatus, requestErc20AllowanceStatus, platformFees } =
    useSelector((state: RootState) => state.wallet);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    setOpen(false);
  };

  // when a user connects their wallet login to the backend api
  useEffect(() => {
    if (provider && user.address) {
      dispatch(
        loadPlatformFee({
          networkId: desiredNetworkId,
          address: user.address,
          currencyAddress: listing.term.currencyAddress,
        })
      );
    }
  }, [provider, user.address, listing.term.currencyAddress]);

  // currency and allowance info
  const allowance = useSelector((state: RootState) =>
    selectErc20AllowanceByAddress(state, {
      walletAddress: user.address,
      erc20TokenAddress: listing.term.currencyAddress,
    })
  );

  const currency: Erc20Currency = useSelector((state: RootState) =>
    selectCurrencyByAddress(state, listing.term.currencyAddress)
  );

  // createloan backend api call
  const [createLoan, { isLoading: isCreating, reset: resetCreateLoan }] =
    useCreateLoanMutation();
  const [updateLoan, { isLoading: isUpdating, reset: resetUpdateLoan }] =
    useUpdateLoanMutation();
  const [resetPartialLoan, { isLoading: isResetting, reset: resetResetPartialLoan }] =
    useResetPartialLoanMutation();

  const {
    platformFeeAmt,
    minRequiredBalanceGwei,
    totalAmt,
    amountGwei,
    platformFeeAmtGwei,
  }: CalculatedTermData = useMemo(() => {
    if (
      typeof platformFees[listing.term.currencyAddress] === "undefined" ||
      typeof listing === "undefined" ||
      typeof currency === undefined
    )
      return {} as CalculatedTermData;
    const amountGwei = ethers.utils.parseUnits(
      listing.term.amount.toString(),
      currency?.decimals
    );

    const platformFeeAmtGwei: BigNumber = BigNumber.from(
      platformFees[listing.term.currencyAddress]
    )
      .mul(amountGwei)
      .div(10000);
    const minRequiredBalanceGwei = amountGwei.add(platformFeeAmtGwei);
    const platformFeeAmt = +ethers.utils.formatUnits(
      platformFeeAmtGwei,
      currency.decimals
    );
    const totalAmt = listing.term.amount + platformFeeAmt;
    return {
      amountGwei,
      platformFeeAmtGwei,
      platformFeeAmt,
      minRequiredBalanceGwei,
      totalAmt,
    };
  }, [platformFees, listing.term, currency?.decimals]);

  // click accept term button
  const handleAcceptTerms = useCallback(async () => {
    if (!allowance || allowance.lt(minRequiredBalanceGwei)) {
      console.warn("Insufficient allowance. Trigger request");
      return;
    }
    if (!provider || !user.address || !listing) {
      console.warn("missing critical data");
      return;
    }
    const createLoanRequest: Loan = {
      lender: user,
      borrower: listing.asset.owner,
      assetListing: {
        ...listing,
        status: ListingStatus.Completed,
        asset: { ...listing.asset, status: AssetStatus.Locked },
      },
      lendingContractAddress: getLendingAddressConfig(desiredNetworkId).currentVersion,
      term: listing.term,
      status: LoanStatus.Active,
    };

    const createLoanParams = {
      loan: createLoanRequest,
      provider,
      networkId: desiredNetworkId,
    };
    let createLoanResult: any;
    try {
      createLoanResult = await createLoan(createLoanRequest);
      if (!createLoanResult || (createLoanResult && createLoanResult?.error)) {
        if (createLoanResult?.error?.status === 403) {
          dispatch(
            addAlert({
              message:
                "Failed to create a loan because your signature is expired or invalid.",
              severity: "error",
            })
          );
        } else {
          dispatch(
            addAlert({
              message: createLoanResult?.error?.data.message,
              severity: "error",
            })
          );
        }
        return;
      }
      const createLoanContractResult = await dispatch(
        contractCreateLoan(createLoanParams)
      ).unwrap();

      if (!createLoanContractResult) {
        resetCreateLoan();
        resetPartialLoan(createLoanResult?.data?.id || "");
        return; //todo: throw nice error
      }
      createLoanRequest.contractLoanId = createLoanContractResult;
      createLoanRequest.id = createLoanResult?.data?.id;
      await updateLoan(createLoanRequest).unwrap();
      resetUpdateLoan();
      dispatch(
        addAlert({
          message:
            "Loan Created. NFT Has been transferred to escrow, and funds transferred to borrower.",
        })
      );
      handleClose();
    } catch (e) {
      console.log(e);
      if (createLoanResult?.data) {
        resetPartialLoan(createLoanResult?.data?.id || "");
      }
      return;
    }
  }, [listing, provider, listing.asset, allowance, user.address, platformFees]);

  // request allowance necessary to complete txn
  const handleRequestAllowance = useCallback(() => {
    if (
      provider &&
      currency &&
      user.address &&
      typeof minRequiredBalanceGwei !== "undefined"
    ) {
      let approveAmounts;
      if (
        currency.currentAddress === networks[desiredNetworkId].addresses["USDT_ADDRESS"]
      ) {
        approveAmounts = ethers.constants.MaxUint256;
      } else {
        approveAmounts = minRequiredBalanceGwei;
      }

      dispatch(
        requestErc20Allowance({
          networkId: desiredNetworkId,
          provider,
          walletAddress: user.address,
          assetAddress: listing.term.currencyAddress,
          amount: approveAmounts,
        })
      );
    }
  }, [currency, provider, user.address, minRequiredBalanceGwei]);

  // check to see if we have an approval for the amount required for this txn
  useEffect(() => {
    if (user.address && provider) {
      dispatch(
        checkErc20Allowance({
          networkId: desiredNetworkId,
          provider,
          walletAddress: user.address,
          assetAddress: listing.term.currencyAddress,
        })
      );
    }
  }, [user.address, provider]);

  const hasAllowance: boolean = useMemo(() => {
    if (!currency || typeof minRequiredBalanceGwei === "undefined") return false;
    if (
      currency &&
      typeof minRequiredBalanceGwei !== "undefined" &&
      checkErc20AllowanceStatus === "idle" &&
      requestErc20AllowanceStatus === "idle" &&
      !!allowance &&
      allowance.gte(minRequiredBalanceGwei)
    )
      return true;
    return false;
  }, [
    currency,
    checkErc20AllowanceStatus,
    requestErc20AllowanceStatus,
    allowance,
    minRequiredBalanceGwei,
  ]);

  const isPending = useMemo(() => {
    if (
      isCreating ||
      isUpdating ||
      checkErc20AllowanceStatus === BackendLoadingStatus.loading ||
      requestErc20AllowanceStatus === BackendLoadingStatus.loading ||
      loanCreationStatus === BackendLoadingStatus.loading
    )
      return true;
    return false;
  }, [
    isCreating,
    isUpdating,
    checkErc20AllowanceStatus,
    requestErc20AllowanceStatus,
    loanCreationStatus,
  ]);

  const currencyBalance = useSelector((state: RootState) =>
    selectErc20BalanceByAddress(state, currency?.currentAddress)
  );

  useEffect(() => {
    if (!user.address || !currency) return;
    dispatch(
      loadErc20Balance({
        networkId: desiredNetworkId,
        address: user.address,
        currencyAddress: currency.currentAddress,
      })
    );
  }, [user.address, currency]);

  const handleClickLend = () => {
    setOpen(true);
  };

  const hasEnoughBalance =
    !isPending &&
    currencyBalance &&
    amountGwei &&
    platformFeeAmtGwei &&
    currencyBalance.gte(amountGwei.add(platformFeeAmtGwei));

  const notEnoughBalance =
    !isPending &&
    currencyBalance &&
    amountGwei &&
    platformFeeAmtGwei &&
    currencyBalance.lt(amountGwei.add(platformFeeAmtGwei));
  return (
    <>
      <Button
        variant="contained"
        sx={{ backgroundColor: "#374FFF" }}
        onClick={handleClickLend}
      >
        Lend {currency?.symbol}
      </Button>
      <Dialog
        onClose={handleClose}
        open={open}
        fullScreen={isSmall}
        className={style["dialogContainer"]}
      >
        <Box className="flex fr fj-c">
          <h1 style={{ margin: "0 0 0.5em 0" }}>Loan Details</h1>
        </Box>
        <Box
          className={`flex fr fj-fe ${style["header"]}`}
          sx={{ position: "absolute", right: "16px" }}
        >
          <IconButton onClick={handleClose}>
            <CancelOutlinedIcon />
          </IconButton>
        </Box>
        <Box className="flex fc">
          <Paper>
            <Box className="flex fc fj-sb">
              <Box className="flex fc" sx={{ mr: "1em" }}>
                <span className="strong" style={{ fontSize: "0.875em", color: "#aaa" }}>
                  You are about to lend
                </span>
                <Box className="flex fr fj-sb ai-c">
                  <span className="flex fr ai-c">
                    <img
                      src={currency?.icon}
                      alt={currency?.name}
                      style={{
                        height: "20px",
                        width: "20px",
                        marginRight: "0.25em",
                        marginBottom: "2px",
                      }}
                    />
                    {formatCurrency(listing.term.amount, 4).replace("$", "")}{" "}
                    {currency?.symbol}{" "}
                    <span className="subtle" style={{ marginLeft: "1em" }}>
                      (to borrower)
                    </span>
                  </span>
                  <span className="subtle">
                    ~{formatCurrency(listing.term.amount * currency?.lastPrice, 2)}
                  </span>
                </Box>
                <Box className="flex fr fj-sb ai-c">
                  <span className="flex fr ai-c">
                    <img
                      src={currency?.icon}
                      alt={currency?.name}
                      style={{
                        height: "20px",
                        width: "20px",
                        marginRight: "0.25em",
                        marginBottom: "2px",
                      }}
                    />
                    {formatCurrency(platformFeeAmt, 4).replace("$", "")}{" "}
                    {currency?.symbol}{" "}
                    <span className="subtle" style={{ marginLeft: "1em" }}>
                      (platform fee)
                    </span>
                  </span>
                  <span className="subtle">~{formatCurrency(platformFeeAmt, 2)}</span>
                </Box>
                <span
                  className="strong"
                  style={{ marginTop: "1em", fontSize: "0.875em", color: "#aaa" }}
                >
                  Total
                </span>
                <Box className="flex fr fj-sb ai-c">
                  <span className="flex fr ai-c">
                    <img
                      src={currency?.icon}
                      alt={currency?.name}
                      style={{
                        height: "20px",
                        width: "20px",
                        marginRight: "0.25em",
                        marginBottom: "2px",
                      }}
                    />
                    {formatCurrency(totalAmt, 4).replace("$", "")} {currency?.symbol}
                  </span>
                  <span className="subtle">
                    ~{formatCurrency(totalAmt * currency?.lastPrice)}
                  </span>
                </Box>
                <Box
                  className="flex fc"
                  sx={{ borderTop: "1px solid lightgrey", mt: "1em", pt: "1em" }}
                >
                  <span className="strong" style={{ fontSize: "0.875em", color: "#aaa" }}>
                    My wallet balance
                  </span>
                  <span className="flex fr ai-c">
                    <img
                      src={currency?.icon}
                      alt={currency?.name}
                      style={{
                        height: "20px",
                        width: "20px",
                        marginRight: "0.25em",
                        marginBottom: "2px",
                      }}
                    />
                    {currencyBalance &&
                      ethers.utils.formatUnits(currencyBalance, currency.decimals)}{" "}
                    {currency?.symbol || ""}
                  </span>
                </Box>
              </Box>
            </Box>
          </Paper>
          <Paper sx={{ my: "1em" }}>
            <Box className="flex fc" sx={{ mr: "1em" }}>
              <span className="strong" style={{ fontSize: "0.875em", color: "#aaa" }}>
                You will receive repayment of
              </span>
              <Box className="flex fr fj-sb ai-c">
                <span className="flex fr ai-c">
                  <img
                    src={currency?.icon}
                    alt={currency?.name}
                    style={{
                      height: "20px",
                      width: "20px",
                      marginRight: "0.25em",
                      marginBottom: "2px",
                    }}
                  />
                  {formatCurrency(repaymentTotal, 4).replace("$", "")}{" "}
                  {currency?.symbol || ""}
                </span>
                <span className="subtle">
                  ~{formatCurrency(repaymentTotal * currency?.lastPrice || 0, 2)}
                </span>
              </Box>
            </Box>
          </Paper>

          <Paper>
            <span className="strong" style={{ color: "#aaa" }}>
              If the loan is not repaid by
              <strong className={style["repayDate"]}>
                {` ${formatDateTimeString(estRepaymentDate)} `}
              </strong>
              you are entitled to:
            </span>
            <Box className="flex fc" sx={{ mt: "1em" }}>
              <Box className="flex fr ai-c">
                <Link
                  className="flex fr ai-c"
                  style={{ color: "#374FFF" }}
                  to={`/asset/${listing.asset.assetContractAddress}/${listing.asset.tokenId}`}
                >
                  <Avatar src={listing.asset.imageUrl || ""} sx={{ mr: "1em" }} />
                  <Box className="flex fc">
                    <span>{listing.asset.name}</span>
                    <span>
                      {!isCollectionLoading &&
                        collections &&
                        !!collections[0] &&
                        collections[0].name}
                    </span>
                  </Box>
                </Link>
              </Box>
            </Box>
          </Paper>
        </Box>
        <Box className="flex fr fj-c" sx={{ pt: "2em", pb: "1em" }}>
          {!hasAllowance && hasEnoughBalance && (
            <Button variant="outlined" onClick={handleRequestAllowance}>
              Allow Liqd access to your {currency?.symbol || ""}
            </Button>
          )}
          {hasAllowance && hasEnoughBalance && (
            <Button variant="contained" onClick={handleAcceptTerms}>
              Lend {currency?.symbol}
            </Button>
          )}
          {notEnoughBalance && (
            <Button variant="contained" disabled={true}>
              Insufficient funds
            </Button>
          )}
          {isPending && (
            <Button>
              <CircularProgress />
            </Button>
          )}
        </Box>
        <Box
          className="flex fr fj-c"
          onClick={() => {
            if (!isPending) {
              handleClose();
            }
          }}
          sx={{ cursor: "pointer" }}
        >
          <span className="subtle">Nevermind</span>
        </Box>
      </Dialog>
    </>
  );
};

export default LoanConfirmation;
