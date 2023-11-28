import { Box, Icon } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import style from "./status-info.module.scss";
import { Asset, Listing, Loan } from "../../../types/backend-types";
import { useTermDetails } from "../../../hooks/use-term-details";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrencyByAddress } from "../../../store/selectors/currency-selectors";
import { AppDispatch, RootState } from "../../../store";
import { loadCurrencyFromAddress } from "../../../store/reducers/currency-slice";
import {
  getLoanDetailsFromContract,
  LoanDetails,
} from "../../../store/reducers/loan-slice";
import { desiredNetworkId } from "../../../constants/network";
import { formatCurrency } from "@fantohm/shared-helpers";
import { prettifySeconds, useWeb3Context } from "@fantohm/shared-web3";
import { formatDateTimeString } from "@fantohm/shared-helpers";

export interface StatusInfoProps {
  asset: Asset;
  listing?: Listing;
  loan?: Loan;
}

const BorrowerNotListed = ({ asset }: { asset: Asset }): JSX.Element => {
  return (
    <Box className={style["mainContainer"]}>
      <Icon>
        <InfoOutlinedIcon />
      </Icon>
      <Box className={style["textContainer"]}>
        <span className={style["strong"]}>{asset.name}</span>
        <span> is currently </span>
        <span className={style["strong"]}>unlisted</span>
        <span> and is </span>
        <span className={style["strong"]}>available</span>
        <span> to be used as collateral to </span>
        <span className={style["strong"]}>receive a loan</span>
      </Box>
    </Box>
  );
};

const BorrowerOnlyListed = ({
  asset,
  listing,
}: {
  asset: Asset;
  listing: Listing;
}): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const currency = useSelector((state: RootState) =>
    selectCurrencyByAddress(state, listing.term.currencyAddress)
  );
  useEffect(() => {
    dispatch(loadCurrencyFromAddress(listing.term.currencyAddress));
  }, []);
  return (
    <Box className={style["mainContainer"]}>
      <Icon>
        <InfoOutlinedIcon />
      </Icon>
      <Box className={style["textContainer"]}>
        <span className={style["strong"]}>{asset.name}</span>
        <span> is currently listed seeking a loan amount of </span>
        <span className={style["strong"]}>
          {formatCurrency(
            listing.term.amount,
            Number(currency?.lastPrice) < 1.1 ? 2 : 5
          ).replaceAll("$", "")}{" "}
          {currency?.symbol}
        </span>
        <span> at a </span>
        <span className={style["strong"]}>{listing.term.apr}% APR</span>
        <span> over </span>
        <span className={style["strong"]}>
          {prettifySeconds(listing.term.duration * 86400, "day")}
        </span>
      </Box>
    </Box>
  );
};

const BorrowerListedLoan = ({
  asset,
  loan,
  endTime,
}: {
  asset: Asset;
  loan: Loan;
  endTime: Date;
}): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const { repaymentTotal } = useTermDetails(loan.term);
  const currency = useSelector((state: RootState) =>
    selectCurrencyByAddress(state, loan.term.currencyAddress)
  );
  useEffect(() => {
    dispatch(loadCurrencyFromAddress(loan.term.currencyAddress));
  }, []);
  return (
    <Box className={style["mainContainer"]}>
      <Icon>
        <InfoOutlinedIcon />
      </Icon>
      <Box className={style["textContainer"]}>
        <span className={style["strong"]}>{asset.name}</span>
        <span>
          &nbsp; is currently being held in escrow and will be released to its owner if a
          repayment amount of{" "}
        </span>
        <span className={style["strong"]}>
          {formatCurrency(
            repaymentTotal,
            (Number(currency?.lastPrice) || 1) < 1.1 ? 2 : 5
          ).replaceAll("$", "")}{" "}
          {currency?.symbol}
        </span>
        <span> is made before </span>
        <span className={style["strong"]}>{formatDateTimeString(endTime)}</span>
      </Box>
    </Box>
  );
};

const LenderListedLoanDefaulted = ({ asset }: { asset: Asset }): JSX.Element => {
  return (
    <Box className={style["mainContainer"]}>
      <Icon>
        <InfoOutlinedIcon />
      </Icon>
      <Box className={style["textContainer"]}>
        <span>The borrower has </span>
        <span className={style["strong"]}>defaulted</span>
        <span> on this loan, </span>
        <span className={style["strong"]}>{asset.name}</span>
        <span> can now be claimed by the lender as </span>
        <span className={style["strong"]}>collateral.</span>
      </Box>
    </Box>
  );
};

export const StatusInfo = ({ asset, listing, loan }: StatusInfoProps): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const { provider, chainId } = useWeb3Context();
  const [loanDetails, setLoanDetails] = useState<LoanDetails>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    if (
      !loan ||
      loan.contractLoanId == null ||
      !provider ||
      !(desiredNetworkId === chainId)
    ) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    dispatch(
      getLoanDetailsFromContract({
        loan,
        networkId: desiredNetworkId,
        provider,
      })
    )
      .unwrap()
      .then((loanDetails: LoanDetails) => {
        setLoanDetails(loanDetails);
        setIsLoading(false);
      });
  }, [loan, chainId]);

  if (listing) {
    return <BorrowerOnlyListed asset={asset} listing={listing} />;
  }

  if (!loan && !listing) {
    return <BorrowerNotListed asset={asset} />;
  }

  if (isLoading) {
    return <></>;
  }

  if (loanDetails) {
    if (loanDetails.endDateTime.getTime() <= new Date().getTime()) {
      return <LenderListedLoanDefaulted asset={asset} />;
    }
  }

  if (loan && loanDetails) {
    return (
      <BorrowerListedLoan asset={asset} loan={loan} endTime={loanDetails.endDateTime} />
    );
  }

  return <BorrowerNotListed asset={asset} />;
};

export default StatusInfo;
