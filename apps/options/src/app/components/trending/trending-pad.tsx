import { useNavigate } from "react-router-dom";
import React from "react";

import { CryptoCurrency } from "../../core/types/types";

export interface TrendingPadProps {
  sourceToken: string;
  underlyingToken: CryptoCurrency;
  isJackpot?: boolean;
}

const TrendingPad = (props: TrendingPadProps) => {
  const navigate = useNavigate();

  const handleTradeClick = (underlyingToken: CryptoCurrency) => {
    navigate(`/trade?underlyingToken=${underlyingToken.symbol.toLowerCase()}`);
  };
  return (
    <div className="flex flex-col justify-between items-center p-15 bg-woodsmoke opacity-100 xs:w-250 sm:w-350 rounded-2xl">
      <div className="w-full flex justify-between items-center xs:pb-15 sm:pb-30">
        <div className="flex">
          <div className="token-logo flex justify-center items-center w-50">
            <img
              src={`./assets/images/${props.underlyingToken.symbol}.png`}
              alt="ETH logo"
            />
          </div>
          <div className="px-10">
            <p className="token-pair text-15 text-second font-OcrExtendedRegular">
              {props.sourceToken}/{props.underlyingToken.symbol}
            </p>
            <p className="betting-token xs:text-20 sm:text-25 text-primary">
              {props.underlyingToken.name}
            </p>
          </div>
        </div>
        <div className="trading-view w-150">
          <img src="./assets/images/trading0.png" alt="ETH logo" />
        </div>
      </div>
      <button
        className="px-50 py-5 text-16 text-woodsmoke bg-success rounded-xl font-OcrExtendedRegular uppercase"
        onClick={() => handleTradeClick(props.underlyingToken)}
      >
        Trade
      </button>
    </div>
  );
};

export default TrendingPad;
