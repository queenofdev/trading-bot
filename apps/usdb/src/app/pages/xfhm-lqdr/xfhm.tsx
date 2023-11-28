import {
  Box,
  Tabs,
  Tab,
  Typography,
  Skeleton,
  FormControl,
  OutlinedInput,
  InputAdornment,
  Button,
} from "@mui/material";
import { a11yProps, formatAmount } from "@fantohm/shared-helpers";
import {
  useWeb3Context,
  xFhmToken,
  changeApprovalForXfhm,
  NetworkIds,
  txnButtonText,
  isPendingTxn,
  error,
  changeStakeForXfhm,
  claimForXfhm,
} from "@fantohm/shared-web3";
import { memo, SyntheticEvent, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../store";
import style from "./xfhm-lqdr.module.scss";

export const XfhmPage = (): JSX.Element => {
  const { chainId, address, provider, connected, disconnect, connect } = useWeb3Context();
  const dispatch = useDispatch();
  const [stakeView, setStakeView] = useState<number>(0);
  const [stakeQuantity, setStakeQuantity] = useState<string>("");
  const [unstakeQuantity, setUnStakeQuantity] = useState<string>("");

  const details = useSelector((state: RootState) => {
    return state?.xfhm?.details;
  });

  const pendingTransactions = useSelector((state: RootState) => {
    return state?.pendingTransactions;
  });

  const changeStakeView = (event: SyntheticEvent, newView: number) => {
    setStakeView(newView);
  };

  const onChangeStake = async (action: string) => {
    if (!provider || !chainId || !address) {
      return;
    }
    if (action === "stake") {
      if (Number(stakeQuantity) === 0 || stakeQuantity === "") {
        dispatch(error("Please enter a value!"));
        return;
      }
      const balance = formatAmount(details?.fhmBalance || 0, "gwei", 4);
      if (Number(stakeQuantity) > balance) {
        dispatch(error("You cannot stake more than your FHM balance."));
        return;
      }
      await dispatch(
        changeStakeForXfhm({
          address,
          action,
          value: stakeQuantity.toString(),
          provider,
          networkId: chainId,
        })
      );
    } else {
      if (Number(unstakeQuantity) === 0 || unstakeQuantity === "") {
        dispatch(error("Please enter a value!"));
        return;
      }
      const depositAmount = formatAmount(details?.depositAmount || 0, "gwei", 4);
      if (Number(unstakeQuantity) > depositAmount) {
        dispatch(error("You cannot unstake more than your FHM balance."));
        return;
      }
      await dispatch(
        changeStakeForXfhm({
          address,
          action,
          value: unstakeQuantity.toString(),
          provider,
          networkId: chainId,
        })
      );
    }
  };

  const handleConnect = useCallback(async () => {
    if (connected) {
      await disconnect();
    } else {
      try {
        await connect();
      } catch (e) {
        console.log("Connection metamask error", e);
      }
    }
  }, [connected, disconnect, connect]);

  const setMax = (stakeView: number) => {
    if (!details) {
      return;
    }
    if (stakeView === 0) {
      setStakeQuantity(formatAmount(details.fhmBalance, "gwei", 4).toString());
    } else {
      setUnStakeQuantity(formatAmount(details.depositAmount, "gwei", 4).toString());
    }
  };

  const onSeekApproval = async () => {
    if (!provider || !chainId || !address) {
      return;
    }
    await dispatch(
      changeApprovalForXfhm({
        address,
        provider,
        networkId: chainId || NetworkIds.FantomOpera,
        token: "fhm",
      })
    );
  };

  const onClaim = async () => {
    if (!provider || !chainId) {
      return;
    }
    await dispatch(claimForXfhm({ address, provider, networkId: chainId }));
  };

  return (
    <Box className="flexCenterCol">
      <Box mb="20px">
        <Typography variant="h4" color="primary" className="font-weight-bold">
          xFHM
        </Typography>
      </Box>
      <Box
        className="w100"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb="20px"
      >
        <Box>
          {details ? (
            <Typography variant="h4" color="textPrimary">
              {formatAmount(details.claimableXfhm, xFhmToken.decimals, 9, true)}
            </Typography>
          ) : (
            <Skeleton />
          )}
          <Typography variant="body2" color="textPrimary">
            Claimable xFHM
          </Typography>
        </Box>
        <Button
          className="thin"
          color="primary"
          variant="contained"
          disabled={
            !address ||
            isPendingTxn(pendingTransactions, "claiming") ||
            formatAmount(
              details?.claimableXfhm ? details?.claimableXfhm : 0,
              xFhmToken.decimals,
              9
            ) <= 0
          }
          onClick={() => onClaim().then()}
        >
          {txnButtonText(pendingTransactions, "claiming", "Claim xFHM")}
        </Button>
      </Box>
      <Box
        className="w100"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb="5px"
      >
        <Typography variant="body2" color="textPrimary">
          FHM Balance
        </Typography>
        {details ? (
          <Typography
            variant="body2"
            color="textPrimary"
            style={{ fontWeight: "bolder" }}
          >
            {formatAmount(details.fhmBalance, "gwei", 4)}
          </Typography>
        ) : (
          <Skeleton width="100px" />
        )}
      </Box>
      <Box
        className="w100"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb="5px"
      >
        <Typography variant="body2" color="textPrimary">
          Staked FHM
        </Typography>
        {details ? (
          <Typography
            variant="body2"
            color="textPrimary"
            style={{ fontWeight: "bolder" }}
          >
            {formatAmount(details.stakedFhm, "gwei", 4)}
          </Typography>
        ) : (
          <Skeleton width="100px" />
        )}
      </Box>
      <Box
        className="w100"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb="5px"
      >
        <Typography variant="body2" color="textPrimary">
          xFHM / hour
        </Typography>
        {details ? (
          <Typography
            variant="body2"
            color="textPrimary"
            style={{ fontWeight: "bolder" }}
          >
            {formatAmount(details.xfhmPerHour, xFhmToken.decimals)}
          </Typography>
        ) : (
          <Skeleton width="100px" />
        )}
      </Box>
      <Box
        className="w100"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb="5px"
      >
        <Typography variant="body2" color="textPrimary">
          Max xFHM to Earn
        </Typography>
        {details ? (
          <Typography
            variant="body2"
            color="textPrimary"
            style={{ fontWeight: "bolder" }}
          >
            {formatAmount(details.maxXfhmToEarn, "gwei", 4)}
          </Typography>
        ) : (
          <Skeleton width="100px" />
        )}
      </Box>
      <Box
        className="w100"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb="20px"
      >
        <Typography variant="body2" color="textPrimary">
          Total xFHM Supply
        </Typography>
        {details ? (
          <Typography
            variant="body2"
            color="textPrimary"
            style={{ fontWeight: "bolder" }}
          >
            {formatAmount(details.totalXfhmSupply, "gwei", 4)}
          </Typography>
        ) : (
          <Skeleton width="100px" />
        )}
      </Box>
      <Box
        className="w100"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb="20px"
      >
        <Typography variant="h6" color="textPrimary" style={{ fontWeight: "bolder" }}>
          My Balance
        </Typography>
        {details ? (
          <Typography variant="h6" color="textPrimary" style={{ fontWeight: "bolder" }}>
            {formatAmount(details.xfhmBalance, xFhmToken.decimals, 9)} xFHM
          </Typography>
        ) : (
          <Skeleton width="100px" />
        )}
      </Box>
      {connected && details && details.allowance > 0 ? (
        <Box width="100%">
          <Tabs
            key="xfhm-tabs"
            centered
            value={stakeView}
            textColor="primary"
            indicatorColor="primary"
            className="stake-tab-buttons"
            onChange={changeStakeView}
            aria-label="xfhm-tabs"
          >
            <Tab label="Stake" {...a11yProps(0)} />
            <Tab label="Unstake" {...a11yProps(1)} />
          </Tabs>
          <Box mt="20px">
            {stakeView === 0 ? (
              <>
                <FormControl
                  className="ohm-input"
                  style={{ width: "100%" }}
                  variant="outlined"
                  color="primary"
                >
                  <OutlinedInput
                    id="amount-input"
                    type="number"
                    placeholder={`Enter an ${
                      stakeView === 0 ? "stake" : "unstake"
                    } amount`}
                    value={stakeQuantity}
                    onChange={(e) => setStakeQuantity(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <Button
                          className={style["no-padding"]}
                          variant="text"
                          onClick={() => setMax(stakeView)}
                          color="primary"
                        >
                          Max
                        </Button>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <Box mt="20px">
                  <Button
                    className="w100 thin"
                    color="primary"
                    variant="contained"
                    disabled={isPendingTxn(pendingTransactions, "staking")}
                    onClick={() => onChangeStake("stake").then()}
                  >
                    {txnButtonText(pendingTransactions, "staking", "Stake FHM")}
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <FormControl
                  className="ohm-input"
                  style={{ width: "100%" }}
                  variant="outlined"
                  color="primary"
                >
                  <OutlinedInput
                    id="amount-input"
                    type="number"
                    placeholder={`Enter an ${
                      stakeView === 0 ? "stake" : "unstake"
                    } amount`}
                    color="primary"
                    value={unstakeQuantity}
                    onChange={(e) => setUnStakeQuantity(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <Button
                          className={style["no-padding"]}
                          variant="text"
                          onClick={() => setMax(stakeView)}
                          color="primary"
                        >
                          Max
                        </Button>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <Box mt="20px">
                  <Button
                    className="w100 thin"
                    variant="contained"
                    disabled={isPendingTxn(pendingTransactions, "unstaking")}
                    onClick={() => onChangeStake("unstake").then()}
                  >
                    {txnButtonText(pendingTransactions, "unstaking", "Unstake FHM")}
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Box>
      ) : !connected ? (
        <Box display="flex" justifyContent="center">
          <Button
            className="thin"
            color="primary"
            variant="contained"
            onClick={() => handleConnect()}
          >
            Connect Wallet
          </Button>
        </Box>
      ) : (
        <Box display="flex" justifyContent="center">
          <Button
            className="thin"
            color="primary"
            variant="contained"
            disabled={!address || isPendingTxn(pendingTransactions, "approve-fhm")}
            onClick={() => onSeekApproval()}
          >
            {txnButtonText(pendingTransactions, "approve-fhm", "Approve FHM")}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default memo(XfhmPage);
