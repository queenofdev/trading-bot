import { Box } from "@mui/material";

/* eslint-disable-next-line */
export interface HelpProps {}

export const HelpPage = (props: HelpProps): JSX.Element => {
  return (
    <Box sx={{ width: "100%", padding: "0 20px", mt: { xs: "50px", md: "100px" } }}>
      <h1>Help</h1>
      <Box>
        <h2>How do I use Liqd to get liquidity?</h2>
        <div>FIXME</div>
        <h2>How do I use Liqd to earn Interest on my crypto?</h2>
        <div>FIXME</div>
        <h2>Where does the NFT go?/ What happens to the NFT?</h2>
        <div>
          The NFT goes into escrow in our smart contract. Once in escrow, this NFT can
          only be released on two conditions:
          <ol>
            <li>
              The entire loan amount plus interest <strong>IS</strong> repaid before the
              predetermined loan period has lapsed. In this case, the NFT will be
              transferred back to the borrower's wallet.
            </li>
            <li>
              The entire loan amount plus interest <strong>IS NOT</strong> repaid before
              the predetermined loan period has lapsed. In this case, the NFT is
              transferred to the lender's wallet.
            </li>
          </ol>
          This smart contract has been audited by Hacken with a 10/10 score for security.
          (FIXME link audit)
        </div>
        <h2>What happens if the loan is not repaid?</h2>
        <div>
          If the loan is not repaid, the NFT used as collateral is transferred to the
          lender's wallet (the person who provided the liquidity).
        </div>
        <h2>How do you prevent Fake series?</h2>
        <div>
          Only verified collections on Opensea and collections which Liqd has manually
          approved can be used as collateral for the loan.
        </div>
        <h2>What if you only repay a portion of the loan?</h2>
        <div>
          This is not possible.The loan plus the interest incurred are to be repaid in one
          transaction. Users can either repay in full or they can't repay at all.
        </div>
        <h2>Is there a limit on how much a wallet can borrow at a time?</h2>
        <div>
          In short, no.
          <br />
          <br />
          The limit on the amount a user can borrow is limited to the amount of collateral
          they can put up to borrow liquidity. The more collateral, in this case, NFTs,
          the more you can borrow.
        </div>
        <h2>What is the frequency of the payouts to lenders?</h2>
        <div>
          There is only one payout. The repayment to the lender is only made at the point
          in time that the loan plus interest incurred is repaid in full.
        </div>
        <h2>Can borrowers list any NFTs on the Liqdnft platform?</h2>
        <div>
          In short, no.
          <br />
          <br />
          Only verified collections on Opensea and collections which Liqd has manually
          approved can be used as collateral for loans.
        </div>
      </Box>
    </Box>
  );
};

export default HelpPage;
