import { DaiToken } from "@fantohm/shared/images";
import { Box, SxProps, Theme } from "@mui/material";
import { useEffect, useState } from "react";
import style from "./wallet-balance.module.scss";

/* eslint-disable-next-line */
export interface WalletBalanceProps {
  currency?: string;
  balance?: string;
  sx?: SxProps<Theme>;
}

export const WalletBalance = (props: WalletBalanceProps): JSX.Element => {
  const [currency, setCurrency] = useState("DAI");
  const [balance, setBalance] = useState("loading...");
  useEffect(() => {
    setCurrency(props.currency ? props.currency : "DAI");
  }, [props.currency]);

  useEffect(() => {
    setBalance(props.balance ? props.balance : "loading...");
  }, [props.balance]);

  return (
    <Box className={`flexCenterRow ${style["currencySelector"]}`} sx={{ ...props.sx }}>
      <img
        src={DaiToken}
        style={{ height: "31px", marginRight: "1em" }}
        alt={`${currency} Token Symbol`}
      />
      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "left" }}>
        <span className={style["name"]}>{currency} balance</span>
        <span className={style["amount"]}>{balance} DAI</span>
      </Box>
    </Box>
  );
};

export default WalletBalance;
