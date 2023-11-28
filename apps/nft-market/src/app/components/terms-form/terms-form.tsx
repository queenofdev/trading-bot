import {
  checkErc20Allowance,
  checkNftPermission,
  loadPlatformFee,
  networks,
  requestErc20Allowance,
  requestNftPermission,
  selectErc20AllowanceByAddress,
  selectErc20BalanceByAddress,
  useWeb3Context,
} from "@fantohm/shared-web3";
import { formatCurrency, formatDateTimeString } from "@fantohm/shared-helpers";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { AppDispatch, RootState } from "../../store";
import { BaseSyntheticEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "./terms-form.module.scss";
import {
  Asset,
  AssetStatus,
  Listing,
  Offer,
  OfferStatus,
  Terms,
} from "../../types/backend-types";
import { createListing, updateListing } from "../../store/reducers/listing-slice";
import { selectNftPermFromAsset } from "../../store/selectors/wallet-selectors";
import { signTerms } from "../../helpers/signatures";
import {
  useCreateOfferMutation,
  useGetNftPriceQuery,
  useUpdateTermsMutation,
} from "../../api/backend-api";
import { BigNumber, ethers } from "ethers";
import { addAlert } from "../../store/reducers/app-slice";
import {
  currencyInfo,
  Erc20Currency,
  getSymbolFromAddress,
} from "../../helpers/erc20Currency";
import { desiredNetworkId } from "../../constants/network";
import {
  selectCurrencies,
  selectCurrencyById,
} from "../../store/selectors/currency-selectors";
import { loadCurrencyFromId } from "../../store/reducers/currency-slice";
import ConfirmDialog from "../confirm-modal/confirm-dialog";

export interface TermsFormProps {
  type: "offer" | "borrow";
  asset: Asset;
  listing?: Listing;
  offerTerm?: Terms | null;
  isEdit?: boolean;
  onClose: (value: boolean) => void;
}

export type TermTypes = {
  [key: string]: number;
};

export const termTypes: TermTypes = {
  days: 1,
  weeks: 7,
  months: 30,
};

export const TermsForm = (props: TermsFormProps): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const { address, chainId, provider } = useWeb3Context();
  const currentTerm = props?.offerTerm ? props?.offerTerm : props?.listing?.term;
  const { data: nftPrices } = useGetNftPriceQuery({
    collection: props.asset.assetContractAddress,
    tokenId: props.asset.tokenId,
  });
  const currencies = useSelector((state: RootState) => selectCurrencies(state));
  const estimatedPrice = nftPrices?.reduce((acc, cur) => {
    return acc < parseFloat(cur.priceInUsd) ? parseFloat(cur.priceInUsd) : acc;
  }, 0);
  const preFillPrice = (estimatedPrice || 0) * 0.9;
  const maxFillPrice = (estimatedPrice || 0) * 1.5;

  // update term backend api call
  const [
    updateTerms,
    {
      isLoading: isTermsUpdateLoading,
      data: updateTermsResponse,
      reset: updateTermsReset,
    },
  ] = useUpdateTermsMutation();

  const calcDurationType = (totaldays: number) => {
    if (totaldays === 0) return "days";
    if (totaldays % 7 === 0) {
      return "weeks";
    } else if (totaldays % 30 === 0) {
      return "months";
    }
    return "days";
  };

  const calcDuration = (durationDay: number, exactType: string) => {
    return durationDay / termTypes[exactType];
  };
  // primary form pending state
  const [isPending, setIsPending] = useState(false);
  // primary term variables
  const [duration, setDuration] = useState(
    currentTerm?.duration != null
      ? calcDuration(currentTerm?.duration, calcDurationType(currentTerm?.duration))
      : "30"
  );
  const [durationType, setDurationType] = useState(
    currentTerm?.duration ? calcDurationType(currentTerm?.duration) : "days"
  );
  const [apr, setApr] = useState(
    currentTerm?.apr != null ? currentTerm?.apr.toString() : "25"
  );
  const [amount, setAmount] = useState(currentTerm?.amount.toString() || "1");
  const [repaymentAmount, setRepaymentAmount] = useState(2500);
  const [selectedCurrency, setSelectedCurrency] = useState(
    props.listing ? getSymbolFromAddress(currentTerm?.currencyAddress || "") : "wETH"
  );
  const [confirmOpen, setConfirmOpen] = useState(false);

  // currency info
  const currency = useSelector((state: RootState) =>
    selectCurrencyById(state, `${selectedCurrency.toUpperCase()}_ADDRESS`)
  );

  const currencyBalance = useSelector((state: RootState) =>
    selectErc20BalanceByAddress(state, currency?.currentAddress)
  );

  useEffect(() => {
    dispatch(loadCurrencyFromId(`${selectedCurrency.toUpperCase()}_ADDRESS`));
  }, [selectedCurrency]);

  // create offer api call
  const [
    createOffer,
    {
      isLoading: isCreateOfferLoading,
      data: createOfferResponse,
      reset: createOfferReset,
    },
  ] = useCreateOfferMutation();
  // select logged in user
  const { user } = useSelector((state: RootState) => state.backend);
  // nft permission status updates from state
  const {
    checkPermStatus,
    requestPermStatus,
    checkErc20AllowanceStatus,
    requestErc20AllowanceStatus,
    platformFees,
  } = useSelector((state: RootState) => state.wallet);
  // select perm status for this asset from state
  const hasPermission = useSelector((state: RootState) =>
    selectNftPermFromAsset(state, props.asset)
  );

  // select the USDB allowance provided to lending contract for this address
  const erc20Allowance = useSelector((state: RootState) =>
    selectErc20AllowanceByAddress(state, {
      walletAddress: address,
      erc20TokenAddress: currency?.currentAddress || "",
    })
  );

  const amountGwei = useMemo(() => {
    const [integerPart, decimalPart] = amount.split(".");
    if (
      currency?.decimals &&
      decimalPart?.length &&
      decimalPart?.length > currency?.decimals
    ) {
      return ethers.utils.parseUnits(
        integerPart + "." + decimalPart.substring(0, currency?.decimals),
        currency?.decimals
      );
    } else {
      return ethers.utils.parseUnits(amount.toString() || "0", currency?.decimals);
    }
  }, [amount, currency.symbol]);

  const platformFeeAmtGwei: BigNumber = useMemo(() => {
    if (!platformFees[currency?.currentAddress]) return ethers.BigNumber.from(0);
    return BigNumber.from(platformFees[currency?.currentAddress])
      .mul(amountGwei)
      .div(10000);
  }, [currency?.currentAddress, amountGwei, platformFees]);

  const insufficientBalance = useMemo(() => {
    return (
      currencyBalance &&
      amountGwei &&
      platformFeeAmtGwei &&
      currencyBalance.lt(amountGwei.add(platformFeeAmtGwei))
    );
  }, [currencyBalance, amountGwei, platformFeeAmtGwei]);

  // when a user connects their wallet login to the backend api
  useEffect(() => {
    if (provider && address && currency && currency?.currentAddress) {
      dispatch(
        loadPlatformFee({
          networkId: desiredNetworkId,
          address,
          currencyAddress: currency?.currentAddress,
        })
      );
    }
  }, [provider, address, currency?.currentAddress]);

  // request permission to access the NFT from the contract
  const handlePermissionRequest = useCallback(() => {
    if (chainId && address && props.asset.assetContractAddress && provider) {
      setIsPending(true);
      dispatch(
        requestNftPermission({
          networkId: chainId,
          provider,
          walletAddress: address,
          assetAddress: props.asset.assetContractAddress,
          tokenId: props.asset.tokenId,
        })
      );
    } else {
      console.warn("unable to process permission request");
    }
  }, [chainId, address, props.asset.assetContractAddress]);

  // check the contract to see if we have perms already
  useEffect(() => {
    if (chainId && address && props.asset.assetContractAddress && provider && isOwner) {
      dispatch(
        checkNftPermission({
          networkId: chainId,
          provider,
          walletAddress: address,
          assetAddress: props.asset.assetContractAddress,
          tokenId: props.asset.tokenId,
        })
      );
    }
  }, [chainId, address, props.asset.assetContractAddress]);

  // check to see if we have an approval for the amount required for this txn
  useEffect(() => {
    if (user.address && provider && currency && !erc20Allowance) {
      dispatch(
        checkErc20Allowance({
          networkId: desiredNetworkId,
          provider,
          walletAddress: user.address,
          assetAddress: currency.currentAddress,
        })
      );
    }
  }, [user.address, provider, currency, erc20Allowance]);

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

  const isOwner = useMemo(() => {
    return address.toLowerCase() === props.asset?.owner?.address.toLowerCase();
  }, [props.asset, address]);

  const handleCreateListing = async () => {
    if (!provider || !chainId) return;
    if (maxFillPrice && Number(amount) * currency.lastPrice > maxFillPrice) {
      dispatch(
        addAlert({
          message: "Can't set more than 150% of nft price.",
          severity: "error",
        })
      );
      return;
    }
    // send listing data to backend
    let asset: Asset;
    if (props.asset.status === AssetStatus.New) {
      asset = { ...props.asset, owner: user };
    } else {
      asset = { ...props.asset, status: AssetStatus.Listed };
    }
    const expirationAt = new Date(Date.now() + 86400 * 1000 * 7);
    // const message =
    //   "Please sign this transaction to post your NFT as collateral. This won't incur a gas fee.";
    const term: Terms = {
      amount: Number(amount),
      apr: Number(apr),
      duration: termTypes[durationType] * Number(duration),
      expirationAt: expirationAt.toISOString(),
      signature: "",
      currencyAddress: currency?.currentAddress,
    };
    try {
      setIsPending(true);
      term.signature = await signTerms(
        provider,
        asset.owner?.address || "",
        chainId,
        asset.assetContractAddress,
        asset.tokenId,
        term,
        currency,
        dispatch
      );
      if (!term.signature || term.signature === "") {
        props.onClose(true);
        return;
      }

      const result: any = await dispatch(createListing({ term, asset })).unwrap();
      if (result?.response) {
        if (result?.response?.status === 403) {
          dispatch(
            addAlert({
              message:
                "Failed to list this asset because your signature is expired or invalid.",
              severity: "error",
            })
          );
        } else {
          dispatch(
            addAlert({ message: result?.response?.data.message, severity: "error" })
          );
        }
      } else {
        dispatch(addAlert({ message: "This asset is listed." }));
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsPending(false);
      props.onClose(true);
    }
    return;
  };

  const handleUpdateTerms = async () => {
    if (!provider || !chainId || !props.listing) return;
    // send listing data to backend
    let asset: Asset;
    if (props.asset.status === AssetStatus.New) {
      asset = { ...props.asset, owner: user };
    } else {
      asset = props.asset;
    }
    const expirationAt = new Date(Date.now() + 86400 * 1000 * 7);
    const term: Terms = {
      ...currentTerm,
      amount: Number(amount),
      apr: Number(apr),
      duration: termTypes[durationType] * Number(duration),
      expirationAt: expirationAt.toISOString(),
      signature: "",
      currencyAddress: currency?.currentAddress,
    };
    try {
      setIsPending(true);
      term.signature = await signTerms(
        provider,
        asset.owner?.address || "",
        chainId,
        asset.assetContractAddress,
        asset.tokenId,
        term,
        currency,
        dispatch
      );
      if (!term.signature || term.signature === "") {
        props.onClose(true);
        return;
      }
      const result: any = await updateTerms(term);
      if (result?.error) {
        if (result?.error?.status === 403) {
          dispatch(
            addAlert({
              message:
                "Failed to update a term because your signature is expired or invalid.",
              severity: "error",
            })
          );
        } else {
          dispatch(addAlert({ message: result?.error?.data.message, severity: "error" }));
        }
      } else {
        dispatch(addAlert({ message: "Terms have been updated." }));
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsPending(false);
      props.onClose(true);
    }
    return;
  };

  useEffect(() => {
    if (
      !isTermsUpdateLoading &&
      typeof updateTermsResponse !== "undefined" &&
      props.listing
    ) {
      dispatch(updateListing({ ...props.listing, term: updateTermsResponse }));
    }
    if (!isTermsUpdateLoading && updateTermsResponse) {
      updateTermsReset();
      props.onClose(true);
    }
  }, [isTermsUpdateLoading, updateTermsResponse, props.listing]);

  const handleDurationChange = (event: BaseSyntheticEvent) => {
    const re = /^[0-9\b]+$/;
    if (event.target.value === "" || re.test(event.target.value)) {
      setDuration(event.target.value);
    }
  };

  const handleDurationTypeChange = (event: SelectChangeEvent) => {
    if (!["days", "weeks", "months"].includes(event.target.value)) {
      console.warn("invalid duration type");
      return;
    }
    setDurationType(event.target.value);
  };

  const handleAprChange = (event: BaseSyntheticEvent) => {
    setApr(event.target.value);
  };

  const handleAmountChange = (newAmount: string) => {
    const [integerPart, decimalPart] = newAmount.split(".");
    if (
      currency?.decimals &&
      decimalPart?.length &&
      decimalPart?.length > currency?.decimals
    ) {
      setAmount(integerPart + "." + decimalPart.substring(0, currency?.decimals));
    } else {
      setAmount(newAmount);
    }
  };

  useEffect(() => {
    if (!currency) {
      return;
    }
    const match: [string, Erc20Currency] | undefined = Object.entries(currencies).find(
      ([, entryCurrency]) =>
        entryCurrency.currentAddress.toLowerCase() ===
        currentTerm?.currencyAddress.toLowerCase()
    );
    const currentCurrencyPrice = match ? match[1]?.lastPrice : 1;
    if (
      currency.currentAddress.toLowerCase() === currentTerm?.currencyAddress.toLowerCase()
    ) {
      handleAmountChange(
        (
          (Number(currentTerm?.amount) * currentCurrencyPrice) /
          currency.lastPrice
        ).toString()
      );
    } else {
      if (props?.offerTerm) {
        handleAmountChange(
          (
            (Number(currentTerm?.amount) * currentCurrencyPrice) /
            currency.lastPrice
          ).toString()
        );
      } else if (preFillPrice) {
        handleAmountChange((preFillPrice / currency.lastPrice).toString());
      }
    }
  }, [currency]);

  // calculate repayment totals
  useEffect(() => {
    const wholePercent =
      ((termTypes[durationType] * Number(duration)) / 365) * Number(apr);
    const realPercent = wholePercent / 100;
    const _repaymentAmount = Number(amount) * realPercent;
    setRepaymentAmount(_repaymentAmount);
    //setRepaymentTotal(_repaymentAmount + amount);
  }, [durationType, duration, amount, apr]);

  // make offer logic
  const handleMakeOffer = async () => {
    if (!props.listing || !provider || !props.asset.owner) return;
    const expirationAt = new Date(Date.now() + 86400 * 1000 * 7);
    const { id, ...listingTerm } = props.listing.term;
    const preSigTerm: Terms = {
      ...listingTerm,
      amount: Number(amount),
      duration: termTypes[durationType] * Number(duration),
      apr: Number(apr),
      expirationAt: expirationAt.toISOString(),
      signature: "",
      currencyAddress: currency?.currentAddress,
    };

    try {
      setIsPending(true);
      const signature = await signTerms(
        provider,
        props.listing.asset.wallet || "",
        desiredNetworkId,
        props.asset.assetContractAddress,
        props.asset.tokenId,
        preSigTerm,
        currency,
        dispatch
      );
      if (!signature || signature === "") {
        props.onClose(true);
        return;
      }
      const term: Terms = {
        ...preSigTerm,
        signature,
      };

      const offer: Offer = {
        lender: user,
        assetListing: props.listing,
        term,
        status: OfferStatus.Ready,
      };
      const result: any = await createOffer(offer);
      if (result?.error) {
        if (result?.error?.status === 403) {
          dispatch(
            addAlert({
              message:
                "Failed to send an offer because your signature is expired or invalid.",
              severity: "error",
            })
          );
        } else {
          dispatch(addAlert({ message: result?.error?.data.message, severity: "error" }));
        }
      } else {
        dispatch(addAlert({ message: "Offer sent." }));
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsPending(false);
      props.onClose(true);
    }
    props.onClose(true);
  };

  useEffect(() => {
    if (!isCreateOfferLoading && !!createOfferResponse) {
      createOfferReset();
      props.onClose(true);
    }
  }, [isCreateOfferLoading, createOfferResponse]);

  // request allowance necessary to create loan with these term
  const handleRequestAllowance = useCallback(() => {
    if (provider && address && props.listing) {
      setIsPending(true);

      let approveAmounts;
      if (
        currency.currentAddress === networks[desiredNetworkId].addresses["USDT_ADDRESS"]
      ) {
        approveAmounts = ethers.constants.MaxUint256;
      } else {
        approveAmounts = ethers.utils.parseUnits(
          (Number(amount) * (1 + platformFees[currency?.currentAddress])).toString(),
          currency.decimals
        );
      }

      dispatch(
        requestErc20Allowance({
          networkId: desiredNetworkId,
          provider,
          walletAddress: address,
          assetAddress: currency?.currentAddress,
          amount: approveAmounts,
        })
      );
    }
  }, [chainId, address, amount, provider, currency, platformFees]);

  const handleCurrencyChange = (event: SelectChangeEvent<string>) => {
    setSelectedCurrency(event.target.value);
  };

  return (
    <Box className={`flex fc ${style["makeOfferForm"]}`} sx={{ padding: "1em" }}>
      <Box className="flex fc">
        <Typography sx={{ color: "#aaaaaa", mb: "0.5em" }}>
          How much would you like to {props.type || "borrow"}?
        </Typography>
        <Box className={`flex fr ai-c ${style["valueContainer"]}`}>
          <Box className={`flex fr ai-c ${style["leftSide"]}`}>
            <Select
              value={currency?.symbol}
              onChange={handleCurrencyChange}
              variant="standard"
              sx={{ background: "transparent" }}
              className="borderless"
            >
              {Object.entries(currencyInfo).map(([tokenId, currencyDetails]) => {
                // Hide usdb
                if (tokenId.toLowerCase() === "usdb_address") {
                  return null;
                }
                return (
                  <MenuItem
                    value={currencyDetails.symbol}
                    key={`currency-option-item-${tokenId}`}
                  >
                    <Box className="flex fr ai-c">
                      <img
                        style={{ height: "28px", width: "28px", marginRight: "5px" }}
                        src={currencyDetails.icon}
                        alt={`${currencyDetails.symbol} Token Icon`}
                      />
                      {currencyDetails.symbol}
                    </Box>
                  </MenuItem>
                );
              })}
            </Select>
          </Box>
          <Box className={`flex fr ${style["rightSide"]}`}>
            <TextField
              type="number"
              value={amount}
              onChange={(e: BaseSyntheticEvent) => handleAmountChange(e.target.value)}
              variant="standard"
              InputProps={{
                disableUnderline: true,
              }}
            />
            <Typography className={style["amountField"]}>
              {!!currency && formatCurrency(Number(amount) * currency?.lastPrice, 2)}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box className="flex fc" sx={{ my: "1em" }}>
        <Box sx={{ display: "flex" }}>
          <Typography sx={{ color: "#aaaaaa", mb: "0.5em" }}>
            Set loan duration
          </Typography>
          <Typography sx={{ color: "#aaaaaa", mb: "0.5em" }}>
            &nbsp;(Minimum Duration is 1 day)
          </Typography>
        </Box>
        <Box className={`flex fr ${style["valueContainer"]}`}>
          <Box className={`flex fr ai-c ${style["leftSide"]}`}>
            <Select
              value={durationType}
              onChange={handleDurationTypeChange}
              variant="standard"
              sx={{ background: "transparent" }}
              className="borderless"
            >
              <MenuItem value="days">Days</MenuItem>
              <MenuItem value="weeks">Weeks</MenuItem>
              <MenuItem value="months">Months</MenuItem>
            </Select>
          </Box>
          <Box className={`flex fr fj-fs ${style["rightSide"]}`}>
            <TextField
              value={duration}
              type="number"
              onChange={handleDurationChange}
              variant="standard"
              InputProps={{
                disableUnderline: true,
              }}
            />
          </Box>
        </Box>
      </Box>
      <Box className="flex fc" sx={{ mt: "1em", mb: "2em" }}>
        <Box className="flex fj-sb" sx={{ color: "#aaaaaa", mb: "0.5em" }}>
          <Typography>Set repayment APR</Typography>
          <Typography className={style["inputHelper"]}>Repayment Amount:</Typography>
        </Box>
        <Box className={`flex fr ${style["valueContainer"]}`}>
          <Box className={`flex fr ai-c ${style["leftSide"]}`}>APR</Box>
          <Box className={`flex fr ${style["rightSide"]}`}>
            <Box className="flex fr" component="div">
              <TextField
                value={apr}
                type="number"
                onChange={handleAprChange}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                }}
              />
            </Box>
            <Box
              className={`flex ai-c ${style["amountField"]}`}
              sx={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                color: "#aaaaaa",
                width: "150px",
                paddingLeft: "10px",
                marginRight: "auto",
              }}
            >
              {formatCurrency(repaymentAmount * currency?.lastPrice, 2)}
            </Box>
          </Box>
        </Box>
      </Box>
      {isOwner && !hasPermission && !isPending && (
        <Button
          variant="contained"
          onClick={handlePermissionRequest}
          disabled={!amount || !duration || amount === "0" || duration === "0" || !apr}
        >
          Allow Liqd to Access your NFT
        </Button>
      )}
      {isOwner && hasPermission && !isPending && !props.listing && (
        <Button
          variant="contained"
          onClick={handleCreateListing}
          disabled={!amount || !duration || amount === "0" || duration === "0" || !apr}
        >
          Get liquidity
        </Button>
      )}
      {isOwner && hasPermission && !isPending && props.listing && (
        <Button
          variant="contained"
          onClick={handleUpdateTerms}
          disabled={!amount || !duration || amount === "0" || duration === "0" || !apr}
        >
          Update Terms (no cost)
        </Button>
      )}
      {!isOwner && // not owner, making an offer
        !isPending && // no pending actions
        props.listing && // listing exists
        !!erc20Allowance && // has allowance
        typeof platformFees[currency?.currentAddress] !== "undefined" && // has platform fees
        !insufficientBalance && // has sufficient balance
        erc20Allowance.gte(
          ethers.utils.parseUnits(
            (Number(amount) * (1 + platformFees[currency?.currentAddress])).toString(),
            currency?.decimals
          )
        ) && (
          <Button
            variant="contained"
            onClick={() => setConfirmOpen(true)}
            disabled={!amount || !duration || amount === "0" || duration === "0" || !apr}
          >
            {props?.isEdit ? "Edit" : "Make"} Offer
          </Button>
        )}
      {insufficientBalance && !isOwner && !isPending && (
        <Button variant="contained" disabled={true}>
          Insufficient funds
        </Button>
      )}
      {!isOwner &&
        !isPending &&
        props.listing &&
        typeof platformFees[currency?.currentAddress] !== "undefined" &&
        !insufficientBalance &&
        (!erc20Allowance ||
          erc20Allowance.lt(
            ethers.utils.parseUnits(
              (Number(amount) * (1 + platformFees[currency?.currentAddress])).toString(),
              currency.decimals
            )
          )) && (
          <Button
            variant="contained"
            onClick={handleRequestAllowance}
            disabled={!amount || !duration || amount === "0" || duration === "0" || !apr}
          >
            Allow Liqd to Access your {currency?.symbol}
          </Button>
        )}
      {isPending && (
        <Button variant="contained" disabled>
          <CircularProgress size={"1.75em"} />
        </Button>
      )}
      <ConfirmDialog
        title="Confirm Create Offer"
        open={confirmOpen}
        principal={Number(amount)}
        platformfee={(platformFees[currency?.currentAddress] / 10000) * Number(amount)}
        currencySymbol={currency?.symbol}
        interest={repaymentAmount}
        dueDate={formatDateTimeString(
          new Date(Date.now() + 86400 * 1000 * termTypes[durationType] * Number(duration))
        )}
        setOpen={setConfirmOpen}
        onConfirm={props?.isEdit ? handleUpdateTerms : handleMakeOffer}
      ></ConfirmDialog>
    </Box>
  );
};

export default TermsForm;
