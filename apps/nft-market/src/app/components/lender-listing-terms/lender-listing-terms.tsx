import {
  Box,
  Button,
  Container,
  Paper,
  SxProps,
  Theme,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDeleteOfferMutation, useGetAssetQuery } from "../../api/backend-api";
import { loadCurrencyFromAddress } from "../../store/reducers/currency-slice";
import { selectCurrencyByAddress } from "../../store/selectors/currency-selectors";
import { Listing, Offer, OfferStatus } from "../../types/backend-types";
import style from "./lender-listing-terms.module.scss";
import { AppDispatch, RootState } from "../../store";
import { useTermDetails } from "../../hooks/use-term-details";
import { MakeOffer } from "../make-offer/make-offer";
import LoanConfirmation from "../loan-confirmation/loan-confirmation";
import { formatCurrency } from "@fantohm/shared-helpers";
import { prettifySeconds, useWeb3Context } from "@fantohm/shared-web3";
import OfferConfirmDialog from "../offer-confirm-modal/offer-confirm-dialog";
import { addAlert } from "../../store/reducers/app-slice";
import RemoveOfferConfirmDialog from "../remove-offer-confirm-modal/remove-offer-confirm-dialog";

export interface LenderListingTermsProps {
  offers: Offer[];
  listing: Listing;
  sx?: SxProps<Theme>;
}

export function LenderListingTerms(props: LenderListingTermsProps) {
  const dispatch: AppDispatch = useDispatch();
  const { address } = useWeb3Context();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [removeOfferConfirmDialogOpen, setRemoveOfferConfirmDialogOpen] = useState(false);
  const [deleteOffer] = useDeleteOfferMutation();
  // logged in user
  const { authSignature } = useSelector((state: RootState) => state.backend);
  // status that tracks the status of a createLoan contract call
  const currency = useSelector((state: RootState) =>
    selectCurrencyByAddress(state, props.listing.term.currencyAddress)
  );

  const myOffer = props.offers.find(
    (offer) =>
      offer.lender.address.toLowerCase() === address.toLowerCase() &&
      offer.status === OfferStatus.Ready
  );

  // helper to calculate term details like repayment amount
  const { repaymentAmount } = useTermDetails(props.listing.term);

  // query assets from the backend API
  useGetAssetQuery(props.listing.asset.id, {
    skip: !props.listing.asset || !authSignature,
  });

  const onEditOfferDialogClose = () => {
    setEditOfferDialogOpen(false);
  };

  const onEditOfferDialogOpen = () => {
    setEditOfferDialogOpen(true);
  };

  useEffect(() => {
    dispatch(loadCurrencyFromAddress(props.listing.term.currencyAddress));
  }, []);

  // make offer code
  const [createOfferDialogOpen, setCreateOfferDialogOpen] = useState(false);
  const [editOfferDialogOpen, setEditOfferDialogOpen] = useState(false);

  const handleMakeOffer = () => {
    if (!myOffer) {
      setCreateOfferDialogOpen(true);
    } else {
      setConfirmOpen(true);
    }
  };

  const handleDeleteOffer = useCallback(async () => {
    if (!myOffer) {
      return;
    }
    const result: any = await deleteOffer(myOffer);

    if (result?.error) {
      if (result?.error?.status === 403) {
        dispatch(
          addAlert({
            message:
              "Failed to remove an offer because your signature is expired or invalid.",
            severity: "error",
          })
        );
      } else {
        dispatch(addAlert({ message: result?.error?.data.message, severity: "error" }));
      }
    } else {
      dispatch(addAlert({ message: "Offer removed" }));
    }
  }, [myOffer]);

  const onListDialogClose = () => {
    setCreateOfferDialogOpen(false);
  };

  return (
    <Container sx={props.sx} className={style["assetRow"]}>
      <MakeOffer
        onClose={onListDialogClose}
        open={createOfferDialogOpen}
        listing={props.listing}
      />
      {myOffer && (
        <MakeOffer
          onClose={onEditOfferDialogClose}
          open={editOfferDialogOpen}
          /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
          // @ts-ignore
          listing={myOffer.assetListing}
          isEdit={true}
          offerTerm={myOffer.term}
        />
      )}
      <RemoveOfferConfirmDialog
        open={removeOfferConfirmDialogOpen}
        setOpen={setRemoveOfferConfirmDialogOpen}
        onRemove={handleDeleteOffer}
      />
      <OfferConfirmDialog
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onEdit={onEditOfferDialogOpen}
        onRemove={() => setRemoveOfferConfirmDialogOpen(true)}
      ></OfferConfirmDialog>
      <Paper>
        <Box className="flex fr fj-sa fw" sx={{ alignItems: "center" }}>
          <Box className="flex fc">
            <Typography
              className={style["label"]}
              sx={{ color: "#8991A2;", fontSize: "0.875rem" }}
            >
              Loan amount
            </Typography>
            <Box sx={{ display: "flex" }}>
              <img
                src={currency?.icon}
                alt={currency?.symbol}
                style={{ width: "20px", marginRight: "7px" }}
              />
              <Tooltip
                title={
                  !!currency &&
                  currency?.lastPrice &&
                  "~" &&
                  (props.listing.term.amount * currency?.lastPrice).toLocaleString(
                    "en-US",
                    {
                      style: "currency",
                      currency: "USD",
                    }
                  )
                }
              >
                <Typography className={`${style["data"]} ${style["primary"]}`}>
                  {formatCurrency(
                    props.listing.term.amount,
                    Number(currency?.lastPrice) < 1.1 ? 2 : 5
                  ).replace("$", "")}
                </Typography>
              </Tooltip>
            </Box>
          </Box>
          <Box className="flex fc">
            <Typography
              className={style["label"]}
              sx={{ color: "#8991A2;", fontSize: "0.875rem" }}
            >
              Repayment
            </Typography>
            <Box sx={{ display: "flex" }}>
              <img
                src={currency?.icon}
                alt={currency?.symbol}
                style={{ width: "20px", marginRight: "7px" }}
              />
              <Tooltip
                title={
                  !!currency &&
                  currency?.lastPrice &&
                  "~" &&
                  (repaymentAmount * currency?.lastPrice).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
                }
              >
                <Typography className={`${style["data"]}`}>
                  {formatCurrency(
                    repaymentAmount,
                    Number(currency?.lastPrice) < 1.1 ? 2 : 5
                  ).replace("$", "")}
                </Typography>
              </Tooltip>
            </Box>
          </Box>
          <Box className="flex fc">
            <Typography
              className={style["label"]}
              sx={{ color: "#8991A2;", fontSize: "0.875rem" }}
            >
              Duration
            </Typography>
            <Typography className={`${style["data"]}`}>
              {prettifySeconds(props.listing.term.duration * 86400, "day")}
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography
              className={style["label"]}
              sx={{ color: "#8991A2;", fontSize: "0.875rem" }}
            >
              APR
            </Typography>
            <Typography className={`${style["data"]}`}>
              {props.listing.term.apr}%
            </Typography>
          </Box>
          <Box className="flex fc" sx={{ mt: { xs: "10px", md: "0" } }}>
            <LoanConfirmation listing={props.listing} />
          </Box>
          <Box className="flex fc" sx={{ mt: { xs: "10px", md: "0" } }}>
            <Button variant="outlined" onClick={handleMakeOffer}>
              Make Offer
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default LenderListingTerms;
