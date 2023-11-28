import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { Erc20Currency } from "../../helpers/erc20Currency";

export const selectCurrencies = (state: RootState) => state.currency.currencies;

const selectCurrencyId = (state: RootState, id: string) => id;
export const selectCurrencyById = createSelector(
  selectCurrencies,
  selectCurrencyId,
  (currencies, tokenId) => currencies[tokenId] || ({ symbol: "" } as Erc20Currency)
);

const selectCurrencyAddress = (state: RootState, address: string) => address;
export const selectCurrencyByAddress = createSelector(
  selectCurrencies,
  selectCurrencyAddress,
  (currencies, address) => {
    const match: [string, Erc20Currency] | undefined = Object.entries(currencies).find(
      ([entryTokenId, entryCurrency]) => entryCurrency.currentAddress === address
    );
    if (match) {
      return match[1];
    } else {
      if (typeof currencies["USDB_ADDRESS"] !== undefined) {
        return currencies["USDB_ADDRESS"];
      } else {
        return {} as Erc20Currency;
      }
    }
  }
);
