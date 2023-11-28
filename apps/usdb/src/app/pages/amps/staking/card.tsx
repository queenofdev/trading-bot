import {
  Box,
  Grid,
  Button,
  Paper,
  OutlinedInput,
  InputAdornment,
  Typography,
  Icon,
  useMediaQuery,
  Divider,
  ThemeProvider,
} from "@mui/material";
import { USDBLight } from "@fantohm/shared-ui-themes";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import style from "../amps.module.scss";
import { useEffect, useMemo, useState } from "react";
import {
  allBonds,
  BondType,
  defaultNetworkId,
  getCalcAmount,
  getStakingInfo,
  getTotalRewards,
  getUsdbAmount,
  IAllBondData,
  isPendingTxn,
  networks,
  trim,
  txnButtonText,
  useWeb3Context,
} from "@fantohm/shared-web3";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";

export default function StakingCard(props: any) {
  const { title, index, stakedType } = props;
  const { provider, address, chainId, connect, disconnect, connected } = useWeb3Context();
  const [stakedNftId, setStakedNftId] = useState<number>(-1);
  const [remainPercent, setRemainPercent] = useState<number>(0);
  const [stakedAmount, setStakedAmount] = useState<number>(0);
  const [pendingRewardsAmount, setPendingRewardsAmount] = useState<number>(0);
  const [totalRewardsAmount, setTotalRewardsAmount] = useState<number>(0);

  const balance = useSelector((state: RootState) => {
    return state.account.balances;
  });
  const dispatch = useDispatch();

  const pendingTransactions = useSelector((state: RootState) => {
    return state?.pendingTransactions;
  });

  const stakeNftPoolData = useMemo(() => {
    return allBonds.filter(
      (pool) => pool.type === BondType.STAKE_NFT && pool.days === index
    )[0] as IAllBondData;
  }, [index]);

  const onStake = () => {
    if (!props.onStake) return;
    props.onStake(index);
  };

  useEffect(() => {
    if (!provider) return;

    dispatch(
      getStakingInfo({
        type: index,
        address,
        bond: stakeNftPoolData,
        networkId: chainId ?? defaultNetworkId,
        provider,
        callback: ({ tokenId, remainPercent }: any) => {
          setStakedNftId(tokenId);
          setRemainPercent(remainPercent);
        },
      })
    );
  }, [stakedType]);

  useEffect(() => {
    if (stakedNftId === -1 || !provider || stakedType !== index) {
      setStakedAmount(0);
      return;
    }

    dispatch(
      getUsdbAmount({
        nftId: stakedNftId,
        address,
        bond: stakeNftPoolData,
        provider,
        networkId: chainId ?? defaultNetworkId,
        callback: (amount: number) => {
          setStakedAmount(amount);
        },
      })
    );

    dispatch(
      getCalcAmount({
        nftId: stakedNftId,
        type: index,
        address,
        bond: stakeNftPoolData,
        provider,
        networkId: chainId ?? defaultNetworkId,
        callback: (amount: number) => {
          setPendingRewardsAmount(amount);
        },
      })
    );

    dispatch(
      getTotalRewards({
        type: index,
        address,
        bond: stakeNftPoolData,
        provider,
        networkId: chainId ?? defaultNetworkId,
        callback: (amount: number) => {
          setTotalRewardsAmount(amount);
        },
      })
    );
  }, [stakedNftId]);

  return (
    <Grid item xs={4}>
      <ThemeProvider theme={USDBLight}>
        <Box className={`${style["bondCard"]} flexCenterCol`}>
          <Paper
            sx={{ marginTop: "47px", maxWidth: "470px" }}
            elevation={0}
            className={`${style["bondElement"]}`}
          >
            <Grid container rowSpacing={3}>
              <Grid item xs={12}>
                <Box className={`flexCenterCol`}>
                  <div className={`${style["textWrapper"]}`}>{title}</div>
                </Box>
                <Grid container rowSpacing={3}>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingTop: "50px",
                    }}
                  >
                    <Box className={style["titleWrapper"]}>
                      <h3>AMPS Pool {index}</h3>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  <Grid item xs={12}>
                    <Box textAlign="center">
                      <Typography
                        variant="body2"
                        color="primary"
                        className={style["description"]}
                      >
                        Accrual multiplier
                      </Typography>
                      <Typography variant="h5" color="primary" marginTop={1}>
                        {index} X
                      </Typography>
                    </Box>
                  </Grid>

                  {index !== 1 && (
                    <Grid item xs={12}>
                      <Box className={style["progress"]}>
                        <CircularProgressbarWithChildren
                          value={stakedType !== index ? 0 : (1 - remainPercent) * 100}
                          strokeWidth={3}
                          styles={buildStyles({
                            pathColor: "#3744e6",
                          })}
                        >
                          <Typography
                            variant="inherit"
                            color="primary"
                            className={style["description"]}
                          >
                            Time remaining
                          </Typography>
                          <Typography variant="h6" color="primary">
                            {index === 2 ? 360 : 720} days
                          </Typography>
                        </CircularProgressbarWithChildren>
                      </Box>
                    </Grid>
                  )}

                  {index === 1 && (
                    <Grid item xs={12}>
                      <Box className={style["timeRemains"]}>
                        <Typography
                          variant="body2"
                          color="primary"
                          className={style["description"]}
                        >
                          Time remaining
                        </Typography>
                        <Typography variant="h6" color="primary">
                          No lock up
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  <Grid item xs={12} sx={{ paddingTop: 0 }}>
                    <Box className={style["list"]}>
                      <Typography variant="subtitle2" color="primary">
                        Staked NFT(s) value
                      </Typography>
                      <Typography variant="subtitle2" color="primary">
                        {trim(stakedAmount, 2)} USDB
                      </Typography>
                    </Box>
                    <Box className={style["list"]}>
                      <Typography variant="subtitle2" color="primary">
                        Pending rewards
                      </Typography>
                      <Typography variant="subtitle2" color="primary">
                        {trim(pendingRewardsAmount, 2)} AMPS
                      </Typography>
                    </Box>
                    <Box className={style["list"]}>
                      <Typography variant="subtitle2" color="primary">
                        Total rewards
                      </Typography>
                      <Typography variant="subtitle2" color="primary">
                        {trim(pendingRewardsAmount + totalRewardsAmount, 2)} AMPS
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    {!connected ? (
                      <Button
                        variant="contained"
                        color="primary"
                        className="paperButton cardActionButton"
                        onClick={() => connect(false)}
                      >
                        Connect Wallet
                      </Button>
                    ) : (
                      stakeNftPoolData && (
                        <Button
                          variant="contained"
                          color="primary"
                          id="bond-btn"
                          className="paperButton transaction-button"
                          onClick={() => onStake()}
                          disabled={
                            (stakedType !== -1 && stakedType !== index) ||
                            isPendingTxn(
                              pendingTransactions,
                              "unstake_" + stakeNftPoolData.name
                            )
                          }
                        >
                          {stakedType === index
                            ? txnButtonText(
                                pendingTransactions,
                                "unstake_" + stakeNftPoolData.name,
                                "Unstake"
                              )
                            : "Stake"}
                        </Button>
                      )
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </ThemeProvider>
    </Grid>
  );
}
