import { useEffect, useState } from "react";
import { Terms } from "../types/backend-types";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { selectCurrencyByAddress } from "../store/selectors/currency-selectors";
import { Erc20Currency } from "../helpers/erc20Currency";

export type TermDetails = {
  repaymentAmount: number;
  repaymentTotal: number;
  amount: number;
  apr: number;
  duration: number;
  estRepaymentDate: Date;
  currencyPrice?: number;
  currency: Erc20Currency;
};

export const useTermDetails = (term: Terms | undefined): TermDetails => {
  const [repaymentAmount, setRepaymentAmount] = useState(0);
  const [repaymentTotal, setRepaymentTotal] = useState(0);
  const [estRepaymentDate, setEstRepaymentDate] = useState<Date>(new Date());
  const [amount, setAmount] = useState(0);
  const [apr, setApr] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currencyPrice, setCurrencyPrice] = useState(0);
  const currency = useSelector((state: RootState) =>
    selectCurrencyByAddress(state, term?.currencyAddress || "")
  );

  // calculate repayment totals
  useEffect(() => {
    if (amount && duration && apr) {
      const wholePercent = (duration / 365) * apr;
      const realPercent = wholePercent / 100;
      const _repaymentAmount = amount * realPercent;
      setCurrencyPrice(currency?.lastPrice || 1);
      setRepaymentAmount(_repaymentAmount);
      setRepaymentTotal(_repaymentAmount + amount);
      setEstRepaymentDate(new Date(Date.now() + duration * 86400 * 1000));
    }
  }, [amount, duration, apr]);

  // handle internal updates
  // only update value if the term have changed
  useEffect(() => {
    if (term) {
      if (term.amount && term.amount !== amount) {
        setAmount(term.amount);
      }
      if (term.apr && term.apr !== apr) {
        setApr(term.apr);
      }
      if (term.duration && term.duration !== duration) {
        setDuration(term.duration);
      }
    } else {
      setRepaymentAmount(0);
      setRepaymentTotal(0);
      setCurrencyPrice(1);
      setEstRepaymentDate(new Date(Date.now() + duration * 86400 * 1000));
    }
  }, [JSON.stringify(term)]);

  return {
    repaymentAmount,
    repaymentTotal,
    amount,
    apr,
    duration,
    estRepaymentDate,
    currencyPrice,
    currency,
  };
};
