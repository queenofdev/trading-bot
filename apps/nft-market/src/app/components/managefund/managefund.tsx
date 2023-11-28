import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Icon,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  styled,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import style from "./managefund.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { selectCurrencyById } from "../../store/selectors/currency-selectors";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import React, { BaseSyntheticEvent, useCallback, useEffect, useState } from "react";
import { currencyInfo } from "../../helpers/erc20Currency";
import {
  requestErc20Allowance,
  useWeb3Context,
  selectErc20AllowanceByAddress,
  checkErc20Allowance,
  networks,
  defaultNetworkId,
} from "@fantohm/shared-web3";
import { ethers } from "ethers";
import { desiredNetworkId } from "../../constants/network";
import { addAlert } from "../../store/reducers/app-slice";

export const ValueMaxSwitch = styled(Switch)(({ theme }) => ({
  padding: 8,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    background: "#CCC",
  },
  "& .Mui-checked+.MuiSwitch-track": {
    backgroundColor: "blue",
    opacity: 0.7,
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 12,
    height: 12,
    margin: 4,
    backgroundColor: "blue",
  },
  "& .Mui-checked .MuiSwitch-thumb": {
    backgroundColor: "white",
  },
}));

const MAX_AMOUNT = "1000000000"; // 1B

export interface ManageFundProps {
  onClose: (value: boolean) => void;
  open: boolean;
}

export const ManageFund = (props: ManageFundProps): JSX.Element => {
  const { onClose, open } = props;
  const [value] = React.useState("Deposit");

  const [selectedCurrency, setSelectedCurrency] = useState("wETH");
  // currency info
  const currency = useSelector((state: RootState) =>
    selectCurrencyById(state, `${selectedCurrency.toUpperCase()}_ADDRESS`)
  );
  const handleCurrencyChange = (event: SelectChangeEvent<string>) => {
    setSelectedCurrency(event.target.value);
  };

  const [amount, setAmount] = useState("0");
  const [isMax, setIsMax] = useState(false);

  const { address, chainId, provider } = useWeb3Context();
  // primary form pending state
  const [isPending, setIsPending] = useState(false);

  const dispatch: AppDispatch = useDispatch();
  const {
    checkPermStatus,
    requestPermStatus,
    checkErc20AllowanceStatus,
    requestErc20AllowanceStatus,
  } = useSelector((state: RootState) => state.wallet);
  // watch the status of the wallet for pending txns to clear
  useEffect(() => {
    if (
      checkPermStatus !== "loading" &&
      requestPermStatus !== "loading" &&
      requestErc20AllowanceStatus !== "loading" &&
      checkErc20AllowanceStatus !== "loading"
    ) {
      setIsPending(false);
    } else {
      setIsPending(true);
    }
  }, [
    checkPermStatus,
    requestPermStatus,
    requestErc20AllowanceStatus,
    checkErc20AllowanceStatus,
  ]);
  // request allowance necessary to create loan with these term
  const handleRequestAllowance = useCallback(async () => {
    if (provider && address) {
      setIsPending(true);

      let approveAmounts;
      if (
        currency.currentAddress === networks[desiredNetworkId].addresses["USDT_ADDRESS"]
      ) {
        approveAmounts = ethers.constants.MaxUint256;
      } else {
        approveAmounts = ethers.utils.parseUnits(amount, currency.decimals);
      }

      const result = await dispatch(
        requestErc20Allowance({
          networkId: desiredNetworkId,
          provider,
          walletAddress: address,
          assetAddress: currency?.currentAddress,
          amount: approveAmounts,
        })
      ).unwrap();
      if (result) {
        await dispatch(
          addAlert({
            message: `Allowance for ${currency?.symbol} has been updated!`,
          })
        );
        handleClose();
      }
    }
  }, [chainId, address, amount, provider, currency]);

  const currencyAllowance = useSelector((state: RootState) => {
    if (!currency) return null;
    return selectErc20AllowanceByAddress(state, {
      walletAddress: address,
      erc20TokenAddress: currency?.currentAddress,
    });
  });

  useEffect(() => {
    if (provider && currency) {
      dispatch(
        checkErc20Allowance({
          networkId: desiredNetworkId,
          provider,
          walletAddress: address,
          assetAddress: currency.currentAddress,
        })
      );
    }
  }, [provider, currency]);

  const handleAmountChange = (event: BaseSyntheticEvent) => {
    let value = event.target.value.replace(/-/g, "") || "0";
    const [wholeNumber, fractional] = value.split(".");
    if ((fractional || "").length > currency.decimals) {
      value = wholeNumber + "." + fractional.slice(0, currency.decimals);
    }

    updateAmount(value);
  };

  const updateAmount = (value: string) => {
    const newAmount = ethers.utils.parseUnits(value, currency.decimals);
    if (newAmount.gt(ethers.utils.parseUnits(MAX_AMOUNT, currency.decimals))) {
      setAmount(ethers.utils.formatUnits(ethers.constants.MaxUint256, currency.decimals));
      setIsMax(true);
    } else {
      setAmount(value);
      setIsMax(false);
    }
  };

  const enableMax = () => {
    setAmount(ethers.utils.formatUnits(ethers.constants.MaxUint256, currency.decimals));
    setIsMax(true);
  };

  const disableMax = () => {
    if (currencyAllowance?.gt(ethers.utils.parseUnits(MAX_AMOUNT, currency.decimals))) {
      setAmount("0");
    } else {
      setToDefault();
    }

    setIsMax(false);
  };

  const setToDefault = () => {
    updateAmount(ethers.utils.formatUnits(currencyAllowance || 0, currency.decimals));
  };

  useEffect(() => {
    if (currencyAllowance && currency) {
      setToDefault();
    }
  }, [currencyAllowance, currency]);

  const handleClose = () => {
    onClose(false);
    setToDefault();
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      sx={{ padding: "1.5em" }}
      fullWidth
      className={style["dialogContainer"]}
    >
      <Box className="flex fr fj-c">
        <h1 style={{ margin: "0 0 0.5em 0" }}>Manage Allowances</h1>
      </Box>
      <Box
        className={`flex fr fj-fe ${style["header"]}`}
        sx={{ position: "absolute", right: "16px" }}
      >
        <IconButton onClick={handleClose}>
          <CancelOutlinedIcon />
        </IconButton>
      </Box>
      <Box sx={{ width: "100%" }}>
        <TabContext value={value}>
          {/* <Tabs
            value={value}
            onChange={handleChange}
            TabIndicatorProps={{
              style: {
                backgroundColor: "blue",
              },
            }}
            textColor="inherit"
            variant="fullWidth"
          >
            <Tab value="Deposit" label="Deposit" />
            <Tab value="Withdraw" label="Withdraw" />
          </Tabs> */}
          <TabPanel value="Deposit" sx={{ height: "400px" }}>
            <Box className="flx">
              <Box className="flex fc">
                <Typography sx={{ color: "#aaaaaa", mb: "0.5em" }}>
                  Select Currency
                </Typography>
                <Box className={`flex`}>
                  <Select
                    value={currency?.symbol}
                    onChange={handleCurrencyChange}
                    sx={{
                      background: "transparent",
                      width: "100%",
                      borderRadius: "1.2em",
                      height: "60px",
                    }}
                    MenuProps={{
                      PaperProps: {
                        style: { marginTop: "-12px" },
                      },
                    }}
                  >
                    {Object.entries(currencyInfo).map(
                      ([tokenId, currencyDetails], index) => {
                        // Hide usdb
                        if (tokenId.toLowerCase() == "usdb_address") {
                          return null;
                        }
                        return (
                          <MenuItem
                            value={currencyDetails.symbol}
                            key={`currency-option-item-${tokenId}`}
                            sx={{
                              paddingTop: "2px",
                              paddingBottom: "2px",
                              borderTop: index === 0 ? "" : "1px solid #CCC",
                            }}
                          >
                            <Box className="flex fr ai-c">
                              <img
                                style={{
                                  height: "30px",
                                  width: "30px",
                                  marginRight: "5px",
                                }}
                                src={currencyDetails.icon}
                                alt={`${currencyDetails.symbol} Token Icon`}
                              />
                              <p style={{ fontSize: "16px" }}>
                                {currencyDetails.symbol} - {currencyDetails.name}
                              </p>
                            </Box>
                          </MenuItem>
                        );
                      }
                    )}
                  </Select>
                </Box>
              </Box>
              <Box className="flex fc">
                <Box className="flex fr" sx={{ placeContent: "space-between" }}>
                  <Typography sx={{ color: "#aaa", mt: "1em", mb: "0.5em" }}>
                    Allowance
                    <Tooltip
                      sx={{ marginLeft: "5px" }}
                      arrow
                      title={
                        <Box className="flex fr ai-c">
                          Your current allowance is&nbsp;
                          {currencyAllowance?.gt(
                            ethers.utils.parseUnits(MAX_AMOUNT, currency.decimals)
                          ) ? (
                            <span style={{ fontSize: "20px" }}>&infin;</span>
                          ) : (
                            ethers.utils.formatUnits(
                              currencyAllowance || 0,
                              currency.decimals
                            )
                          )}
                          &nbsp;
                          {currency.symbol}
                        </Box>
                      }
                      componentsProps={{
                        arrow: {
                          style: {
                            color: "black",
                          },
                        },
                        tooltip: {
                          style: {
                            backgroundColor: "black",
                            padding: "10px",
                            borderRadius: "10px",
                          },
                        },
                      }}
                    >
                      <Icon sx={{ mb: "-5px" }} color="inherit">
                        <InfoOutlinedIcon />
                      </Icon>
                    </Tooltip>
                  </Typography>
                  <Typography sx={{ color: "#aaa", mt: "1em", mb: "0.5em" }}>
                    Value
                    <ValueMaxSwitch
                      checked={isMax}
                      onChange={() => {
                        if (isMax === false) {
                          enableMax();
                        } else {
                          disableMax();
                        }
                      }}
                    />
                    Max
                  </Typography>
                </Box>
                <Box className={`flex fr ai-c ${style["valueContainer"]}`}>
                  <Box className={`flex fr ai-c ${style["leftSide"]}`}>
                    <img
                      style={{ height: "30px", width: "30px", marginRight: "5px" }}
                      src={
                        currencyInfo[`${selectedCurrency.toUpperCase()}_ADDRESS`]?.icon
                      }
                      alt={currencyInfo[`${selectedCurrency.toUpperCase()}_ADDRESS`].icon}
                    />
                    <p style={{ fontSize: "16px" }}>
                      {currencyInfo[`${selectedCurrency.toUpperCase()}_ADDRESS`].symbol}
                    </p>
                  </Box>
                  <Box className={`flex fr ai-c ${style["rightSide"]}`}>
                    {isMax ? (
                      <span style={{ fontSize: "30px" }}>&infin;</span>
                    ) : (
                      <TextField
                        type="number"
                        value={amount}
                        onChange={handleAmountChange}
                        variant="standard"
                        InputProps={{
                          disableUnderline: true,
                        }}
                        sx={{
                          width: "100%",
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
              {!isPending && (
                <Button
                  variant="contained"
                  onClick={handleRequestAllowance}
                  sx={{ width: "100%", mt: 4 }}
                  disabled={currencyAllowance?.eq(
                    ethers.utils.parseUnits(amount, currency.decimals)
                  )}
                >
                  Allow Liqd to Access your {currency?.symbol}
                </Button>
              )}
              {isPending && (
                <Button variant="contained" disabled sx={{ width: "100%", mt: 4 }}>
                  <CircularProgress />
                </Button>
              )}
            </Box>
          </TabPanel>
          {/* <TabPanel value="Withdraw" sx={{ height: "350px" }}>
            <Box className="flex fc" sx={{ mt: 6 }}>
              <Typography sx={{ color: "#aaaaaa", mb: "0.5em" }}>
                Select Currency
              </Typography>
              <Box className={`flex`}>
                <Select
                  value={currency?.symbol}
                  onChange={handleCurrencyChange}
                  sx={{
                    background: "transparent",
                    width: "100%",
                    paddingLeft: "10px",
                    borderRadius: "1.2em",
                    height: "60px",
                  }}
                  labelId="demo-multiple-name G-label"
                  id="demo-multiple-name"
                >
                  {Object.entries(currencyInfo).map(([tokenId, currencyDetails]) => (
                    <MenuItem
                      value={currencyDetails.symbol}
                      key={`currency-option-item-${tokenId}`}
                      sx={{
                        paddingTop: "2px",
                        paddingBottom: "2px",
                      }}
                    >
                      <Box className="flex fr ai-c">
                        <img
                          style={{ height: "30px", width: "30px", marginRight: "5px" }}
                          src={currencyDetails.icon}
                          alt={`${currencyDetails.symbol} Token Icon`}
                        />
                        <p style={{ fontSize: "16px" }}>
                          {currencyDetails.symbol} - {currencyDetails.name}
                        </p>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              <Button variant="contained" sx={{ width: "100%", mt: 10 }}>
                Withdraw
              </Button>
            </Box>
          </TabPanel> */}
        </TabContext>
      </Box>
    </Dialog>
  );
};

export default ManageFund;
