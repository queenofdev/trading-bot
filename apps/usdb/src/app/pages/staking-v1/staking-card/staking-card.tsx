import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Icon,
  InputAdornment,
  OutlinedInput,
  Skeleton,
  Tooltip,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import style from "./staking-card.module.scss";
import DaiCard from "../../../components/dai-card/dai-card";
import { DaiToken, FHMToken, DaiUSDBLP } from "@fantohm/shared/images";
import { useDispatch, useSelector } from "react-redux";
import {
  Bond,
  BondType,
  changeApproval,
  claimSingleSidedBond,
  error,
  IAllBondData,
  IBondAssetAsyncThunk,
  IRedeemBondAsyncThunk,
  isPendingTxn,
  redeemSingleSidedBond,
  redeemSingleSidedILProtection,
  trim,
  txnButtonText,
  useBonds,
  useWeb3Context,
  defaultNetworkId,
  getIlRedeemFHM,
  getIlRedeemBlockNumber,
  networks,
  allBonds,
} from "@fantohm/shared-web3";
import { formatSeconds, formatCurrency } from "@fantohm/shared-helpers";
import { RootState } from "../../../store";

interface IStakingCardParams {
  apy: number;
}
type CardStates = "Withdraw" | "IL Redeem" | "Claim";

export const StakingCard = (params: IStakingCardParams): JSX.Element => {
  const [cardState, setCardState] = useState<CardStates>("Withdraw");
  const [quantity, setQuantity] = useState("");
  const [token, setToken] = useState("DAI");
  const [claimableBalance, setClaimableBalance] = useState("0");
  const [image, setImage] = useState(DaiToken);
  const [payout, setPayout] = useState("0");
  const [iLBalanceInUsd, setILBalanceInUsd] = useState<number>(0);
  const [stdButtonColor, setStdButtonColor] = useState<"primary" | "error">("primary");
  const [ilUnLockPeriod, setIlUnLockPeriod] = useState<number>(0);

  const dispatch = useDispatch();
  const { provider, address, chainId, connect, connected } = useWeb3Context();
  const { bonds } = useBonds(chainId || defaultNetworkId);
  // IAllBondData
  const singleSidedBondData = bonds.filter(
    (bond) => bond.type === BondType.SINGLE_SIDED_V1
  )[0] as IAllBondData;
  // StableBond
  const singleSided = allBonds.filter(
    (bond) => bond.type === BondType.SINGLE_SIDED_V1
  )[0] as Bond;

  const accountBonds = useSelector((state: RootState) => {
    return state.account.bonds;
  });

  const singleSidedBond = accountBonds[singleSidedBondData?.name];

  const daiBalance = useSelector((state: RootState) => {
    return trim(Number(state.account.balances.dai), 2);
  });
  const [tokenBalance, setTokenBalance] = useState(daiBalance);

  const setMax = () => {
    if (cardState === "Withdraw") {
      setQuantity(String(singleSidedBond?.userBonds[0]?.lpTokenAmount || 0));
    } else if (cardState === "IL Redeem") {
      setQuantity(String(singleSidedBond?.userBonds[0]?.iLBalance || 0));
    } else if (cardState === "Claim") {
      setQuantity(String(singleSidedBond?.userBonds[0]?.pendingFHM || 0));
    }
  };

  useEffect(() => {
    if (singleSidedBond?.userBonds[0]) {
      setPayout(String(singleSidedBond?.userBonds[0]?.interestDue));
      const { pendingFHM = 0 } = singleSidedBond?.userBonds[0] || {};
      setClaimableBalance(trim(Number(pendingFHM), 4));
    } else {
      setPayout("0");
      setClaimableBalance("0");
    }
  }, [cardState, daiBalance, address, singleSidedBond]);

  const pendingTransactions = useSelector((state: RootState) => {
    return state?.pendingTransactions;
  });

  const hasAllowance = useCallback(() => {
    return singleSidedBondData?.allowance > 0;
  }, [singleSidedBondData, connected, singleSidedBond]);

  useEffect(() => {
    let timer: any = null;
    setIlUnLockPeriod(0);
    if (!address) {
      setTokenBalance("0");
    } else if (cardState === "Withdraw") {
      setToken("DAI-USDB LP");
      const lpAmount = singleSidedBond?.userBonds[0]?.lpTokenAmount;
      setTokenBalance(typeof lpAmount === "undefined" ? "0" : String(lpAmount));
      setImage(DaiUSDBLP);
    } else if (cardState === "IL Redeem") {
      setToken("FHM");
      setImage(FHMToken);
      setTokenBalance("null");
      (async () => {
        const [iLBalance, iLBalanceInUsd] = await getIlRedeemFHM(chainId!, address);
        const [currentBlockNumber, ilProtectionUnlockBlockNumber] =
          await getIlRedeemBlockNumber(chainId!, address);
        const period = Math.ceil(
          (ilProtectionUnlockBlockNumber - currentBlockNumber) *
            networks[chainId!].blocktime
        );
        if (ilProtectionUnlockBlockNumber >= currentBlockNumber) {
          setIlUnLockPeriod(period);
        } else {
          setIlUnLockPeriod(0);
        }
        if (period) {
          timer = setInterval(() => {
            setIlUnLockPeriod((oldPeriod) => {
              if (oldPeriod === 0) {
                clearInterval(timer);
                return 0;
              }
              return oldPeriod - 1;
            });
          }, 1000);
        }
        setILBalanceInUsd(iLBalanceInUsd);
        setTokenBalance(iLBalance);
      })();
    } else if (cardState === "Claim") {
      setToken("FHM");
      const pendingClaim = singleSidedBond?.userBonds[0]?.pendingFHM;
      setTokenBalance(typeof pendingClaim === "undefined" ? "0" : String(pendingClaim));
      setImage(FHMToken);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [cardState, daiBalance, address, singleSidedBond]);

  async function useBond() {
    const slippage = 0;

    if (Number(quantity) === 0 && cardState !== "Claim" && cardState !== "IL Redeem") {
      await dispatch(error("Please enter a value!"));
    } else if (
      isNaN(Number(quantity)) &&
      cardState !== "Claim" &&
      cardState !== "IL Redeem"
    ) {
      await dispatch(error("Please enter a valid value!"));
    } else if (cardState === "IL Redeem" && Number(tokenBalance || 0) <= 0) {
      await dispatch(error("Nothing to redeem!"));
    } else if (cardState === "Claim" && Number(tokenBalance || 0) <= 0) {
      await dispatch(error("Nothing to claim!"));
    } else if (cardState === "Withdraw") {
      await dispatch(
        redeemSingleSidedBond({
          value: String(quantity),
          slippage,
          bond: singleSided,
          networkId: chainId || defaultNetworkId,
          provider,
          address: address,
        } as IBondAssetAsyncThunk)
      );
    } else if (cardState === "Claim") {
      await dispatch(
        claimSingleSidedBond({
          value: String(quantity),
          slippage,
          bond: singleSided,
          networkId: chainId || defaultNetworkId,
          provider,
          address: address,
        } as IBondAssetAsyncThunk)
      );
      if (Number(singleSidedBond?.userBonds[0]?.iLBalance) > 0) setCardState("IL Redeem");
    } else if (cardState === "IL Redeem") {
      await dispatch(
        redeemSingleSidedILProtection({
          bond: singleSided,
          networkId: chainId || defaultNetworkId,
          provider,
          address: address,
        } as IRedeemBondAsyncThunk)
      );
    }
    clearInput();
  }

  const clearInput = () => {
    setQuantity("");
  };

  const onSeekApproval = async () => {
    if (provider) {
      dispatch(
        changeApproval({
          address,
          bond: singleSided,
          provider,
          networkId: chainId ?? defaultNetworkId,
        })
      );
    }
  };

  const isOverBalance: boolean = useMemo(() => {
    // console.log(`tokenBalance ${tokenBalance}, quantity ${quantity}`);
    if (["IL Redeem", "Claim"].includes(cardState)) return false;

    return Number(tokenBalance) < Number(quantity);
  }, [tokenBalance, quantity, cardState]);

  useEffect(() => {
    if (isOverBalance) {
      setStdButtonColor("error");
      return;
    }
    setStdButtonColor("primary");
  }, [isOverBalance, quantity]);

  return (
    <DaiCard
      tokenImage={DaiToken}
      setTheme="light"
      sx={{ minWidth: { xs: "300px", sm: "587px" } }}
      className={style["cardElement"]}
    >
      <h3 className={style["titleWrapper"]}>Single v1</h3>
      <h1>DAI Liquidity Pool</h1>
      <Box className="w100">
        <hr
          style={{
            border: "none",
            borderTop: "2px solid rgba(105,108,128,0.07)",
          }}
        />
      </Box>
      <Box className={`flexCenterRow w100`}>
        <Box
          className={`${style["smokeyToggle"]} ${
            cardState === "Withdraw" ? style["active"] : ""
          }`}
          onClick={() => {
            clearInput();
            setCardState("Withdraw");
          }}
        >
          <div className={style["dot"]} />
          <span>Withdraw</span>
        </Box>
        <Box
          className={`${style["smokeyToggle"]} ${
            cardState === "Claim" ? style["active"] : ""
          }`}
          onClick={() => setCardState("Claim")}
        >
          <div className={style["dot"]} />
          <span>Claim</span>
        </Box>
        <Box
          className={`${style["smokeyToggle"]} ${
            cardState === "IL Redeem" ? style["active"] : ""
          }`}
          onClick={() => setCardState("IL Redeem")}
        >
          <div className={style["dot"]} />
          <span>ILRedeem</span>
        </Box>
      </Box>
      <Box className={`flexCenterRow`}>
        <h1>{params.apy}% APR</h1>
      </Box>
      <Box className="flexCenterRow w100" mb="20px">
        <Box
          className={`flexCenterRow ${style["currencySelector"]}`}
          sx={{ width: "245px" }}
        >
          <img
            src={image}
            style={{ height: "31px", marginRight: "1em" }}
            alt="DAI Token Symbol"
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "left",
            }}
          >
            <span className={style["name"]}>{token} balance</span>
            <span className={style["amount"]}>
              {tokenBalance === "null" ? (
                <Skeleton />
              ) : (
                <>
                  {tokenBalance} {token}{" "}
                  {iLBalanceInUsd > 0 &&
                    cardState === "IL Redeem" &&
                    ` ≈ ${formatCurrency(iLBalanceInUsd, 2)}`}
                </>
              )}
            </span>
          </Box>
        </Box>
      </Box>

      {cardState !== "Claim" && cardState !== "IL Redeem" ? (
        <Box className={style["amountField"]}>
          <OutlinedInput
            id="amount-input-lqdr"
            type="number"
            placeholder="Enter an amount"
            className={`stake-input ${style["styledInput"]}`}
            value={quantity}
            onChange={(e) => {
              if (Number(e.target.value) < 0 || e.target.value === "-") return;
              setQuantity(e.target.value);
            }}
            inputProps={{
              classes: {
                notchedOutline: {
                  border: "none",
                },
              },
            }}
            startAdornment={
              <InputAdornment position="end" className={style["maxButton"]}>
                <Button
                  className={style["no-padding"]}
                  variant="text"
                  onClick={setMax}
                  color="inherit"
                >
                  Max
                </Button>
              </InputAdornment>
            }
          />
        </Box>
      ) : (
        <></>
      )}
      {cardState === "Withdraw" ? (
        <Box className={style["tooltipElement"]}>
          <Box className={`flexSBRow w100`} sx={{ my: "1em" }}>
            <Box className="flexCenterRow">
              <span>Your deposit&nbsp;</span>
              <Tooltip arrow title="The amount of DAI invested initially.">
                <Icon component={InfoOutlinedIcon} />
              </Tooltip>
            </Box>
            <span>{trim(Number(payout), 2)} DAI</span>
          </Box>
          {cardState === "Withdraw" && (
            <Box className={`flexSBRow w100`} sx={{ mb: "1em" }}>
              <Box className="flexCenterRow">
                <span>Estimated Rewards&nbsp;</span>
                <Tooltip
                  arrow
                  title="This it the estimated amount of FHM you will receive if you withdraw your investment."
                >
                  <Icon component={InfoOutlinedIcon} />
                </Tooltip>
              </Box>
              <span>{claimableBalance} FHM</span>
            </Box>
          )}
          <Box
            className={`${style["infoBox"]}`}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              mb: "1.5em",
            }}
          >
            <Icon component={InfoOutlinedIcon} sx={{ mr: "0.5em" }} />
            <span>
              Withdrawal action will also claim your{" "}
              {singleSidedBond?.userBonds[0]?.pendingFHM || 0} <b>FHM</b> rewards.
            </span>
          </Box>
          <Box
            className={`${style["infoBox"]}`}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              mb: "1.5em",
            }}
          >
            <Icon component={InfoOutlinedIcon} sx={{ mr: "0.5em" }} />
            <span>
              You can migrate to newer staking contract by withdraw of your position
              whenever you want.
            </span>
          </Box>
        </Box>
      ) : (
        <Box className={`flexSBRow w100`} sx={{ mb: "2em" }} />
      )}
      {!connected ? (
        <Button
          variant="contained"
          color="primary"
          id="bond-btn"
          className="paperButton transaction-button"
          onClick={() => connect(true)}
        >
          Connect Wallet
        </Button>
      ) : !singleSided.isAvailable[chainId ?? 250] ? (
        <Button
          variant="contained"
          color="primary"
          id="bond-btn"
          className="paperButton transaction-button"
          disabled={true}
        >
          Sold Out
        </Button>
      ) : hasAllowance() ? (
        <Button
          variant="contained"
          color="primary"
          className="paperButton cardActionButton"
          disabled={
            isPendingTxn(pendingTransactions, "deposit_" + singleSided.name) ||
            Number(tokenBalance) === 0 ||
            ilUnLockPeriod > 0
          }
          onClick={useBond}
        >
          {txnButtonText(
            pendingTransactions,
            "deposit_" + singleSided.name,
            `${cardState}${
              ilUnLockPeriod > 0 ? ` (Wait ≈ ${formatSeconds(ilUnLockPeriod)})` : ""
            }`
          )}
        </Button>
      ) : !singleSided.isAvailable[chainId ?? 250] ? (
        <Button
          variant="contained"
          color="primary"
          id="bond-btn"
          className="paperButton transaction-button"
          disabled={true}
        >
          Sold Out
        </Button>
      ) : hasAllowance() ? (
        <Button
          variant="contained"
          color={stdButtonColor}
          className="paperButton cardActionButton"
          disabled={
            isPendingTxn(pendingTransactions, "deposit_" + singleSided.name) ||
            isOverBalance ||
            quantity === "" ||
            quantity === "0" ||
            Number(tokenBalance) === 0
          }
          onClick={useBond}
        >
          {isOverBalance
            ? "Insufficient Balance"
            : txnButtonText(
                pendingTransactions,
                "deposit_" + singleSided.name,
                cardState
              )}
        </Button>
      ) : !singleSided.isAvailable[chainId ?? defaultNetworkId] ? (
        <Button
          variant="contained"
          color="primary"
          id="bond-btn"
          className="paperButton transaction-button"
          disabled={true}
        >
          Sold Out
        </Button>
      ) : hasAllowance() ? (
        <Button
          variant="contained"
          color={stdButtonColor}
          className="paperButton cardActionButton"
          disabled={
            isPendingTxn(pendingTransactions, "deposit_" + singleSided.name) ||
            isOverBalance ||
            quantity === "" ||
            quantity === "0" ||
            Number(tokenBalance) === 0
          }
          onClick={useBond}
        >
          {isOverBalance
            ? "Insufficient Balance"
            : txnButtonText(
                pendingTransactions,
                "deposit_" + singleSided.name,
                cardState
              )}
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          className="paperButton cardActionButton"
          disabled={isPendingTxn(pendingTransactions, "approve_" + singleSided.name)}
          onClick={onSeekApproval}
        >
          {txnButtonText(pendingTransactions, "approve_" + singleSided.name, "Approve")}
        </Button>
      )}
    </DaiCard>
  );
};

export default StakingCard;
