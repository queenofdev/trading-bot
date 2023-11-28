import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3Context } from "@fantohm/shared-web3";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  Typography,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { AssetStatus, Listing, ListingStatus } from "../../types/backend-types";
import { useUpdateListingMutation } from "../../api/backend-api";
import { AppDispatch, RootState } from "../../store";
import { addAlert } from "../../store/reducers/app-slice";
import style from "./cancel-listing.module.scss";
import { listingCancel } from "../../store/reducers/loan-slice";
import { desiredNetworkId } from "../../constants/network";

export interface CancelListingProps {
  listing: Listing;
  onClose: (value: boolean) => void;
  open: boolean;
}

export const CancelListing = (props: CancelListingProps): JSX.Element => {
  const { onClose, open } = props;

  const dispatch: AppDispatch = useDispatch();
  const { address, chainId, provider } = useWeb3Context();
  // update term backend api call
  const [updateListingApi] = useUpdateListingMutation();
  // primary form pending state
  const [isPending, setIsPending] = useState(false);

  const isOwner = useMemo(() => {
    return address.toLowerCase() === props.listing.asset?.owner?.address.toLowerCase();
  }, [props.listing.asset, address]);

  // nft permission status updates from state
  const {
    checkPermStatus,
    requestPermStatus,
    checkErc20AllowanceStatus,
    requestErc20AllowanceStatus,
  } = useSelector((state: RootState) => state.wallet);

  const handleClose = () => {
    onClose(false);
  };

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

  const handleCancelListing = async () => {
    if (!provider || !chainId || !props.listing) return;
    // send listing data to backend
    setIsPending(true);
    try {
      const listingCancelParams = {
        sig: props?.listing?.term?.signature,
        provider,
        networkId: desiredNetworkId,
      };
      const listingCancelResult = await dispatch(
        listingCancel(listingCancelParams)
      ).unwrap();
      if (!listingCancelResult) {
        setIsPending(false);
        return; //todo: throw nice error
      }
      const cancelledListing = {
        ...props.listing,
        asset: { ...props.listing.asset, status: AssetStatus.Ready },
        status: ListingStatus.Cancelled,
      };

      const result: any = await updateListingApi(cancelledListing);
      if (result?.error) {
        if (result?.error?.status === 403) {
          dispatch(
            addAlert({
              message:
                "Failed to cancel a listing because your signature is expired or invalid.",
              severity: "error",
            })
          );
        } else {
          dispatch(addAlert({ message: result?.error?.data.message, severity: "error" }));
        }
      } else {
        dispatch(addAlert({ message: "Listing has been cancelled." }));
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsPending(false);
      props.onClose(true);
    }
  };

  return (
    <Dialog
      onClose={() => {
        if (!isPending) {
          handleClose();
        }
      }}
      open={open}
      sx={{ padding: "1.5em" }}
      fullWidth
    >
      <Box className="flex fr fj-c">
        <h1 style={{ margin: "0 0 0.5em 0" }}>Cancel listing</h1>
      </Box>
      <Box
        className={`flex fr fj-fe ${style["header"]}`}
        sx={{ position: "absolute", right: "16px" }}
      >
        <IconButton
          disabled={isPending}
          onClick={() => {
            handleClose();
          }}
        >
          <CancelOutlinedIcon />
        </IconButton>
      </Box>
      <Box className={`flex fc ${style["body"]}`} sx={{ borderTop: "1px solid #aaaaaa" }}>
        <Box className="flex fc" sx={{ padding: "1em" }}>
          <Box className="flex fc" sx={{ padding: "1em" }}>
            <Typography>Do you want to cancel listing?</Typography>
          </Box>
          {isOwner && !isPending && props.listing && (
            <Button variant="contained" onClick={handleCancelListing}>
              Cancel Listing
            </Button>
          )}
          {isPending && (
            <Button variant="contained" disabled>
              <CircularProgress />
            </Button>
          )}
        </Box>
      </Box>
    </Dialog>
  );
};

export default CancelListing;
