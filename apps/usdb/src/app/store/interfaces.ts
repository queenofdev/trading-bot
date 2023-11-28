export type BalanceVaultType = {
  vaultAddress: string;
  index: string;
  nftAddress: string;
  ownerInfos: string[];
  ownerContacts: string[];
  ownerWallet: string;
  fundingAmount: string;
  fundraised: string;
  allowedTokens: string[];
  freezeTimestamp: string;
  repaymentTimestamp: string;
  apr: string;
  shouldBeFrozen: boolean;
};
