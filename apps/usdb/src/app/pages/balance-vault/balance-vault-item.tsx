import { PaperTableCell, PaperTableRow } from "@fantohm/shared-ui-themes";
import { Avatar, Box, Button, LinearProgress, Typography } from "@mui/material";
import { BigNumber, ethers } from "ethers";
import { BalanceVaultType } from "../../store/interfaces";
import { BalanceVaultOverview } from "./balanceVault";
import style from "./balanceVault.module.scss";
import { Link } from "react-router-dom";
import {
  useWeb3Context,
  defaultNetworkId,
  getErc20CurrencyFromAddress,
} from "@fantohm/shared-web3";
import { TakepileLogo } from "@fantohm/shared/images";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export type BalanceVaultItemProps = {
  Type: BalanceVaultType;
  overview?: BalanceVaultOverview[];
};

export const BalanceVaultItem = ({
  Type,
  overview,
}: BalanceVaultItemProps): JSX.Element => {
  const { provider, address, chainId, connected } = useWeb3Context();
  const fundingAmount =
    BigNumber.from(Type.fundingAmount).div(Math.pow(10, 15)).div(1000).toNumber() / 1000;
  const fundraisedAmount =
    BigNumber.from(Type.fundraised).div(Math.pow(10, 15)).div(1000).toNumber() / 1000;
  const apr = parseFloat(BigNumber.from(Type.apr).div(100).toString()).toFixed(2);
  const duration = BigNumber.from(Type.repaymentTimestamp)
    .sub(BigNumber.from(Type.freezeTimestamp))
    .div(86400)
    .toString();

  const themeType = useSelector((state: RootState) => state.app.theme);
  const rowThemeMod = themeType === "light" ? style["light"] : style["dark"];

  return (
    <PaperTableRow className={`${style["row"]} ${rowThemeMod}`}>
      <PaperTableCell key="vaultName" className={style["offerElem"]}>
        <Box sx={{ display: "flex" }}>
          <Avatar src={Type.ownerContacts[0]} sx={{ height: 43, width: 43, mr: 3 }} />
          <Box className="flex fr ai-c" sx={{ mr: 2 }}>
            {Type.ownerInfos[0]}
          </Box>
        </Box>
      </PaperTableCell>
      <PaperTableCell key="vaultAmount" className={style["offerElem"]}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            className="flex fr ai-c"
            sx={{ width: "15%", display: "flex", justifyContent: "center" }}
          >
            ${fundraisedAmount}K
          </Box>
          <LinearProgress
            variant="determinate"
            value={Number((fundraisedAmount / fundingAmount) * 100)}
            sx={{ width: "50%", ml: "5%", mr: "5%" }}
          />
          <Box
            className="flex fr ai-c"
            sx={{ width: "10%", display: "flex", justifyContent: "center" }}
          >
            ${fundingAmount}K
          </Box>
        </Box>
      </PaperTableCell>
      <PaperTableCell key="vaultapr" className={style["offerElem"]}>
        <Box className="flex fr ai-c">{apr}%</Box>
      </PaperTableCell>
      <PaperTableCell key="vaultduration" className={style["offerElem"]}>
        <Box className="flex fr ai-c">{duration} days</Box>
      </PaperTableCell>
      <PaperTableCell>
        {Type.allowedTokens.map((item, index) => (
          <img
            key={index}
            src={getErc20CurrencyFromAddress(item, chainId ?? defaultNetworkId).icon}
            alt={getErc20CurrencyFromAddress(item, chainId ?? defaultNetworkId).symbol}
            style={{ width: "23px" }}
          ></img>
        ))}
      </PaperTableCell>
      <PaperTableCell>
        <Link to={`/vault/${Type.vaultAddress}`} key={Type.ownerInfos[0]}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#262f38",
              fontSize: "18px",
              height: "30px",
              color: "white",
            }}
          >
            open
          </Button>
        </Link>
      </PaperTableCell>
    </PaperTableRow>
  );
};
