import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import {
  erc165Abi,
  ercType,
  getLendingAddressConfig,
  isDev,
  loadState,
  TokenType,
  usdbLending,
} from "@fantohm/shared-web3";
import { BackendLoadingStatus, Loan } from "../../types/backend-types";
import {
  ListingCancelAsyncThunk,
  LoanAsyncThunk,
  LoanDetailsAsyncThunk,
  RepayLoanAsyncThunk,
} from "./interfaces";
import { RootState } from "..";
import { BigNumber, ContractReceipt, ContractTransaction, ethers, Event } from "ethers";
import {
  getErc20CurrencyFromAddress,
  getSymbolFromAddress,
} from "../../helpers/erc20Currency";
import { addAlert } from "./app-slice";

export type CreateLoanEvent = {
  event: string;
  args: {
    borrower: string;
    lender: string;
    loanId: string;
    nftAddress: string;
    nftTokenId: string;
  };
};

export type RepayLoanEvent = {
  event: string;
  args: {
    lender: string;
    borrower: string;
    nftAddress: string;
    nftTokenId: string;
    loanId: BigNumber;
  };
};

export type Loans = {
  [loanId: string]: Loan;
};

export type LoanLoadStatus = {
  [key: string]: BackendLoadingStatus;
};

export interface LoansState {
  readonly loans: Loans;
  readonly isDev: boolean;
  readonly loanCreationStatus: BackendLoadingStatus;
  readonly loanReadStatus: BackendLoadingStatus;
  readonly repayLoanStatus: BackendLoadingStatus;
  readonly forecloseLoanStatus: BackendLoadingStatus;
}

export type LoanDetailsResponse = {
  nftAddress: string;
  borrower: string;
  lender: string;
  currency: string;
  status: number;
  nftTokenId: BigNumber;
  startTime: BigNumber;
  endTime: BigNumber;
  loanAmount: BigNumber;
  amountDue: BigNumber;
  nftTokenType: number;
};

export type LoanDetails = {
  nftAddress: string;
  borrower: string;
  lender: string;
  currency: string;
  status: LoanDetailsStatus;
  nftTokenId: number;
  startTime: number;
  endTime: number;
  endDateTime: Date;
  loanAmount: number;
  amountDue: number;
  amountDueGwei: BigNumber;
  nftTokenType: TokenType;
  loanId: number;
  contractLoanId?: number;
  lendingContractAddress?: string;
};

export enum LoanDetailsStatus {
  CREATED,
  REPAID,
  LIQUIDATED,
}

/*
createLoan: add loan to contract
params:
- networkId: number
- address: string
- provider: JsonRpcProvider
returns: void
*/
export const contractCreateLoan = createAsyncThunk(
  "loan/contractCreateLoan",
  async ({ loan, provider, networkId }: LoanAsyncThunk, { getState, dispatch }) => {
    const state: RootState = getState() as RootState;
    const currency =
      state.currency.currencies[getSymbolFromAddress(loan.term.currencyAddress)] ||
      getErc20CurrencyFromAddress(loan.term.currencyAddress);

    const signer = provider.getSigner();

    const nftContract = new ethers.Contract(
      loan.assetListing.asset.assetContractAddress,
      erc165Abi
    );

    const contractType = await ercType(nftContract);

    const lendingContract = new ethers.Contract(
      getLendingAddressConfig(networkId).currentVersion,
      usdbLending,
      signer
    );

    // put the params in an object to make it very clear in contract call
    const params = {
      borrower: loan.borrower.address,
      lender: loan.lender.address,
      nftAddress: loan.assetListing.asset.assetContractAddress,
      currencyAddress: loan.term.currencyAddress,
      nftTokenId: loan.assetListing.asset.tokenId,
      duration: loan.term.duration,
      expiration: Math.round(Date.parse(loan.term.expirationAt) / 1000),
      loanAmount: ethers.utils.parseUnits(loan.term.amount.toString(), currency.decimals),
      apr: loan.term.apr * 100,
      nftTokenType: contractType || 0, // token type
      sig: loan.term.signature,
    };

    try {
      // call the contract
      const approveTx: ContractTransaction = await lendingContract["createLoan"](
        {
          lender: params.lender,
          borrower: params.borrower,
          nftAddress: params.nftAddress,
          currency: params.currencyAddress,
          nftTokenId: params.nftTokenId,
          duration: params.duration,
          expiration: params.expiration,
          loanAmount: params.loanAmount,
          apr: params.apr,
          nftTokenType: params.nftTokenType,
        },
        params.sig
      );
      const response: ContractReceipt = await approveTx.wait();
      const event: Event | undefined = response.events?.find(
        (event: CreateLoanEvent | Event) => !!event.event && event.event === "LoanCreated"
      );
      if (event && event.args) {
        const [, , , , currentId] = event.args;
        // update loan record with Id
        return +currentId;
      } else {
        return false;
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
          dispatch(addAlert({ message: `Unknown error: ${message}`, severity: "error" }));
        }
      } else {
        dispatch(
          addAlert({ message: `Unknown error: ${e.error.message}`, severity: "error" })
        );
      }
      return false;
    }
  }
);

/*
repayLoan: add loan to contract
params:
- loanId: number;
- amountDue: number;
- provider: JsonRpcProvider;
- networkId: number;
returns: number | boolean
*/
export const repayLoan = createAsyncThunk(
  "loan/repayLoan",
  async ({ loan, amountDue, provider, networkId }: RepayLoanAsyncThunk) => {
    const signer = provider.getSigner();

    const lendingContract = new ethers.Contract(
      loan?.lendingContractAddress
        ? loan?.lendingContractAddress
        : getLendingAddressConfig(networkId).currentVersion,
      usdbLending,
      signer
    );
    const repayTxn: ContractTransaction = await lendingContract["repayLoan"](
      loan.contractLoanId,
      amountDue
    );
    try {
      const response: ContractReceipt = await repayTxn.wait();
      const event: Event | undefined = response.events?.find(
        (event: RepayLoanEvent | Event) =>
          !!event.event && event.event === "LoanLiquidated"
      );
      if (event && event.args) {
        const [, , , , loanId] = event.args;
        return +loanId;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }
);

/*
forecloseLoan: add loan to contract
params:
- loanId: number;
- provider: JsonRpcProvider;
- networkId: number;
returns: number | boolean
*/
export const forceCloseLoan = createAsyncThunk(
  "loan/forecloseLoan",
  async ({ loan, provider, networkId }: LoanDetailsAsyncThunk) => {
    const signer = provider.getSigner();
    const lendingContract = new ethers.Contract(
      loan?.lendingContractAddress
        ? loan?.lendingContractAddress
        : getLendingAddressConfig(networkId).currentVersion,
      usdbLending,
      signer
    );
    const liquidateTxn: ContractTransaction = await lendingContract["liquidateLoan"](
      loan.contractLoanId
    );
    try {
      const response: ContractReceipt = await liquidateTxn.wait();
      const event: Event | undefined = response.events?.find(
        (event: RepayLoanEvent | Event) =>
          !!event.event && event.event === "LoanTerminated"
      );
      if (event && event.args) {
        const [, , , , loanId] = event.args;
        return +loanId;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }
);

/*
listingCancel: add cancelled listing signature
params:
- sig: bytes string;
- provider: JsonRpcProvider;
- networkId: number;
returns: number | boolean
*/
export const listingCancel = createAsyncThunk(
  "loan/listingCancel",
  async ({ sig, provider, networkId }: ListingCancelAsyncThunk) => {
    const signer = provider.getSigner();
    const lendingContract = new ethers.Contract(
      getLendingAddressConfig(networkId).currentVersion,
      usdbLending,
      signer
    );
    const liquidateTxn: ContractTransaction = await lendingContract[
      "setCancelledSignature"
    ](sig);
    try {
      return await liquidateTxn.wait();
    } catch (e) {
      return null;
    }
  }
);

/*
getLoanDetailsFromContract: add loan to contract
params:
- loanId: number
- address: string
- provider: JsonRpcProvider
returns: void
*/
export const getLoanDetailsFromContract = createAsyncThunk(
  "loan/getLoanDetailsFromContract",
  async ({ loan, networkId, provider }: LoanDetailsAsyncThunk) => {
    const lendingContract = new ethers.Contract(
      loan?.lendingContractAddress
        ? loan?.lendingContractAddress
        : getLendingAddressConfig(networkId).currentVersion,
      usdbLending,
      provider
    );
    // call the contract
    const loanDetails: LoanDetailsResponse = await lendingContract["loans"](
      loan.contractLoanId
    );
    const erc20 = getErc20CurrencyFromAddress(loanDetails.currency);

    return {
      nftAddress: loanDetails.nftAddress,
      borrower: loanDetails.borrower,
      lender: loanDetails.lender,
      currency: loanDetails.currency,
      status: loanDetails.status,
      nftTokenId: +loanDetails.nftTokenId,
      startTime: +loanDetails.startTime,
      endTime: loanDetails.endTime.toNumber(),
      endDateTime: new Date(+loanDetails.endTime * 1000),
      loanAmount: +ethers.utils.formatUnits(loanDetails.loanAmount, erc20.decimals),
      amountDue: +ethers.utils.formatUnits(loanDetails.amountDue, erc20.decimals),
      amountDueGwei: loanDetails.amountDue,
      nftTokenType: loanDetails.nftTokenType,
      loanId: loan.contractLoanId,
      lendingContractAddress: lendingContract.address,
    } as LoanDetails;
  }
);

// initial wallet slice state
const previousState = loadState("loans");
const initialState: LoansState = {
  loans: [],
  ...previousState, // overwrite assets and currencies from cache if recent
  isDev: isDev,
  loanCreationStatus: BackendLoadingStatus.idle,
  loanReadStatus: BackendLoadingStatus.idle,
  repayLoanStatus: BackendLoadingStatus.idle,
  forecloseLoanStatus: BackendLoadingStatus.idle,
};

// create slice and initialize reducers
const loansSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(contractCreateLoan.pending, (state, action) => {
      state.loanCreationStatus = BackendLoadingStatus.loading;
    });
    builder.addCase(contractCreateLoan.fulfilled, (state, action) => {
      state.loanCreationStatus = BackendLoadingStatus.succeeded;
      // dispatch update loan status
    });
    builder.addCase(contractCreateLoan.rejected, (state, action) => {
      state.loanCreationStatus = BackendLoadingStatus.failed;
    });
    builder.addCase(getLoanDetailsFromContract.pending, (state, action) => {
      state.loanReadStatus = BackendLoadingStatus.loading;
    });
    builder.addCase(getLoanDetailsFromContract.fulfilled, (state, action) => {
      state.loanReadStatus = BackendLoadingStatus.succeeded;
      // dispatch update loan status
    });
    builder.addCase(getLoanDetailsFromContract.rejected, (state, action) => {
      state.loanReadStatus = BackendLoadingStatus.failed;
    });
    builder.addCase(repayLoan.pending, (state, action) => {
      state.repayLoanStatus = BackendLoadingStatus.loading;
    });
    builder.addCase(repayLoan.fulfilled, (state, action) => {
      state.repayLoanStatus = BackendLoadingStatus.succeeded;
      // dispatch update loan status
    });
    builder.addCase(repayLoan.rejected, (state, action) => {
      state.repayLoanStatus = BackendLoadingStatus.failed;
    });
    builder.addCase(forceCloseLoan.pending, (state, action) => {
      state.forecloseLoanStatus = BackendLoadingStatus.loading;
    });
    builder.addCase(forceCloseLoan.fulfilled, (state, action) => {
      state.forecloseLoanStatus = BackendLoadingStatus.succeeded;
      // dispatch update loan status
    });
    builder.addCase(forceCloseLoan.rejected, (state, action) => {
      state.forecloseLoanStatus = BackendLoadingStatus.failed;
    });
  },
});

export const loansReducer = loansSlice.reducer;
// actions are automagically generated and exported by the builder/thunk
//export const { } = listingsSlice.actions;

const baseInfo = (state: RootState) => state.loans;
export const getLoansState = createSelector(baseInfo, (loans) => loans);
