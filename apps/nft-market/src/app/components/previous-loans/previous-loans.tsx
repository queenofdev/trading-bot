import { useEffect, useState } from "react";
import {
  addressEllipsis,
  formatCurrency,
  formatDateTimeString,
} from "@fantohm/shared-helpers";
import {
  PaperTable,
  PaperTableCell,
  PaperTableHead,
  PaperTableRow,
} from "@fantohm/shared-ui-themes";
import {
  Box,
  CircularProgress,
  SxProps,
  TableBody,
  TableContainer,
  TableRow,
  Theme,
} from "@mui/material";
import { chains, prettifySeconds } from "@fantohm/shared-web3";
import { useDispatch, useSelector } from "react-redux";
import { useGetLoansQuery } from "../../api/backend-api";
import store, { RootState } from "../../store";
import { Asset, Loan, LoanStatus } from "../../types/backend-types";
import { Erc20Currency } from "../../helpers/erc20Currency";
import { selectCurrencies } from "../../store/selectors/currency-selectors";
import { getLoanDetailsFromContract } from "../../store/reducers/loan-slice";
import { desiredNetworkId } from "../../constants/network";
import { LoanDetailsAsyncThunk } from "../../store/reducers/interfaces";

type AppDispatch = typeof store.dispatch;

export interface PreviousLoansProps {
  asset: Asset;
  sx?: SxProps<Theme>;
}

export const PreviousLoans = ({ asset, sx }: PreviousLoansProps): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const [loans, setLoans] = useState<Loan[]>([]);
  const { data: completeLoans, isLoading: isCompleteLoansLoading } = useGetLoansQuery(
    {
      take: 50,
      skip: 0,
      contractAddress: asset.assetContractAddress,
      tokenId: asset.tokenId,
      status: LoanStatus.Complete,
    },
    { skip: !asset }
  );

  const { data: defaultedLoans, isLoading: isDefaultedLoading } = useGetLoansQuery(
    {
      take: 50,
      skip: 0,
      contractAddress: asset.assetContractAddress,
      tokenId: asset.tokenId,
      status: LoanStatus.Default,
    },
    { skip: !asset }
  );

  const currencies = useSelector((state: RootState) => selectCurrencies(state));

  useEffect(() => {
    let active = true;
    loadLoans().then();
    return () => {
      active = false;
    };

    async function loadLoans() {
      if (!active) {
        setLoans([]);
        return;
      }
      if (!currencies) {
        setLoans([]);
        return;
      }
      if (isDefaultedLoading || isCompleteLoansLoading) {
        setLoans([]);
        return;
      }
      if (typeof defaultedLoans === "undefined" || typeof completeLoans === "undefined") {
        setLoans([]);
        return;
      }
      const allLoans = [...completeLoans, ...defaultedLoans];
      const coveredLoans = await Promise.all(
        allLoans.map(async (loan) => {
          const match: [string, Erc20Currency] | undefined = Object.entries(
            currencies
          ).find(
            ([, entryCurrency]) =>
              entryCurrency.currentAddress.toLowerCase() ===
              loan.term.currencyAddress.toLowerCase()
          );
          const staticProvider = await chains[desiredNetworkId].provider;
          const loanDetail = await dispatch(
            getLoanDetailsFromContract({
              loan,
              networkId: desiredNetworkId,
              provider: staticProvider,
            } as LoanDetailsAsyncThunk)
          ).unwrap();
          const currencyPrice = match ? match[1]?.lastPrice : 1;
          return {
            ...loan,
            currencyPrice,
            amountDue: loanDetail?.amountDue,
          };
        })
      );
      setLoans(coveredLoans);
    }
  }, [completeLoans, defaultedLoans, currencies]);

  if (
    !asset ||
    !loans ||
    typeof loans === "undefined" ||
    isCompleteLoansLoading ||
    isDefaultedLoading
  ) {
    return (
      <Box className="flex fr fj-c">
        <CircularProgress />
      </Box>
    );
  }
  if (!isDefaultedLoading && !isCompleteLoansLoading && loans.length < 1) {
    return (
      <Box className="flex fr fj-c">
        <h2>No loan history for this asset</h2>
      </Box>
    );
  }
  return (
    <Box className="flex fc fj-fs" sx={{ mb: "5em", ...sx }}>
      <h2 style={{ marginBottom: "0" }}>Previous Loans</h2>
      <TableContainer sx={{ padding: "10px" }}>
        <PaperTable
          aria-label="Active investments"
          sx={{ minWidth: "700px", borderSpacing: "0" }}
        >
          <PaperTableHead>
            <TableRow>
              <PaperTableCell sx={{ fontSize: "0.875em", color: "#8991A2" }}>
                Lender
              </PaperTableCell>
              <PaperTableCell sx={{ fontSize: "0.875em", color: "#8991A2" }}>
                Borrower
              </PaperTableCell>
              <PaperTableCell sx={{ fontSize: "0.875em", color: "#8991A2" }}>
                Value
              </PaperTableCell>
              <PaperTableCell sx={{ fontSize: "0.875em", color: "#8991A2" }}>
                Repayment
              </PaperTableCell>
              <PaperTableCell sx={{ fontSize: "0.875em", color: "#8991A2" }}>
                APR
              </PaperTableCell>
              <PaperTableCell sx={{ fontSize: "0.875em", color: "#8991A2" }}>
                Start Date
              </PaperTableCell>
              <PaperTableCell sx={{ fontSize: "0.875em", color: "#8991A2" }}>
                Duration
              </PaperTableCell>
              <PaperTableCell sx={{ fontSize: "0.875em", color: "#8991A2" }}>
                Status
              </PaperTableCell>
            </TableRow>
          </PaperTableHead>
          <TableBody>
            {loans
              .sort(
                (a, b) =>
                  new Date(Date.parse(b.createdAt || "yesterday")).getTime() -
                  new Date(Date.parse(a.createdAt || "yesterday")).getTime()
              )
              .map((loan: Loan, index: number) => (
                <PaperTableRow key={`ma-invests-table-${index}`} id={`invests-${index}`}>
                  <PaperTableCell sx={{ fontSize: "0.875em" }}>
                    {addressEllipsis(loan.lender.address || "")}
                  </PaperTableCell>
                  <PaperTableCell sx={{ fontSize: "0.875em" }}>
                    {addressEllipsis(loan.borrower.address || "")}
                  </PaperTableCell>
                  <PaperTableCell sx={{ fontSize: "0.875em" }}>
                    {formatCurrency(loan.term.amount * (loan?.currencyPrice || 1), 2)}
                  </PaperTableCell>
                  <PaperTableCell sx={{ fontSize: "0.875em" }}>
                    {formatCurrency(
                      (loan?.amountDue || 1) * (loan?.currencyPrice || 1),
                      2
                    )}
                  </PaperTableCell>
                  <PaperTableCell sx={{ fontSize: "0.875em" }}>
                    {loan.term.apr}%
                  </PaperTableCell>
                  <PaperTableCell sx={{ fontSize: "0.875em" }}>
                    {formatDateTimeString(
                      new Date(Date.parse(loan.createdAt || "yesterday")),
                      true
                    )}
                  </PaperTableCell>
                  <PaperTableCell sx={{ fontSize: "0.875em" }}>
                    {prettifySeconds(loan.term.duration * 86400, "day")}
                  </PaperTableCell>
                  <PaperTableCell sx={{ fontSize: "0.875em" }}>
                    {loan.status}
                  </PaperTableCell>
                </PaperTableRow>
              ))}
          </TableBody>
        </PaperTable>
      </TableContainer>
    </Box>
  );
};

export default PreviousLoans;
