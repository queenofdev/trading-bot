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
import { useListingTermDetails } from "../../hooks/use-listing-terms";
import { AppDispatch, RootState } from "../../store";
import { selectListingFromAsset } from "../../store/selectors/listing-selectors";
import { Asset, Listing } from "../../types/backend-types";
import { useGetListingsQuery } from "../../api/backend-api";
import UpdateTerms from "../update-terms/update-terms";
import style from "./borrower-listing-details.module.scss";
import { selectCurrencyByAddress } from "../../store/selectors/currency-selectors";
import { loadCurrencyFromAddress } from "../../store/reducers/currency-slice";
import CancelListing from "../cancel-listing/cancel-listing";
import { formatCurrency } from "@fantohm/shared-helpers";
import { prettifySeconds } from "@fantohm/shared-web3";

export interface BorrowerListingDetailsProps {
  asset: Asset;
  sx?: SxProps<Theme>;
}

export const BorrowerListingDetails = (
  props: BorrowerListingDetailsProps
): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const { user, authSignature } = useSelector((state: RootState) => state.backend);
  const listing: Listing = useSelector((state: RootState) =>
    selectListingFromAsset(state, props.asset)
  );
  const currency = useSelector((state: RootState) =>
    selectCurrencyByAddress(state, listing?.term?.currencyAddress || "")
  );

  useEffect(() => {
    if (!listing?.term?.currencyAddress) return;
    dispatch(loadCurrencyFromAddress(listing.term.currencyAddress));
  }, [listing?.term?.currencyAddress]);

  useGetListingsQuery(
    {
      skip: 0,
      take: 50,
      contractAddress: props.asset.assetContractAddress,
      tokenId: props.asset.tokenId,
    },
    { skip: !authSignature || !user.address }
  );

  // calculate repayment totals
  const { repaymentTotal } = useListingTermDetails(listing);

  // update term
  const [dialogUpdateTermsOpen, setDialogUpdateTermsOpen] = useState(false);
  const onDialogUpdateTermsOpen = useCallback(() => {
    setDialogUpdateTermsOpen(true);
  }, []);

  const onDialogUpdateTermsClose = (accepted: boolean) => {
    setDialogUpdateTermsOpen(false);
  };

  // close listing
  const [dialogCancelListingOpen, setDialogCancelListingOpen] = useState(false);
  const onDialogCancelListingOpen = useCallback(() => {
    setDialogCancelListingOpen(true);
  }, []);

  const onDialogCancelListingClose = (accepted: boolean) => {
    setDialogCancelListingOpen(false);
  };

  if (typeof listing?.term === "undefined") {
    return <h3>Loading...</h3>;
  }

  return (
    <Container sx={props.sx}>
      <UpdateTerms
        onClose={onDialogUpdateTermsClose}
        open={dialogUpdateTermsOpen}
        listing={listing}
      />
      <CancelListing
        onClose={onDialogCancelListingClose}
        open={dialogCancelListingOpen}
        listing={listing}
      />
      <Paper>
        <Box className="flex fr fj-sa fw">
          <Box className="flex fc">
            <Typography className={style["label"]}>Loan amount</Typography>
            <Typography
              className={`${style["data"]}`}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <img
                src={currency.icon}
                style={{ width: "20px", height: "20px", marginRight: "7px" }}
                alt=""
              />
              <Tooltip
                title={
                  !!currency &&
                  currency?.lastPrice &&
                  "~" &&
                  (listing.term.amount * currency?.lastPrice).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
                }
              >
                <Typography component="span">
                  {formatCurrency(
                    listing.term.amount,
                    Number(currency?.lastPrice) < 1.1 ? 2 : 5
                  ).replace("$", "")}
                </Typography>
              </Tooltip>
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>Repayment</Typography>
            <Typography
              className={`${style["data"]} ${style["primary"]}`}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <img
                src={currency.icon}
                style={{ width: "20px", height: "20px", marginRight: "7px" }}
                alt=""
              />
              <Tooltip
                title={
                  !!currency &&
                  currency?.lastPrice &&
                  "~" &&
                  (repaymentTotal * currency?.lastPrice).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
                }
              >
                <Typography component="span">
                  {formatCurrency(
                    repaymentTotal,
                    Number(currency?.lastPrice) < 1.1 ? 2 : 5
                  ).replace("$", "")}
                </Typography>
              </Tooltip>
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>Duration</Typography>
            <Typography className={`${style["data"]}`}>
              {prettifySeconds(listing.term.duration * 86400, "day")}
            </Typography>
          </Box>
          <Box className="flex fc">
            <Typography className={style["label"]}>APR</Typography>
            <Typography className={`${style["data"]}`}>{listing.term.apr}%</Typography>
          </Box>
          <Box className="flex fc" sx={{ mt: { xs: "10px", md: "0" } }}>
            <Button
              variant="contained"
              onClick={onDialogUpdateTermsOpen}
              style={{ backgroundColor: "#374fff" }}
            >
              Update Terms
            </Button>
          </Box>
          <Box className="flex fc" sx={{ mt: { xs: "10px", md: "0" } }}>
            <Button variant="outlined" onClick={onDialogCancelListingOpen}>
              Cancel Listing
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default BorrowerListingDetails;
