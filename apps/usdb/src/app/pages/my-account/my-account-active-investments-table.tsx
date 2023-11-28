import {
  Button,
  Icon,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { HashLink as Link } from "react-router-hash-link";
import { useSelector } from "react-redux";
import style from "./my-account.module.scss";
import {
  BondType,
  IAllBondData,
  useBonds,
  useWeb3Context,
  prettifySeconds,
  trim,
  chains,
} from "@fantohm/shared-web3";
import { useEffect, useState } from "react";
import Investment from "./my-account-investments";
import { isPendingTxn, txnButtonTextGeneralPending } from "@fantohm/shared-web3";
import { RootState } from "../../store";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

export const MyAccountActiveInvestmentsTable = ({
  investments,
  onRedeemBond,
  onConfirmCancelBond,
}: {
  investments: Investment[];
  onRedeemBond: (bond: IAllBondData, index: number) => void;
  onConfirmCancelBond: (bond: IAllBondData, index: number) => void;
}): JSX.Element => {
  const themeType = useSelector((state: RootState) => state.app.theme);
  const backgroundColor = themeType === "light" ? "#f7f7ff" : "#0E0F10";
  const { chainId } = useWeb3Context();
  const { bonds } = useBonds(chainId ?? 250);
  const [currentBlock, setCurrentBlock] = useState<number>();

  const pendingTransactions = useSelector((state: RootState) => {
    return state?.pendingTransactions;
  });

  useEffect(() => {
    (async function () {
      if (chainId) {
        const provider = await chains[chainId].provider;
        setCurrentBlock(await provider.getBlockNumber());
        // console.log('blockNumber: ', await provider.getBlockNumber());
      }
    })();
  }, [chainId]);

  return (
    <Paper
      elevation={0}
      sx={{ marginTop: "10px" }}
      className={style["rowCard"]}
      style={{ backgroundColor: `${backgroundColor}` }}
    >
      <TableContainer>
        <Table aria-label="Active investments">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" className={style["subTitle"]}>
                  Amount
                  <Tooltip
                    sx={{ marginLeft: "5px" }}
                    arrow
                    title="List of active investments"
                  >
                    <Icon component={InfoOutlinedIcon} fontSize="small" />
                  </Tooltip>
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" className={style["subTitle"]}>
                  Rewards
                  <Tooltip
                    sx={{ marginLeft: "5px" }}
                    arrow
                    title="Projected reward per investment"
                  >
                    <Icon component={InfoOutlinedIcon} fontSize="small" />
                  </Tooltip>
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" className={style["subTitle"]}>
                  Investment
                  <Tooltip sx={{ marginLeft: "5px" }} arrow title="Product invested in">
                    <Icon component={InfoOutlinedIcon} fontSize="small" />
                  </Tooltip>
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" className={style["subTitle"]}>
                  ROI
                  <Tooltip
                    sx={{ marginLeft: "5px" }}
                    arrow
                    title="Return on investment over vesting period"
                  >
                    <Icon component={InfoOutlinedIcon} fontSize="small" />
                  </Tooltip>
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" className={style["subTitle"]}>
                  Time remaining
                  <Tooltip
                    sx={{ marginLeft: "5px" }}
                    arrow
                    title="Time remaining in vesting period"
                  >
                    <Icon component={InfoOutlinedIcon} fontSize="small" />
                  </Tooltip>
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {investments.map((investment: Investment, index) => (
              <TableRow key={`ma-invests-table-${index}`} id={`invests-${index}`}>
                <TableCell>
                  <Typography variant="h6">
                    {currencyFormat.format(investment.amount)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">
                    {trim(investment.rewards, 4)} {investment.rewardToken}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">{investment.displayName}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">{investment.roi}%</Typography>
                </TableCell>
                <TableCell>
                  {currentBlock ? (
                    <Typography variant="h6">
                      {prettifySeconds(investment.secondsToVest)}
                    </Typography>
                  ) : (
                    <></>
                  )}
                </TableCell>
                <TableCell>
                  {investment.type === BondType.SINGLE_SIDED && (
                    <Link to={{ pathname: "/staking", hash: "#deposit" }}>
                      <Button
                        variant="contained"
                        disableElevation
                        sx={{ padding: "10px 30px" }}
                      >
                        Manage
                      </Button>
                    </Link>
                  )}
                  {investment.type === BondType.SINGLE_SIDED_V1 && (
                    <Link to={{ pathname: "/staking-v1", hash: "#deposit" }}>
                      <Button
                        variant="contained"
                        disableElevation
                        sx={{ padding: "10px 30px" }}
                      >
                        Manage
                      </Button>
                    </Link>
                  )}
                  {[BondType.TRADFI, BondType.BOND_USDB].includes(investment.type) &&
                    (investment.percentVestedFor >= 100 ? (
                      <Button
                        variant="contained"
                        disableElevation
                        disabled={isPendingTxn(
                          pendingTransactions,
                          `redeem_bond_${investment.bondName}`
                        )}
                        sx={{ padding: "10px 30px" }}
                        onClick={() => {
                          const bond = bonds.find(
                            (bond) => bond.name === investment.bondName
                          );
                          bond &&
                            onRedeemBond(bond as IAllBondData, investment.bondIndex);
                        }}
                      >
                        {txnButtonTextGeneralPending(
                          pendingTransactions,
                          `redeem_bond_${investment.bondName}`,
                          "Redeem"
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        disableElevation
                        disabled={isPendingTxn(
                          pendingTransactions,
                          `cancel_bond_${investment.bondName}_${investment.bondIndex}`
                        )}
                        sx={{ padding: "10px 30px" }}
                        onClick={() => {
                          const bond = bonds.find(
                            (bond) => bond.name === investment.bondName
                          );
                          bond &&
                            onConfirmCancelBond(
                              bond as IAllBondData,
                              investment.bondIndex
                            );
                        }}
                      >
                        {txnButtonTextGeneralPending(
                          pendingTransactions,
                          `cancel_bond_${investment.bondName}_${investment.bondIndex}`,
                          "Cancel"
                        )}
                      </Button>
                    ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default MyAccountActiveInvestmentsTable;
