import { useEffect, useState } from "react";
import { Listing } from "../types/backend-types";

export type ListingTermDetails = {
  repaymentAmount: number;
  repaymentTotal: number;
  amount: number;
  apr: number;
  duration: number;
};

export const useListingTermDetails = (listing: Listing): ListingTermDetails => {
  const [repaymentAmount, setRepaymentAmount] = useState(0);
  const [repaymentTotal, setRepaymentTotal] = useState(0);
  const [amount, setAmount] = useState(0);
  const [apr, setApr] = useState(0);
  const [duration, setDuration] = useState(0);

  // calculate repayment totals
  useEffect(() => {
    if (amount && duration && apr) {
      const wholePercent = (duration / 365) * apr;
      const realPercent = wholePercent / 100;
      const _repaymentAmount = amount * realPercent;
      setRepaymentAmount(_repaymentAmount);
      setRepaymentTotal(_repaymentAmount + amount);
    }
  }, [amount, duration, apr]);

  // handle internal updates
  // only update value if the term have changed
  useEffect(() => {
    if (listing && listing.term) {
      if (listing.term.amount && listing.term.amount !== amount) {
        setAmount(listing.term.amount);
      }
      if (listing.term.apr && listing.term.apr !== apr) {
        setApr(listing.term.apr);
      }
      if (listing.term.duration && listing.term.duration !== duration) {
        setDuration(listing.term.duration);
      }
    }
  }, [listing?.term]);

  return { repaymentAmount, repaymentTotal, amount, apr, duration };
};
