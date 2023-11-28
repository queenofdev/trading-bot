import { formatCurrency } from "@fantohm/shared-helpers";
import { Erc20Currency } from "@fantohm/shared-web3";
import { Box } from "@mui/material";
import { BigNumber, ethers } from "ethers";

export type PositionTemplateProps = {
  currency: Erc20Currency;
  amount: BigNumber;
};

export const PositionTemplate = ({ currency, amount }: PositionTemplateProps) => {
  return (
    <Box className="flex fr fj-sb ai-c">
      <Box className="flex fr ai-c">
        <img
          src={currency.icon}
          style={{ height: "1.2em", width: "1.2em", marginRight: "0.5em" }}
          alt={currency.name}
        />
        {currency.symbol}
      </Box>
      <span>
        {amount &&
          formatCurrency(+ethers.utils.formatUnits(amount, 18), 2).replace("$", "")}
      </span>
    </Box>
  );
};
