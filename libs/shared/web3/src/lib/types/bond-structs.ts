export type Terms = {
  vestingTermSeconds: number; // in seconds
  vestingTerm: number; // safeguard, use some vestingTermSeconds/2 in blocks
  discount: number; // discount in in thousandths of a % i.e. 5000 = 5%
  maxPayout: number; // in thousandths of a %. i.e. 500 = 0.5%
  fee: number; // as % of bond payout, in hundreths. ( 500 = 5% = 0.05 for every 1 paid)
  maxDebt: number; // 9 decimal debt ratio, max % total supply created as debt
  soldBondsLimitUsd: number; //
};

export type SoldBonds = {
  timestampFrom: number;
  timestampTo: number;
  payoutInUsd: number;
};
