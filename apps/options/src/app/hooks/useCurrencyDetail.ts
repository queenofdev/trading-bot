import { Betting_CryptoCurrencies } from "../core/constants/basic";
import { CryptoCurrency } from "../core/types/types";

export const useCurrencyDetail = (underlyingCurrency: string | null): CryptoCurrency => {
  if (underlyingCurrency == null) return Betting_CryptoCurrencies[0];
  else {
    const underlyingToken = Betting_CryptoCurrencies.filter((item) => {
      return item.symbol === underlyingCurrency?.toUpperCase();
    });
    return underlyingToken[0];
  }
};
