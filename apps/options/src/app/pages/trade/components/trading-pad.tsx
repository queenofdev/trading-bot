import { Button, SvgIcon, TextField } from "@mui/material";
import {
  ErrorOutlineRounded,
  SettingsOutlined,
  LocalGasStationOutlined,
} from "@mui/icons-material";
import {
  isDev,
  NetworkIds,
  useWeb3Context,
  currencyInfo,
  CurrencyDetails,
  useErc20Balance,
} from "@fantohm/shared-web3";
import { ethers, BigNumber } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { useState, useMemo, MouseEvent, useEffect, useCallback } from "react";

import { LabelIcon } from "../../../components/label-icon/label-icon";
import { CurrencyDropdown } from "../../../components/dropdown/currency-dropdown";
import { TimeframeDropdown } from "../../../components/dropdown/timeframe-dropdown";
import ConfirmTradePopup from "../../../components/pop-up/confirm-trade";
import { useDAIContract, useMarketContract } from "../../../hooks/useContracts";
import { financialFormatter } from "../../../helpers/data-translations";
import { UnderlyingAssets } from "../../../core/constants/basic";
import { timeframes } from "../../../core/constants/tradingview";
import {
  MiniumBettingAmount,
  Platform_Fee,
  RewardAmount_Percent,
} from "../../../core/constants/marketing";
import { BINARY_ADDRESSES, desiredNetworkId } from "../../../core/constants/network";
import { RootState } from "../../../store";
import { addAlert } from "../../../store/reducers/app-slice";
import { requestERC20Allowance } from "../../../store/reducers/account-slice";
import {
  fetchPendingTxs,
  isPendingTxn,
  getBettingTypeText,
  clearPendingTx,
  txnButtonText,
} from "../../../store/reducers/pendingTx-slice";

const TradingPad = () => {
  const dispatch = useDispatch();
  const { connect, address, connected, chainId, provider } = useWeb3Context();
  const markets = useSelector((state: RootState) => state.markets);
  const isLoadingVault = useSelector((state: RootState) => state.vaults.isLoading);
  const accountDetail = useSelector((state: RootState) => state.account.accountDetail);
  const pendingTx = useSelector((state: RootState) => state.pendingTx);

  const [timeframe, setTimeFrame] = useState(timeframes[0]);
  const [tokenAmount, setTokenAmount] = useState<string>("0");
  const [direction, setDirection] = useState<"Up" | "Down">("Up");
  const [currency, setCurrency] = useState<CurrencyDetails>(currencyInfo["DAI_ADDRESS"]);
  const [isOpen, setOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(true);

  const daiContract = useDAIContract();
  const marketContract = useMarketContract();
  const { balance: currencyBalance } = useErc20Balance(
    BINARY_ADDRESSES[desiredNetworkId].DAI_ADDRESS,
    address
  );

  const enoughAmount = useCallback(() => {
    return Number(tokenAmount) > 0 && currencyBalance && currencyBalance.gt(0);
  }, [tokenAmount, currencyBalance]);

  const hasAllowance = useCallback(
    (token: string) => {
      if (token === "dai") {
        const daiAllowance = accountDetail
          ? accountDetail["dai"]["allowance"]
          : BigNumber.from(0);
        return daiAllowance.gt(ethers.utils.parseEther("0"));
      }
      return 0;
    },
    [accountDetail["dai"]["allowance"]]
  );

  const isWalletConnected = useMemo(() => {
    return address && connected && chainId === desiredNetworkId;
  }, [address, connected, chainId]);

  const hasBalance = useMemo(() => {
    if (!currencyBalance) return false;
    return ethers.utils.parseUnits(tokenAmount || "0", 18).lte(currencyBalance);
  }, [address, chainId, currencyBalance, tokenAmount]);

  const handleRequestApprove = useCallback(() => {
    if (!provider)
      dispatch(addAlert({ message: "Please connect wallet", severity: "waring" }));
    else
      dispatch(
        requestERC20Allowance({
          networkId: desiredNetworkId,
          provider,
          walletAddress: address,
          assetAddress: BINARY_ADDRESSES[desiredNetworkId].DAI_ADDRESS,
        })
      );
  }, [provider, address, tokenAmount]);

  const onClickConnect = (event: MouseEvent<HTMLButtonElement>) => {
    try {
      connect(true, isDev ? NetworkIds.Goerli : NetworkIds.Ethereum);
    } catch (e: unknown) {
      console.warn(e);
    }
  };

  const handleSetting = () => {
    //TODO: handleSetting
  };
  const handleBetting = async (bettingDirection: "Up" | "Down") => {
    let bettingTx;
    if (enoughAmount() === false) {
      dispatch(addAlert({ message: "Not enough amount", severity: "error" }));
      return;
    }
    if (Number(tokenAmount) < MiniumBettingAmount) {
      dispatch(addAlert({ message: "Amount is zero!", severity: "error" }));
      return;
    }
    if (markets.isLoading !== "ready") {
      dispatch(addAlert({ message: "Please wait a few minitues", severity: "error" }));
      return;
    }
    setDirection(bettingDirection);
    if (localStorage.getItem("hide") !== "true") setOpen(true);
    else {
      if (marketContract && provider) {
        try {
          bettingTx = await marketContract["openPosition"](
            ethers.utils.parseEther(tokenAmount),
            0,
            direction === "Up" ? "0" : "1"
          );
          const pendingTxnType = bettingDirection.toLowerCase() === "up" ? "up" : "down";
          dispatch(
            fetchPendingTxs({
              txHash: bettingTx.hash,
              text: getBettingTypeText(bettingDirection),
              type: pendingTxnType,
            })
          );
          await bettingTx.wait();
        } catch (error: unknown) {
          dispatch(addAlert({ message: "Please try again.", severity: "error" }));
        } finally {
          if (bettingTx) {
            dispatch(clearPendingTx(bettingTx.hash));
          }
        }
      }
    }
  };

  const handleClose = (isOpen: boolean) => {
    setOpen(false);
  };

  useEffect(() => {
    const modalStorage = localStorage.getItem("hide");
    if (modalStorage && JSON.parse(modalStorage) === true) {
      setShowConfirmDialog(false);
    } else setShowConfirmDialog(true);
  }, [isOpen]);

  return (
    <>
      <div className="w-full bg-woodsmoke rounded-3xl xs:px-10 sm:px-35 md:px-15 lg:px-35 xs:py-10 sm:py-20 md:py-30 text-second max-w-500">
        <div className="trade-header flex justify-between items-center text-22 text-primary mb-25">
          <p>Trade</p>
          <SvgIcon
            component={SettingsOutlined}
            onClick={handleSetting}
            className="hidden"
          />
        </div>
        <div className="timeframe rounded-2xl bg-heavybunker px-20 py-10 mb-5">
          <p className="text-16 mb-10">Timeframe</p>
          <div>
            <TimeframeDropdown setTimeframe={setTimeFrame} timeframe={timeframe} />
          </div>
        </div>
        <div className="input rounded-2xl bg-heavybunker px-20 py-10 mb-5">
          <div className="token-enter flex justify-between items-center xs:mb-10 sm:mb-15">
            <TextField
              variant="standard"
              type="number"
              InputProps={{
                disableUnderline: true,
                style: {
                  flexGrow: 1,
                  fontSize: "26px",
                  margin: "0px",
                },
              }}
              inputProps={{ style: { color: "#c1d6eb" } }}
              sx={{
                "& ::-webkit-inner-spin-button": {
                  margin: "0px",
                  appearance: "none",
                },
                "& ::-webkit-outer-spin-button": {
                  margin: "0px",
                  appearance: "none",
                },
              }}
              value={tokenAmount}
              focused
              onChange={(e) => setTokenAmount(e.target.value || "0")}
            />
            <div>
              <CurrencyDropdown
                setCurrency={setCurrency}
                selectedCurrency={currency}
                currencies={UnderlyingAssets}
              />
            </div>
          </div>
          <div className="token-status text-16 flex justify-between items-center">
            <p>{financialFormatter.format(parseFloat(tokenAmount))}</p>
            <p>
              Balance:{" "}
              {currencyBalance &&
                ethers.utils.formatUnits(currencyBalance, currency?.decimals ?? 18)}
            </p>
          </div>
        </div>
        <div className="odds rounded-2xl bg-heavybunker px-20 py-10 mb-5">
          <div className="flex justify-between items-center xs:mb-10 sm:mb-15">
            <p>Odds</p>
            <div>
              <CurrencyDropdown
                setCurrency={setCurrency}
                selectedCurrency={currency}
                currencies={UnderlyingAssets}
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p>1:1</p>
            <p>Payout:&nbsp;{parseFloat(tokenAmount) * RewardAmount_Percent}</p>
          </div>
        </div>
        <div className="gas flex justify-between items-center xs:px-10 sm:px-20 mb-5">
          <div className="flex items-center">
            <LabelIcon
              label="Platform fee:"
              icon={ErrorOutlineRounded}
              reverse
              backgroundColor="wooksmoke"
              labelColor="second"
              iconColor="second"
            />
            <p>&nbsp;{Platform_Fee}%</p>
          </div>
          <div className="rounded-2xl p-10 bg-wooksmoke flex items-center">
            <LabelIcon
              label="Gas:"
              icon={LocalGasStationOutlined}
              reverse
              backgroundColor="wooksmoke"
              labelColor="second"
              iconColor="second"
            />
            <p>&nbsp;${(parseFloat(tokenAmount) * Platform_Fee) / 100}</p>
          </div>
        </div>
        {isWalletConnected ? (
          hasAllowance("dai") ? (
            hasBalance ? (
              <div className="action cursor-default">
                <Button
                  className="w-full bg-success text-white text-center xs:text-20 sm:text-26 rounded-2xl xs:py-10 sm:py-15 mb-5"
                  disabled={isPendingTxn(pendingTx, "up")}
                  onClick={() => handleBetting("Up")}
                >
                  {txnButtonText(pendingTx, "up", "Up")}
                </Button>
                <Button
                  className="w-full bg-danger text-white text-center xs:text-20 sm:text-26 rounded-2xl xs:py-10 sm:py-15"
                  disabled={isPendingTxn(pendingTx, "down")}
                  onClick={() => handleBetting("Down")}
                >
                  {txnButtonText(pendingTx, "down", "Down")}
                </Button>
              </div>
            ) : (
              <Button className="w-full bg-second text-primary text-center rounded-2xl xs:py-10 sm:py-15 cursor-not-allowed xs:text-18 sm:text-24">
                Insufficient balance
              </Button>
            )
          ) : (
            <Button
              className="w-full bg-success text-primary text-center rounded-2xl xs:py-10 sm:py-15 cursor-not-allowed xs:text-18 sm:text-24"
              disabled={isPendingTxn(pendingTx, "approve")}
              onClick={() => handleRequestApprove()}
            >
              {txnButtonText(pendingTx, "approve", "Approve")}
            </Button>
          )
        ) : (
          <Button
            className="w-full bg-success rounded-2xl xs:py-10 sm:py-15 text-white text-center xs:text-20 sm:text-26"
            onClick={onClickConnect}
          >
            Connect
          </Button>
        )}
      </div>
      <ConfirmTradePopup
        interval={timeframe}
        currencyValue={Number(tokenAmount)}
        selectedCurrency={currency}
        direction={direction}
        handleBetting={async (value: "Up" | "Down") => await handleBetting(value)}
        open={isOpen && showConfirmDialog}
        onClose={(value: boolean) => handleClose(value)}
      />
    </>
  );
};

export default TradingPad;
