import { getMerkleDistributorAddress, networks } from "@fantohm/shared-web3";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BigNumber, ContractReceipt, ContractTransaction, ethers, Event } from "ethers";
import { BackendApi } from "../../api";
import {
  currencyInfo,
  erc20Currency,
  getErc20CurrencyFromAddress,
} from "../../helpers/erc20Currency";
import { AffiliateData } from "../../types/backend-types";
import { ClaimFeesAsyncThunk } from "./interfaces";
import { RepayLoanEvent } from "./loan-slice";
import { merkleDistributor, ierc721Abi } from "@fantohm/shared-web3";
import { JsonRpcProvider } from "@ethersproject/providers";
export type AffiliateState = {
  data: AffiliateData;
  status: "pending" | "ready" | "failed";
};

const initialState: AffiliateState = {
  data: {
    referralCode: "",
    referredAddresses: [],
  },
  status: "pending",
};
/*
Referral data: 
  referral code
  referredAddresses
  total claimed amount
  claimable token info
params:
- address: string
returns: void
*/
export const getAffiliateAddresses = createAsyncThunk(
  "backend/affiliate",
  async (address: string, { getState, rejectWithValue, dispatch }) => {
    const thisState: any = getState();
    if (thisState.backend.authSignature) {
      const response = await BackendApi.getAffiliateAddresses(
        thisState.backend.authSignature,
        address
      );
      return response;
    } else {
      return rejectWithValue("No authorization found.");
    }
  }
);

export const getAffiliateFees = createAsyncThunk(
  "backend/affiliate-fees",
  async (address: string, { getState, rejectWithValue, dispatch }) => {
    const thisState: any = getState();
    if (thisState.backend.authSignature) {
      const response = await BackendApi.getAffiliateFees(
        thisState.backend.authSignature,
        address
      );
      if (response && response.affiliateFees) {
        const feeData = await Promise.all(
          response.affiliateFees.map(async (fee) => {
            const currentCurrency = getErc20CurrencyFromAddress(fee.currency);
            await currentCurrency.wait();
            return {
              ...fee,
              price: currentCurrency.lastPrice,
              decimals: currentCurrency.decimals,
              icon: currentCurrency.icon,
              tokenName: currentCurrency.name,
              tokenSymbol: currentCurrency.symbol,
            };
          })
        );
        return {
          ...response,
          affiliateFees: feeData,
        };
      }
      return response;
    } else {
      return rejectWithValue("No authorization found.");
    }
  }
);

export const saveAffiliateCode = createAsyncThunk(
  "backend/save-affiliate",
  async (
    {
      address,
      referralCode,
    }: {
      address: string;
      referralCode: string;
    },
    { getState, rejectWithValue, dispatch }
  ) => {
    const thisState: any = getState();
    if (thisState.backend.authSignature) {
      const response = await BackendApi.saveAffiliate(
        thisState.backend.authSignature,
        address,
        referralCode
      );
      return response;
    } else {
      return rejectWithValue("No authorization found.");
    }
  }
);

export const claimFees = createAsyncThunk(
  "affiliate/claimFees",
  async ({ tokens, fees, proofs, provider, networkId }: ClaimFeesAsyncThunk) => {
    const signer = provider.getSigner();
    const affiliateContract = new ethers.Contract(
      getMerkleDistributorAddress(networkId),
      merkleDistributor,
      signer
    );
    const claimTxn: ContractTransaction = await affiliateContract["claimInBatch"](
      tokens,
      fees,
      proofs
    );
    try {
      const response: ContractReceipt = await claimTxn.wait();
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

export const getPassBonusable = createAsyncThunk(
  "affiliate/pass-bonus",
  async ({ provider, networkId }: { provider: JsonRpcProvider; networkId: number }) => {
    const signer = provider.getSigner();
    const balancePassContract = new ethers.Contract(
      networks[networkId].addresses["PASS_NFT_ADDRESS"],
      ierc721Abi,
      signer
    );
    const balance: BigNumber = await balancePassContract["balanceOf"](
      await signer.getAddress()
    );
    return balance.gt(BigNumber.from(0));
  }
);

export const getTotalClaimedAmounts = createAsyncThunk(
  "affiliate/total-claimed",
  async ({ provider, networkId }: { provider: JsonRpcProvider; networkId: number }) => {
    const signer = provider.getSigner();
    const affiliateContract = new ethers.Contract(
      getMerkleDistributorAddress(networkId),
      merkleDistributor,
      signer
    );

    // let sum = 0;

    const totalClaimedAmounts = await Promise.all(
      Object.entries(currencyInfo).map(async ([tokenId, currencyDetails]) => {
        const tokenAddress = currencyDetails.addresses[networkId];
        const user = await signer.getAddress();
        const amount = await affiliateContract["claimedAmount"](user, tokenAddress);
        const currentCurrency = getErc20CurrencyFromAddress(tokenAddress);
        await currentCurrency.wait();
        return {
          token: currentCurrency,
          amount,
        };
        // sum +=
        //   parseFloat(formatUnits(amount, currentCurrency.decimals)) *
        //   currentCurrency.lastPrice;
      })
    );
    return totalClaimedAmounts;
  }
);

export const affilateSlice = createSlice({
  name: "affiliate",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAffiliateAddresses.pending, (state, action) => {
      state.status = "pending";
    });
    builder.addCase(
      getAffiliateAddresses.fulfilled,
      (state, action: PayloadAction<AffiliateData | undefined>) => {
        if (action.payload) {
          state.status = "ready";
          state.data = {
            ...state.data,
            ...action.payload,
          };
        }
      }
    );
    builder.addCase(getAffiliateAddresses.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(getAffiliateFees.pending, (state, action) => {
      state.status = "pending";
    });
    builder.addCase(
      getAffiliateFees.fulfilled,
      (state, action: PayloadAction<AffiliateData | undefined>) => {
        if (action.payload) {
          state.status = "ready";
          state.data = {
            ...state.data,
            ...action.payload,
          };
        }
      }
    );
    builder.addCase(getPassBonusable.pending, (state, action) => {
      state.status = "pending";
    });
    builder.addCase(
      getPassBonusable.fulfilled,
      (state, action: PayloadAction<boolean>) => {
        state.status = "ready";
        state.data = {
          ...state.data,
          isBonus: action.payload,
        };
      }
    );
    builder.addCase(getTotalClaimedAmounts.pending, (state, action) => {
      state.status = "pending";
    });
    builder.addCase(
      getTotalClaimedAmounts.fulfilled,
      (state, action: PayloadAction<{ token: erc20Currency; amount: BigNumber }[]>) => {
        state.status = "ready";
        state.data = {
          ...state.data,
          totalAmounts: action.payload,
        };
      }
    );
  },
});

// Action creators are generated for each case reducer function
export const affiliateReducer = affilateSlice.reducer;
