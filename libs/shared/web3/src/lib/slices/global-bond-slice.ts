import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IBaseAllBondsAsyncThunk } from "./interfaces";
import { enabledMainNetworkIds, NetworkId } from "../networks";
import { Bond } from "../lib/bond";

export interface IGlobalBondDetails {
  globalTreasuryBalance: number;
  globalTreasuryBondRFV: number;
}

interface GlobalBond {
  networkId: NetworkId;
  bond: Bond;
}

export const calcGlobalBondDetails = createAsyncThunk(
  "globalbonding/calcGlobalBondDetails",
  // eslint-disable-next-line no-empty-pattern
  async ({ allBonds }: IBaseAllBondsAsyncThunk, {}): Promise<IGlobalBondDetails> => {
    const includedReserveAddresses = new Set<string>();
    const globalBonds: GlobalBond[] = [];
    for (let i = 0; i < allBonds.length; i++) {
      const bond = allBonds[i];
      for (let j = 0; j < enabledMainNetworkIds.length; j++) {
        const networkId = enabledMainNetworkIds[j];
        if (bond.hasBond(networkId)) {
          const reserveAddress = bond.getAddressForReserve(networkId);
          // Only include bonds that haven't already been counted
          if (!includedReserveAddresses.has(`${networkId}~${reserveAddress}`)) {
            globalBonds.push({
              networkId,
              bond,
            });
            includedReserveAddresses.add(`${networkId}~${reserveAddress}`);
          }
        }
      }
    }

    let globalTreasuryBalance = 0;
    let globalTreasuryBondRFV = 0;

    const purchased = await Promise.all(
      globalBonds.map(({ networkId, bond }) => bond.getTreasuryBalance(networkId))
    );
    purchased.forEach((amount, i) => {
      globalTreasuryBalance += amount;
      if (globalBonds[i].bond.isRiskFree) globalTreasuryBondRFV += amount;
    });

    return {
      globalTreasuryBalance,
      globalTreasuryBondRFV,
    };
  }
);

// Note(zx): this is a barebones interface for the state. Update to be more accurate
interface IBondSlice {
  status: string;
  loading: boolean;
  globalTreasuryBalance: number;
  globalTreasuryBondRFV: number;
}

const setBondState = (state: IBondSlice, payload: any) => {
  state.globalTreasuryBalance = payload.globalTreasuryBalance;
  state.globalTreasuryBondRFV = payload.globalTreasuryBondRFV;
  state.loading = false;
};

const initialState: IBondSlice = {
  status: "idle",
  loading: false,
  globalTreasuryBalance: 0,
  globalTreasuryBondRFV: 0,
};

const globalBondingSlice = createSlice({
  name: "globalbonding",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(calcGlobalBondDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(calcGlobalBondDetails.fulfilled, (state, action) => {
        setBondState(state, action.payload);
        state.loading = false;
      })
      .addCase(calcGlobalBondDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.message);
      });
  },
});

export const globalbondingReducer = globalBondingSlice.reducer;
