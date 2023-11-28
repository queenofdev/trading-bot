import { Box, Button, Grid, Skeleton, Typography } from "@mui/material";
import { formatAmount, truncateDecimals, formatCurrency } from "@fantohm/shared-helpers";
import {
  addLiquidity,
  allAssetTokens,
  AssetToken,
  calcAssetAmount,
  changeApprovalForXfhm,
  error,
  isPendingTxn,
  NetworkIds,
  payoutForUsdb,
  txnButtonText,
  useWeb3Context,
} from "@fantohm/shared-web3";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ethers } from "ethers";

import { AssetTokenModal } from "./asset-token-modal";
import { AssetSection } from "./asset-section";
import { RootState } from "../../store";
import useDebounce from "../../hooks/debounce";
import "./xfhm-lqdr.module.scss";

export const LqdrPage = (): JSX.Element => {
  const { chainId, address, provider } = useWeb3Context();
  const dispatch = useDispatch() as ThunkDispatch<unknown, unknown, AnyAction>;

  const pendingTransactions = useSelector((state: RootState) => {
    return state?.pendingTransactions;
  });
  const details = useSelector((state: RootState) => {
    return state?.xfhm?.details;
  });
  const assetTokens = useSelector((state: RootState) => {
    return state?.xfhm?.assetTokens;
  });

  const [aToken, setAToken] = useState<AssetToken>(allAssetTokens[0]);
  const [bToken, setBToken] = useState<AssetToken>(allAssetTokens[1]);
  const [assetTokenModalOpen, setAssetTokenModalOpen] = useState(false);
  const [aTokenAmount, setATokenAmount] = useState<number>(0);
  const [bTokenAmount, setBTokenAmount] = useState<number>(0);
  const [bTokenLoading, setBTokenLoading] = useState<boolean>(false);
  const [usdbLoading, setUsdbLoading] = useState<boolean>(false);
  const [usdbAmount, setUsdbAmount] = useState<number>(0);
  const [usdbAmountInUsd, setUsdbAmountInUsd] = useState<number>(0);
  const [lqdrAmountInUsd, setLqdrAmountInUsd] = useState<number>(0);

  const bTokenAmountDebounce = useDebounce(bTokenAmount.toString(), 1000);

  const setMax = async (title: string) => {
    try {
      setBTokenLoading(true);
      if (title === "Asset A") {
        setATokenAmount(formatAmount(aToken?.balance || 0, aToken.decimals, 9));
        const maxAmount = await calcBTokenAmount(aToken?.balance || 0);
        setBTokenAmount(formatAmount(maxAmount, bToken.decimals, 9));
      } else {
        setBTokenAmount(formatAmount(bToken?.balance || 0, bToken.decimals, 9));
        const maxAmount = await calcATokenAmount(bToken?.balance || 0);
        setATokenAmount(formatAmount(maxAmount, aToken.decimals, 9));
      }
    } catch (e: any) {
      console.log(e);
    } finally {
      setBTokenLoading(false);
    }
  };

  const openAssetTokenModal = () => {
    setAssetTokenModalOpen(true);
  };

  const closeAssetTokenModal = (token: AssetToken) => {
    setAssetTokenModalOpen(false);
    if (!token) {
      return;
    }
    setBToken(token);
  };

  const calcATokenAmount = async (bTokenAmount: number): Promise<number> => {
    if (!assetTokens || !assetTokens?.length || !provider || !chainId) {
      return 0;
    }
    return await dispatch(
      calcAssetAmount({
        address,
        action: "calculate-xfhm",
        value: (bTokenAmount || 0).toString(),
        provider,
        networkId: chainId,
      })
    ).unwrap();
  };

  const calcBTokenAmount = async (aTokenAmount: number): Promise<number> => {
    if (!assetTokens || !assetTokens?.length || !provider || !chainId) {
      return 0;
    }
    return await dispatch(
      calcAssetAmount({
        address,
        action: "calculate-lqdr",
        value: (aTokenAmount || 0).toString(),
        provider,
        networkId: chainId,
      })
    ).unwrap();
  };

  const calcUsdbAmount = async (isSubscribed: boolean) => {
    if (!provider || !chainId) {
      return;
    }
    try {
      if (isSubscribed) {
        setUsdbLoading(true);
        setLqdrAmountInUsd(Number(bTokenAmount) * Number(details?.lqdrPrice || 0));
      }
      const usdbAmount = await dispatch(
        payoutForUsdb({
          address,
          value: ethers.utils
            .parseUnits(bTokenAmount.toString(), bToken.decimals)
            .toString(),
          provider,
          networkId: chainId,
        })
      ).unwrap();
      if (isSubscribed) {
        setUsdbAmount(usdbAmount || 0);
        setUsdbAmountInUsd(
          (Number(details?.usdbPrice || 0) * (usdbAmount || 0)) / Math.pow(10, 18)
        );
      }
    } catch (e: any) {
      console.log(e);
    } finally {
      if (isSubscribed) {
        setUsdbLoading(false);
      }
    }
  };

  const onAddLiquidity = async () => {
    if (!provider || !chainId) {
      return;
    }
    let bTokenMaxAmount = await calcBTokenAmount(aToken?.balance || 0);
    bTokenMaxAmount = formatAmount(bTokenMaxAmount, bToken.decimals, 2, true);
    if (
      bToken.balance &&
      Number(bTokenAmount) > formatAmount(bToken.balance, bToken.decimals)
    ) {
      dispatch(error(`You cannot deposit more than your ${bToken?.name} balance.`));
      return;
    }
    if (Number(bTokenAmount) > bTokenMaxAmount) {
      dispatch(error(`You cannot deposit more than ${bTokenMaxAmount} ${bToken.name}.`));
      return;
    }
    await dispatch(
      addLiquidity({
        address,
        value: ethers.utils
          .parseUnits(bTokenAmount.toString(), bToken.decimals)
          .toString(),
        provider,
        token: bToken,
        networkId: chainId,
      })
    );
  };

  const onSeekApproval = async (token: string) => {
    if (!provider || !chainId || !address) {
      return;
    }
    await dispatch(
      changeApprovalForXfhm({
        address,
        provider,
        networkId: chainId || NetworkIds.FantomOpera,
        token,
      })
    );
  };

  useEffect(() => {
    let isSubscribed = true;
    if (!assetTokens || !assetTokens?.length) {
      return;
    }
    if (isSubscribed) {
      setAToken(assetTokens[0]);
      setBToken(assetTokens[1]);
    }
    return () => {
      isSubscribed = false;
    };
  }, [assetTokens]);

  useEffect(() => {
    let isSubscribed = true;
    if (!bTokenAmount) {
      setUsdbAmount(0);
      return;
    }
    calcUsdbAmount(isSubscribed).then();
    return () => {
      isSubscribed = false;
    };
  }, [bTokenAmountDebounce]);

  return (
    <Box className="flexCenterCol w100">
      <AssetTokenModal
        open={assetTokenModalOpen}
        assetTokens={assetTokens}
        onClose={closeAssetTokenModal}
      />
      <Box>
        <Typography variant="h4" color="textPrimary" className="font-weight-bold">
          Add Liquidity
        </Typography>
      </Box>
      <AssetSection
        token={aToken}
        pairToken={bToken}
        title="Asset A"
        isMulti={false}
        amount={aTokenAmount}
        setATokenAmount={setATokenAmount}
        setBTokenAmount={setBTokenAmount}
        calcATokenAmount={calcATokenAmount}
        calcBTokenAmount={calcBTokenAmount}
        setMax={setMax}
      />
      <AssetSection
        token={bToken}
        pairToken={aToken}
        title="Asset B"
        isMulti={true}
        amount={bTokenAmount}
        setATokenAmount={setATokenAmount}
        setBTokenAmount={setBTokenAmount}
        calcATokenAmount={calcATokenAmount}
        calcBTokenAmount={calcBTokenAmount}
        openAssetTokenModal={openAssetTokenModal}
        setMax={setMax}
      />
      <Box mt="30px" mb="20px">
        <Typography variant="h6" color="textPrimary" className="font-weight-bold">
          You get
        </Typography>
      </Box>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Box
            className="w100"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Box maxWidth="100%" display="flex" justifyContent="center">
              {!usdbLoading ? (
                <Typography
                  noWrap
                  variant="h5"
                  color="textPrimary"
                  className="font-weight-bolder"
                  textAlign="center"
                >
                  {formatAmount(usdbAmount, 18, 4, true)}
                </Typography>
              ) : (
                <Skeleton width="100px" />
              )}
              <Typography
                variant="h5"
                color="textPrimary"
                className="font-weight-bolder"
                textAlign="center"
              >
                &nbsp;USDB
              </Typography>
            </Box>
            <Box maxWidth="100%" display="flex" justifyContent="center">
              {!usdbLoading ? (
                <Typography noWrap variant="body2" color="textPrimary" textAlign="center">
                  ≈ {formatCurrency(usdbAmountInUsd, 2)}
                </Typography>
              ) : (
                <Skeleton width="100px" />
              )}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box
            className="w100"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Box maxWidth="100%" display="flex" justifyContent="center">
              {!bTokenLoading ? (
                <Typography
                  noWrap
                  variant="h5"
                  color="textPrimary"
                  className="font-weight-bolder"
                  textAlign="center"
                >
                  {truncateDecimals(bTokenAmount, 4)}
                </Typography>
              ) : (
                <Skeleton width="100px" />
              )}
              <Typography
                variant="h5"
                color="textPrimary"
                className="font-weight-bolder"
                textAlign="center"
              >
                &nbsp;LQDR
              </Typography>
            </Box>
            <Box maxWidth="100%" display="flex" justifyContent="center">
              <Typography noWrap variant="body2" color="textPrimary" textAlign="center">
                ≈ {formatCurrency(lqdrAmountInUsd, 2)}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Box className="w100" height="1px" bgcolor="#a6a9be" my="20px" />
      <Box className="w100" display="flex" justifyContent="space-between" mb="20px">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h5" color="textPrimary" className="font-weight-bolder">
            My Pool Balance
          </Typography>
          <Typography variant="body2" color="textPrimary">
            USDB-LQDR LP
          </Typography>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          {details ? (
            <Typography
              noWrap
              variant="h5"
              color="textPrimary"
              className="font-weight-bolder"
            >
              {formatAmount(details?.lqdrUsdbLpBalance, 18, 4, true)} LP
            </Typography>
          ) : (
            <Skeleton width="100px" />
          )}
          <Box maxWidth="100%" display="flex" justifyContent="center">
            {details ? (
              <Typography noWrap variant="body2" color="textPrimary" textAlign="center">
                ≈{" "}
                {formatCurrency(
                  (details?.lqdrUsdbLpBalance * details?.lqdrUsdbLpPrice) /
                    Math.pow(10, 18),
                  2
                )}
              </Typography>
            ) : (
              <Skeleton width="100px" />
            )}
          </Box>
        </Box>
      </Box>

      {details && details.xfhmForLqdrUsdbPolAllowance > 0 && details.lqdrAllowance > 0 ? (
        <Box className="w100" my="20px">
          <Button
            className="w100 thin"
            color="primary"
            variant="contained"
            disabled={
              isPendingTxn(pendingTransactions, "add-liquidity") ||
              Number(bTokenAmount) <= 0
            }
            onClick={() => onAddLiquidity().then()}
          >
            {txnButtonText(pendingTransactions, "add-liquidity", "Add Liquidity")}
          </Button>
        </Box>
      ) : (
        <>
          {details && !(details.xfhmForLqdrUsdbPolAllowance > 0) && (
            <Box className="w100" my="20px">
              <Button
                className="w100 thin"
                color="primary"
                variant="contained"
                disabled={isPendingTxn(pendingTransactions, "approve-xfhm")}
                onClick={() => onSeekApproval("xfhm")}
              >
                {txnButtonText(pendingTransactions, "approve-xfhm", "Approve xFHM")}
              </Button>
            </Box>
          )}
          {details && !(details.lqdrAllowance > 0) && (
            <Box className="w100" my="20px">
              <Button
                className="w100 thin"
                color="primary"
                variant="contained"
                disabled={isPendingTxn(pendingTransactions, "approve-lqdr")}
                onClick={() => onSeekApproval("lqdr")}
              >
                {txnButtonText(pendingTransactions, "approve-lqdr", "Approve LQDR")}
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default memo(LqdrPage);
