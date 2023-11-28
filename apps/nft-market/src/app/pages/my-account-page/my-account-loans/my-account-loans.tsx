import { useWeb3Context, useImpersonateAccount } from "@fantohm/shared-web3";
import { Box, Container, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useGetLoansQuery } from "../../../api/backend-api";
import { RootState } from "../../../store";
import { LoanStatus } from "../../../types/backend-types";
import MyAccountActiveLoansTable from "../my-account-active-loans-table";
import style from "./my-account-loans.module.scss";

export function MyAccountLoans() {
  const { address } = useWeb3Context();
  const { impersonateAddress, isImpersonating } = useImpersonateAccount();
  const { authSignature } = useSelector((state: RootState) => state.backend);
  const actualAddress = isImpersonating ? impersonateAddress : address;

  const { data: activeBorrowerLoans } = useGetLoansQuery(
    {
      take: 50,
      skip: 0,
      status: LoanStatus.Active,
      borrowerAddress: actualAddress,
    },
    { skip: !actualAddress || !authSignature }
  );
  const { data: activeLenderLoans } = useGetLoansQuery(
    {
      take: 50,
      skip: 0,
      status: LoanStatus.Active,
      lenderAddress: actualAddress,
    },
    { skip: !actualAddress || !authSignature }
  );
  const { data: historicalBorrowerLoans } = useGetLoansQuery(
    {
      take: 50,
      skip: 0,
      status: LoanStatus.Complete,
      borrowerAddress: actualAddress,
    },
    { skip: !actualAddress || !authSignature }
  );
  const { data: historicalLenderLoans } = useGetLoansQuery(
    {
      take: 50,
      skip: 0,
      status: LoanStatus.Complete,
      lenderAddress: actualAddress,
    },
    { skip: !actualAddress || !authSignature }
  );
  return (
    <Container className={style["myAccountContainer"]} sx={{ mt: "50px" }} maxWidth="xl">
      {activeBorrowerLoans?.length ? (
        <>
          <h2>Active loans as borrower({activeBorrowerLoans?.length})</h2>
          <MyAccountActiveLoansTable loans={activeBorrowerLoans} />
        </>
      ) : null}
      {activeLenderLoans?.length ? (
        <>
          <h2>Active loans as lender({activeLenderLoans?.length})</h2>
          <MyAccountActiveLoansTable loans={activeLenderLoans} />
        </>
      ) : null}
      {historicalBorrowerLoans?.length ? (
        <>
          <h2>Previous loans as borrower({historicalBorrowerLoans?.length})</h2>
          <MyAccountActiveLoansTable loans={historicalBorrowerLoans} />
        </>
      ) : null}
      {historicalLenderLoans?.length ? (
        <>
          <h2>Previous loans as lender({historicalLenderLoans?.length})</h2>
          <MyAccountActiveLoansTable loans={historicalLenderLoans} />
        </>
      ) : null}
      <Box className="flex fc fj-c ai-c">
        <Typography variant="h5" sx={{ mt: "20px", mb: "20px " }}>
          {(activeBorrowerLoans === undefined || activeBorrowerLoans?.length === 0) &&
            (activeLenderLoans === undefined || activeLenderLoans?.length === 0) &&
            (historicalBorrowerLoans === undefined ||
              historicalBorrowerLoans?.length === 0) &&
            (historicalLenderLoans === undefined ||
              historicalLenderLoans?.length === 0) &&
            "You don`t currently have any loans."}
        </Typography>
      </Box>
    </Container>
  );
}

export default MyAccountLoans;
