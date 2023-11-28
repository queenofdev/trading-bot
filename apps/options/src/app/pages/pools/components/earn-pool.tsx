import { SvgIcon, Box, Modal, Typography, TextField } from "@mui/material";
import { NorthEastRounded, Close } from "@mui/icons-material";
import LinearProgress, {
  linearProgressClasses,
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import { ethers } from "ethers";
import { useState, useMemo, useEffect } from "react";

import { LabelIcon } from "../../../components/label-icon/label-icon";
import DAIImage from "../../../../assets/images/DAI.png";
import { financialFormatter, numberWithCommas } from "../../../helpers/data-translations";
import { APR } from "../../../core/constants/pool";

export const EarnPool = (): JSX.Element => {
  const daiPrice = 0.998; //TODO: Getting price from Backend
  const currencyBalance = 10000; //TODO: Getting DAI balance from Web3.js

  const [isDeposit, setDeposit] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [amount, setAmount] = useState("0");

  const handleDeposit = () => {
    setDeposit(true);
    setModalOpen(true);
  };

  const handleWithdraw = () => {
    setDeposit(false);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const hasBalance = useMemo(() => {
    if (!currencyBalance) return false;
    return ethers.utils.parseUnits(amount || "0", 18).lte(currencyBalance);
  }, [isDeposit, amount, currencyBalance]);

  useEffect(() => {
    if (isModalOpen) {
      setAmount("0");
    }
  }, [isModalOpen, isDeposit]);

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 5,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.mode === "light" ? "#151C1F" : "#308fe8",
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === "light" ? "#12B3A8" : "#308fe8",
    },
  }));

  function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box>
          <Typography variant="body2" className="text-second">
            23
          </Typography>
        </Box>
        <Box sx={{ width: "100%", mr: 2, ml: 2 }}>
          <BorderLinearProgress variant="determinate" {...props} />
        </Box>
        <Box>
          <Typography variant="body2" className="text-second">
            24&nbsp;hours
          </Typography>
        </Box>
      </Box>
    );
  }

  const PoolAction = () => (
    <div className={`w-full grid grid-cols-2 grid-rows-1 cursor-default`}>
      <div
        className={`xs:py-15 sm:py-0 sm:w-125 sm:h-45 xl:w-140 flex justify-center items-center rounded-lg bg-bunker hover:bg-[#1C1E21]  text-16 hover:text-17 text-second hover:text-primary active:text-primary  mr-10`}
        onClick={handleDeposit}
      >
        <p className="ml-5">+ Deposit</p>
      </div>
      <div
        className={`xs:py-15 sm:py-0 sm:w-125 sm:h-45 flex justify-center items-center rounded-lg bg-bunker hover:bg-[#1C1E21]  text-16 hover:text-17 text-second hover:text-primary active:text-primary`}
        onClick={handleWithdraw}
      >
        <p className="ml-5">- Withdraw</p>
      </div>
    </div>
  );

  return (
    <>
      <div className="text-primary md:rounded-3xl border-bunker border-2">
        <div className="flex xs:flex-col sm:flex-row sm:justify-between xs:items-start sm:items-center border-b-2 border-bunker xs:px-10 xl:px-40 py-30">
          <div className="flex items-center">
            <div className="text-success rounded-full bg-[#0E1214] p-10">
              <SvgIcon component={NorthEastRounded} />
            </div>
            <p className="ml-10 text-30">Earn Pool</p>
          </div>
          <div className="xs:hidden sm:block">
            <PoolAction />
          </div>
        </div>
        <div className="xs:px-10 xl:px-40 py-30">
          <div className="xs:flex sm:hidden justify-center ">
            <PoolAction />
          </div>
          <div className="w-full flex flex-col justify-center items-center bg-bunker rounded-2xl xs:py-10 sm:py-20 my-15">
            <p className="text-second text-16">Total value locked</p>
            <p className="text-primary text-30">$54,521.00</p>
          </div>
          <div className="w-full grid grid-cols-3 grid-rows-1 sm:gap-20 my-15">
            <div className="xs:rounded-l-2xl sm:rounded-2xl bg-bunker flex flex-col justify-center items-center py-15">
              <p className="text-second xs:text-14 sm:text-16">Pool APR</p>
              <p className="text-primary text-18">30.00%</p>
            </div>
            <div className="sm:rounded-2xl bg-bunker flex flex-col justify-center items-center">
              <p className="text-second xs:text-14 sm:text-16">Lock duration</p>
              <p className="text-primary text-18">24 hours</p>
            </div>
            <div className="xs:rounded-r-2xl sm:rounded-2xl bg-bunker flex flex-col justify-center items-center">
              <p className="text-second xs:text-14 sm:text-16">Currencies</p>
              <LabelIcon
                label="DAI"
                icon={() => <img src={DAIImage} alt="DAI LOGO" />}
                reverse
                backgroundColor="bunker"
              />
            </div>
          </div>
          <div className="grid xs:grid-cols-1 lg:grid-cols-2 xs:gap-30 lg:gap-100 text-14 mt-50">
            <div className="grid grid-row-2 gap-30">
              <div className="overview">
                <p className="text-22">Overview</p>
                <p className="mt-15 text-regentgray">
                  Deposit DAI to earn from this vault. Funds are locked for 24 hours.
                </p>
              </div>
              <div className="duration">
                <p className="text-22">Duration</p>
                <div className="mt-20">
                  <LinearProgressWithLabel value={70} />
                </div>
              </div>
            </div>
            <div className="position">
              <div className="w-full flex justify-between items-center">
                <p className="text-22">Position</p>
                <p className="text-success">$0.00</p>
              </div>
              <div className="w-full flex justify-between items-center">
                <div>
                  <p className="text-second text-18 my-15">Asset</p>
                  <LabelIcon
                    label="DAI"
                    icon={() => <img src={DAIImage} alt="DAI LOGO" />}
                    reverse
                  />
                </div>
                <div className="flex flex-col items-end justify-center">
                  <p className="text-second text-18 my-15">My position</p>
                  <p className="text-second text-16">0.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
        disableScrollLock={true}
        className="outline-none border-0"
      >
        <div className="absolute sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 xs:w-full xs:h-screen xs:border-0 sm:border-2 sm:rounded-3xl border-[#131719] max-w-700 max-h-650 bg-black xs:pt-40 sm:pt-10">
          <div className="w-40 h-40 p-10 rounded-full bg-heavybunker text-primary flex justify-center items-center absolute xs:top-20 xs:right-10 sm:top-20 sm:right-25">
            <SvgIcon component={Close} onClick={handleModalClose} className="w-25 h-25" />
          </div>
          <div className="cursor-default">
            <div className="w-full border-b-2 border-bunker xs:px-0 sm:px-50 pt-20 grid grid-cols-2 grid-rows-1 text-primary">
              <div
                className={`xs:p-5 sm:p-20 text-center border-b-success ${
                  isDeposit ? "border-b-2 text-primary" : "border-b-0 text-second"
                } xs:text-20 sm:text-30`}
                onClick={() => setDeposit(true)}
              >
                Deposit
              </div>
              <div
                className={`xs:p-5 sm:p-20 text-center border-b-success ${
                  !isDeposit ? "border-b-2 text-primary" : "border-b-0 text-second"
                } xs:text-20 sm:text-30`}
                onClick={() => setDeposit(false)}
              >
                Withdraw
              </div>
            </div>
            <div className="xs:px-10 sm:px-50 py-50">
              <div
                className="wallet relative border-2 border-bunker rounded-2xl"
                id="wallet"
              >
                <label
                  htmlFor="wallet"
                  className="absolute translate-x-20 -translate-y-1/2 text-16 text-second bg-black px-15"
                >
                  {isDeposit ? "My wallet" : "My position"}
                </label>
                <div className="px-35 py-20">
                  <div className="pb-20 flex items-center justify-between border-b-2 border-bunker">
                    <div className="px-20 py-10 rounded-3xl bg-woodsmoke">
                      <LabelIcon
                        label="DAI"
                        icon={() => <img src={DAIImage} alt="DAI LOGO" />}
                        reverse
                        backgroundColor="woodsmoke"
                      />
                    </div>
                    <div className="w-3/5">
                      <TextField
                        variant="standard"
                        type="number"
                        InputProps={{
                          disableUnderline: true,
                          style: {
                            flexGrow: 1,
                            fontSize: "30px",
                            margin: "0px",
                          },
                        }}
                        inputProps={{ style: { textAlign: "right", color: "#c1d6eb" } }}
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
                        value={amount}
                        focused
                        onChange={(e) => setAmount(e.target.value || "0")}
                      />
                    </div>
                  </div>
                </div>
                <div className="px-35 pb-20 flex items-center justify-between text-second">
                  <p className="">Wallet: {numberWithCommas(currencyBalance)}</p>
                  <p>{financialFormatter.format(parseFloat(amount) * daiPrice)}</p>
                </div>
              </div>
              <div
                className="estimated-yield relative border-2 border-bunker rounded-2xl  my-20"
                id="estimated-yield"
              >
                <label
                  htmlFor="estimated-yield"
                  className="absolute translate-x-20 -translate-y-1/2 text-16 text-second bg-black px-15"
                >
                  {isDeposit ? "Estimated Yield" : "Claimable rewards"}
                </label>
                <div className="px-35 py-20">
                  <div className="pb-20 flex items-center justify-between border-b-2 border-bunker">
                    <div className="px-20 py-10 rounded-3xl bg-woodsmoke">
                      <LabelIcon
                        label="DAI"
                        icon={() => <img src={DAIImage} alt="DAI LOGO" />}
                        reverse
                        backgroundColor="woodsmoke"
                      />
                    </div>
                    <div>
                      <p className="text-30 text-primary">
                        {(parseFloat(amount) * APR) / 100}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-35 pb-20 flex items-center justify-between text-second">
                  <p className="">
                    Yield: <span className="text-success">{APR.toFixed(2)}%</span>
                  </p>
                  <p>{financialFormatter.format((parseFloat(amount) * APR) / 100)}</p>
                </div>
              </div>
              {isDeposit ? (
                <button
                  className={`w-full text-center py-20 text-[#dbedff] bg-success xs:text-18 sm:text-25 rounded-2xl ${
                    hasBalance
                      ? "bg-success cursor-pointer"
                      : "bg-second cursor-not-allowed"
                  }`}
                  onClick={handleDeposit}
                >
                  Deposit
                </button>
              ) : (
                <button
                  className={`w-full text-center py-20 text-[#dbedff] xs:text-18 sm:text-25 rounded-2xl ${
                    hasBalance
                      ? "bg-success cursor-pointer"
                      : "bg-second cursor-not-allowed"
                  }`}
                  onClick={handleWithdraw}
                >
                  Withdraw
                </button>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
