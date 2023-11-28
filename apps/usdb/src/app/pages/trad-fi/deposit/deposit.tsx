import { Backdrop, Button, Fade, Grid, Icon, Paper, Typography } from "@mui/material";
import { Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  BondType,
  IAllBondData,
  isPendingTxn,
  trim,
  txnButtonText,
  useBonds,
  useWeb3Context,
  error,
  info,
  bondAsset,
  changeApproval,
  IApproveBondAsyncThunk,
  IBondAssetAsyncThunk,
  Bond,
  IUserBond,
  prettifySeconds,
} from "@fantohm/shared-web3";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import WalletBalance from "../../../components/wallet-balance/wallet-balance";
import InputWrapper from "../../../components/input-wrapper/input-wrapper";
import { RootState } from "../../../store";
import style from "./deposit.module.scss";
import { truncateDecimals } from "@fantohm/shared-helpers";

export interface IBond {
  title: string;
}

export interface IBondType {
  [key: string]: IBond;
}

// route: /trad-fi/deposit/:bondType
export const TradFiDeposit = (): JSX.Element => {
  const navigate = useNavigate();

  const { provider, address, chainId } = useWeb3Context();
  const { bonds, allBonds } = useBonds(chainId || 250);
  const { bondType } = useParams();
  const [bond, setBond] = useState<Bond>();
  const tradfiBondData = bonds.filter(
    (bond) => bond.type === BondType.TRADFI && bond.name === bondType
  )[0] as IAllBondData;
  const tradfiBond = allBonds.filter(
    (bond) => bond.type === BondType.TRADFI && bond.name === bondType
  )[0] as Bond;

  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState<string>("");
  const [claimableBalance, setClaimableBalance] = useState("0");
  const [payout, setPayout] = useState("0");
  const [deposited, setDeposited] = useState(false);

  const [pendingPayout, setPendingPayout] = useState("0");
  const pendingTransactions = useSelector((state: RootState) => {
    return state?.pendingTransactions;
  });

  function sum(obj: IUserBond[]) {
    let sum = 0;
    for (let i = 0; i < obj?.length ?? 0; i++) {
      sum += obj[i]?.interestDue ?? 0;
    }
    return sum;
  }
  const totalInterestDue = sum(tradfiBondData?.userBonds);

  // useEffect(() => {
  //   navigate("/trad-fi#get-started")
  // }, [ chainId]);

  const daiBalance = useSelector((state: RootState) => {
    return truncateDecimals(Number(state.account.balances.dai), 4).toString();
  });

  useEffect(() => {
    if (tradfiBondData?.userBonds[0]) {
      setPayout(
        tradfiBondData?.userBonds
          .reduce(
            (total, userBond) => total + userBond?.interestDue * userBond?.pricePaid,
            0
          )
          .toFixed(2)
      );
      setPendingPayout(
        tradfiBondData?.userBonds
          .reduce((total, userBond) => total + Number(userBond?.pendingPayout), 0)
          .toFixed(2)
      );
      setClaimableBalance(tradfiBondData?.userBonds[0]?.pendingFHM);
    }
  }, [tradfiBondData?.userBonds]);

  useEffect(() => {
    if (!tradfiBond) {
      return;
    }
    setBond(tradfiBond);
  }, [bondType, allBonds, tradfiBond]);

  useEffect(() => {
    if (isPendingTxn(pendingTransactions, "deposit_" + tradfiBond.name)) {
      setDeposited(true);
    } else if (deposited) {
      dispatch(
        info(
          "Congratulations, transaction successful. Please check your portfolio for details."
        )
      );
      setTimeout(() => navigate("/my-account"), 2000);
    }
  }, [pendingTransactions]);

  const hasAllowance = useCallback(() => {
    return tradfiBondData && tradfiBondData.allowance && tradfiBondData.allowance > 0;
  }, [tradfiBondData]);

  async function useBond() {
    if (quantity === "") {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(error("Please enter a value!"));
    } else if (isNaN(Number(quantity))) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(error("Please enter a valid value!"));
    } else if (Number(quantity) > Number(daiBalance)) {
      dispatch(error("You're trying to bond more than your balance."));
    } else {
      const slippage = 0;
      await dispatch(
        bondAsset({
          value: String(quantity),
          slippage,
          bond: bond,
          networkId: chainId || 250,
          provider,
          address: address,
        } as IBondAssetAsyncThunk)
      );
      clearInput();
    }
  }

  const onSeekApproval = async () => {
    dispatch(
      changeApproval({
        address,
        provider,
        bond: bond,
        networkId: chainId,
      } as IApproveBondAsyncThunk)
    );
  };

  const clearInput = () => {
    setQuantity("");
  };

  const goBack = () => {
    navigate("/trad-fi#get-started");
  };

  const setMax = () => {
    setQuantity(daiBalance);
  };

  return (
    <Fade in={true} mountOnEnter unmountOnExit>
      <Backdrop open={true} className={` ${style["backdropElement"]}`}>
        <Paper className={` ${style["paperContainer"]}`}>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end" }}
            className={style["closeDeposit"]}
          >
            <Button
              variant="contained"
              className="closeButton"
              onClick={goBack}
              disableElevation
            >
              <Icon component={CloseIcon} />
            </Button>
          </Box>
          <Box className={`flexCenterCol ${style["titleBlock"]}`}>
            <Box
              sx={{ backgroundColor: "primary.main" }}
              className={style["typeContainer"]}
            >
              <Typography className={style["type"]} color="primary.contrastText">
                Fixed Deposit
              </Typography>
            </Box>
            <h1 className={style["title"]}>{tradfiBond.displayName}</h1>
            <h2 className={style["subtitle"]}>
              {prettifySeconds(tradfiBond.days, "day")}
            </h2>
          </Box>
          <Grid container maxWidth="lg" columnSpacing={3}>
            <Grid item xs={12} md={4} className={` ${style["walletField"]}`}>
              <WalletBalance sx={{ ml: "auto" }} balance={daiBalance} />
            </Grid>
            <Grid item xs={12} md={4} className={` ${style["amountField"]}`}>
              <InputWrapper>
                <span>Amount</span>
                <input
                  type="number"
                  placeholder="Enter an amount"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <span className="cursor-pointer" onClick={setMax}>
                  Max
                </span>
              </InputWrapper>
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                pb: "3em",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
              }}
              className={` ${style["approveField"]}`}
            >
              {!tradfiBond.isAvailable[chainId ?? 250] ? (
                <Button
                  variant="contained"
                  color="primary"
                  id="bond-btn"
                  className="transaction-button inputButton"
                  disabled={true}
                >
                  Unavailable
                </Button>
              ) : hasAllowance() ? (
                <Button
                  variant="contained"
                  color="primary"
                  id="bond-btn"
                  className="transaction-button inputButton"
                  disabled={isPendingTxn(
                    pendingTransactions,
                    "deposit_" + tradfiBond.name
                  )}
                  onClick={useBond}
                >
                  {txnButtonText(
                    pendingTransactions,
                    "deposit_" + tradfiBond.name,
                    "Deposit"
                  )}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  id="bond-approve-btn"
                  className="transaction-button inputButton"
                  disabled={isPendingTxn(
                    pendingTransactions,
                    "approve_" + tradfiBond.name
                  )}
                  onClick={onSeekApproval}
                >
                  {txnButtonText(
                    pendingTransactions,
                    "approve_" + tradfiBond.name,
                    "Approve"
                  )}
                </Button>
              )}
            </Grid>
            <Grid item className={` ${style["infoElement"]}`} xs={12} sm>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  maxWidth: "361px",
                  ml: "auto",
                }}
              >
                <span>ROI</span>
                <span>{tradfiBond.roi}%</span>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  maxWidth: "361px",
                  ml: "auto",
                }}
              >
                <span>APY</span>
                <span>{tradfiBond.apy}%</span>
              </Box>
            </Grid>
            <Grid item xs={0} sm={1}>
              <Box
                style={{
                  borderLeft: "2px solid #696C804F",
                  height: "120%",
                  width: "1px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  position: "relative",
                  top: "-0.5em",
                }}
              />
            </Grid>
            <Grid item className={` ${style["infoElement"]}`} xs={12} sm>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  maxWidth: "361px",
                }}
              >
                <span>Amount Deposited</span>
                <span>{payout} DAI</span>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  maxWidth: "361px",
                }}
              >
                <span>Amount Pending</span>
                <span>{trim(totalInterestDue, 2) ?? 0} USDB</span>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Backdrop>
    </Fade>
  );
};

export default TradFiDeposit;
