import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, Box, Button, Chip, CircularProgress, Tooltip } from "@mui/material";
import { PaperTableCell, PaperTableRow } from "@fantohm/shared-ui-themes";
import { addressEllipsis, formatCurrency } from "@fantohm/shared-helpers";
import { useTermDetails } from "../../hooks/use-term-details";
import {
  AssetStatus,
  ListingStatus,
  Loan,
  LoanStatus,
  Offer,
  OfferStatus,
} from "../../types/backend-types";
import {
  useCreateLoanMutation,
  useUpdateLoanMutation,
  useUpdateOfferMutation,
  useDeleteOfferMutation,
  useResetPartialLoanMutation,
} from "../../api/backend-api";
import { useDispatch, useSelector } from "react-redux";
import store, { RootState } from "../../store";
import { selectNftPermFromAsset } from "../../store/selectors/wallet-selectors";
import { contractCreateLoan } from "../../store/reducers/loan-slice";
import {
  requestNftPermission,
  useWeb3Context,
  checkNftPermission,
  prettifySeconds,
  getLendingAddressConfig,
} from "@fantohm/shared-web3";
import style from "./offers-list.module.scss";
import SimpleProfile from "../simple-profile/simple-profile";
import { OffersListFields } from "./offers-list";
import ArrowUpRight from "../../../assets/icons/arrow-right-up.svg";
import { desiredNetworkId } from "../../constants/network";
import { selectCurrencyByAddress } from "../../store/selectors/currency-selectors";
import { loadCurrencyFromAddress } from "../../store/reducers/currency-slice";
import { addAlert } from "../../store/reducers/app-slice";
import MakeOffer from "../make-offer/make-offer";
import RemoveOfferConfirmDialog from "../remove-offer-confirm-modal/remove-offer-confirm-dialog";
import previewNotAvailableDark from "../../../assets/images/preview-not-available-dark.png";
import previewNotAvailableLight from "../../../assets/images/preview-not-available-light.png";

export type OfferListItemProps = {
  offer: Offer;
  fields?: OffersListFields[];
};

type AppDispatch = typeof store.dispatch;

export const OfferListItem = ({ offer, fields }: OfferListItemProps): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const themeType = useSelector((state: RootState) => state.theme.mode);
  const [isPending, setIsPending] = useState(false);
  const [isRequestingPerms, setIsRequestingPerms] = useState(false);
  const { user } = useSelector((state: RootState) => state.backend);
  const { loanCreationStatus } = useSelector((state: RootState) => state.loans);
  const { address: walletAddress, provider } = useWeb3Context();
  const { repaymentTotal, repaymentAmount } = useTermDetails(offer.term);
  const currency = useSelector((state: RootState) =>
    selectCurrencyByAddress(state, offer.term.currencyAddress)
  );

  useEffect(() => {
    dispatch(loadCurrencyFromAddress(offer.term.currencyAddress));
  }, [offer]);

  // create loan backend api call
  const [createLoan, { isLoading: isCreating, reset: resetCreateLoan }] =
    useCreateLoanMutation();
  const [updateLoan, { isLoading: isUpdating, reset: resetUpdateLoan }] =
    useUpdateLoanMutation();
  const [resetPartialLoan] = useResetPartialLoanMutation();

  const [updateOffer, { isLoading: isUpdatingOffer }] = useUpdateOfferMutation();
  const [deleteOffer, { isLoading: isDeletingOffer }] = useDeleteOfferMutation();

  // nft permission status updates from state
  const { requestPermStatus } = useSelector((state: RootState) => state.wallet);

  const asset = useMemo(() => offer?.assetListing?.asset, [offer]);

  // select perm status for this asset from state
  const hasPermission = useSelector((state: RootState) =>
    selectNftPermFromAsset(state, offer?.assetListing?.asset)
  );

  // is the user the owner of the asset?
  const isOwner = useMemo(() => {
    if (!user.address || !asset.owner?.address) return false;
    return user.address.toLowerCase() === asset?.owner?.address.toLowerCase();
  }, [asset, user]);

  const isMyOffer = useMemo(() => {
    if (!user.address) return false;
    return user.address.toLowerCase() === offer?.lender?.address.toLowerCase();
  }, [user]);

  // update offer dialog
  const [makeOfferDialogOpen, setMakeOfferDialogOpen] = useState(false);
  const [removeOfferConfirmDialogOpen, setRemoveOfferConfirmDialogOpen] = useState(false);

  const handleUpdateOffer = () => {
    setMakeOfferDialogOpen(true);
  };

  const onDialogClose = () => {
    setMakeOfferDialogOpen(false);
  };

  useEffect(() => {
    if (
      isUpdatingOffer ||
      isDeletingOffer ||
      isCreating ||
      isUpdating ||
      requestPermStatus === "loading" ||
      loanCreationStatus === "loading"
    ) {
      setIsPending(true);
    } else {
      setIsPending(false);
    }
  }, [
    isUpdatingOffer,
    isDeletingOffer,
    isCreating,
    requestPermStatus,
    loanCreationStatus,
    isUpdating,
  ]);

  // check the contract to see if we have perms already
  useEffect(() => {
    if (offer.assetListing.asset.assetContractAddress && provider) {
      dispatch(
        checkNftPermission({
          networkId: desiredNetworkId,
          provider,
          walletAddress: user.address,
          assetAddress: offer.assetListing.asset.assetContractAddress,
          tokenId: offer.assetListing.asset.tokenId,
        })
      );
    }
  }, [offer]);

  const handleRequestPermission = useCallback(async () => {
    // create the loan
    if (!hasPermission && provider) {
      setIsRequestingPerms(true);
      setIsPending(true);
      await dispatch(
        requestNftPermission({
          networkId: desiredNetworkId,
          provider,
          assetAddress: offer.assetListing.asset.assetContractAddress,
          walletAddress,
          tokenId: offer.assetListing.asset.tokenId,
        })
      );
      setIsPending(false);
    }
  }, [offer.id, provider, hasPermission]);

  // automatically trigger accept offer after setting up perms
  useEffect(() => {
    if (isRequestingPerms && requestPermStatus !== "loading") {
      handleAcceptOffer().then();
    }
  }, [requestPermStatus, isRequestingPerms]);

  const handleAcceptOffer = useCallback(async () => {
    // create the loan
    if (!hasPermission || !provider || !asset.owner) {
      console.warn("You must first provide permission to your NFT");
      return;
    }
    setIsPending(true);

    const createLoanRequest: Loan = {
      lender: offer.lender,
      borrower: asset.owner,
      assetListing: {
        ...offer.assetListing,
        status: ListingStatus.Completed,
        asset: { ...asset, status: AssetStatus.Locked },
      },
      lendingContractAddress: getLendingAddressConfig(desiredNetworkId).currentVersion,
      term: offer.term,
      status: LoanStatus.Active,
      offerId: offer.id,
    };

    const createLoanParams = {
      loan: createLoanRequest,
      provider,
      networkId: desiredNetworkId,
      currencyAddress: offer.term.currencyAddress,
    };
    let createLoanResult: any;
    try {
      createLoanResult = await createLoan(createLoanRequest);
      if (!createLoanResult || (createLoanResult && createLoanResult?.error)) {
        if (createLoanResult?.error?.status === 403) {
          dispatch(
            addAlert({
              message:
                "Failed to create a loan because your signature is expired or invalid.",
              severity: "error",
            })
          );
        } else {
          dispatch(
            addAlert({
              message: createLoanResult?.error?.data.message,
              severity: "error",
            })
          );
        }
        return;
      }
      const createLoanContractResult = await dispatch(
        contractCreateLoan(createLoanParams)
      ).unwrap();

      if (!createLoanContractResult) {
        setIsPending(false);
        resetCreateLoan();
        resetPartialLoan(createLoanResult?.data?.id || "");
        return; //todo: throw nice error
      }

      createLoanRequest.contractLoanId = createLoanContractResult as number;
      createLoanRequest.id = createLoanResult?.data?.id;
      await updateLoan(createLoanRequest).unwrap();

      resetUpdateLoan();
      dispatch(
        addAlert({
          message:
            "Loan Created. NFT Has been transferred to escrow, and funds transferred to borrower.",
        })
      );
    } catch (e: any) {
      if (e?.data?.message) {
        dispatch(
          addAlert({
            message: e?.data?.message,
            severity: "error",
          })
        );
      }
      if (createLoanResult?.data) {
        resetPartialLoan(createLoanResult?.data?.id);
      }
    } finally {
      setIsPending(false);
    }
  }, [offer.id, offer.term, offer.assetListing, provider, hasPermission]);

  const handleRejectOffer = useCallback(async () => {
    try {
      const result: any = await updateOffer({
        ...offer,
        status: OfferStatus.Rejected,
      });
      if (result?.error) {
        if (result?.error?.status === 403) {
          dispatch(
            addAlert({
              message: "Failed to reject an offer.",
              severity: "error",
            })
          );
        } else {
          dispatch(addAlert({ message: result?.error?.data.message, severity: "error" }));
        }
      } else {
        dispatch(addAlert({ message: "Offer rejected" }));
      }
    } catch (e) {
      console.log(e);
    }
  }, [offer.id]);

  const handleDeleteOffer = useCallback(async () => {
    try {
      const result: any = await deleteOffer(offer);
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
    } catch (e) {
      console.log(e);
    }
  }, [offer.id]);

  const offerExpires = useMemo(() => {
    const offerDateTime = new Date(offer.term.expirationAt);
    const expiresInSeconds = offerDateTime.getTime() - Date.now();
    const prettyTime = prettifySeconds(expiresInSeconds / 1000);
    return prettyTime !== "Instant" ? prettyTime : "Expired";
  }, [offer.term]);

  const offerCreatedSecondsAgo = useMemo(() => {
    if (!offer.createdAt) return 0;
    const offerDateTime = new Date(offer.createdAt);
    const createdAgo = Date.now() - offerDateTime.getTime();
    return prettifySeconds(createdAgo / 1000);
  }, [offer.term]);

  const getFieldData = (field: OffersListFields): JSX.Element | string => {
    switch (field) {
      case OffersListFields.LENDER_PROFILE:
        return <SimpleProfile address={offer.lender.address} />;
      case OffersListFields.LENDER_ADDRESS:
        return (
          <a href={`https://etherscan.io/address/${offer.lender.address}`}>
            {offer.lender.address.toLowerCase() === user.address.toLowerCase() ? (
              "You"
            ) : (
              <Box>
                {addressEllipsis(offer.lender.address)}{" "}
                <img
                  src={ArrowUpRight}
                  alt="arrow pointing up and to the right"
                  style={{ height: "16px", width: "16px" }}
                />
              </Box>
            )}
          </a>
        );
      case OffersListFields.BORROWER_ADDRESS:
        return (
          <a
            href={`https://etherscan.io/address/${offer.assetListing.asset?.owner.address}`}
          >
            {offer.assetListing.asset?.owner.address.toLowerCase() ===
            user.address.toLowerCase() ? (
              "You"
            ) : (
              <Box>
                {addressEllipsis(offer.assetListing.asset?.owner.address)}{" "}
                <img
                  src={ArrowUpRight}
                  alt="arrow pointing up and to the right"
                  style={{ height: "16px", width: "16px" }}
                />
              </Box>
            )}
          </a>
        );
      case OffersListFields.OWNER_PROFILE:
        return <SimpleProfile address={offer.lender.address} />;
      case OffersListFields.REPAYMENT_TOTAL:
        return (
          <Box sx={{ display: "flex" }}>
            <Tooltip title={currency?.name || ""}>
              <img
                src={currency?.icon || ""}
                alt={currency?.symbol || ""}
                style={{
                  height: "20px",
                  width: "20px",
                  marginRight: "5px",
                  marginBottom: "4px",
                }}
              />
            </Tooltip>
            <Tooltip
              title={`~ ${formatCurrency(repaymentTotal * currency?.lastPrice || 0, 2)}`}
            >
              <span>{repaymentTotal.toFixed(4)} </span>
            </Tooltip>
          </Box>
        );
      case OffersListFields.PRINCIPAL:
        return (
          <Box sx={{ display: "flex" }}>
            <Tooltip title={currency?.name || ""}>
              <img
                src={currency?.icon || ""}
                alt={currency?.symbol || ""}
                style={{
                  height: "20px",
                  width: "20px",
                  marginRight: "5px",
                  marginBottom: "4px",
                }}
              />
            </Tooltip>
            <Tooltip
              title={`~ ${formatCurrency(
                offer.term.amount * currency?.lastPrice || 0,
                2
              )}`}
            >
              <span>{offer.term.amount.toFixed(4)} </span>
            </Tooltip>
          </Box>
        );
      case OffersListFields.TOTAL_INTEREST:
        return (
          <Box sx={{ display: "flex" }}>
            <Tooltip title={currency?.name || ""}>
              <img
                src={currency?.icon || ""}
                alt={currency?.symbol || ""}
                style={{
                  height: "20px",
                  width: "20px",
                  marginRight: "5px",
                  marginBottom: "4px",
                }}
              />
            </Tooltip>
            <Tooltip
              title={`~ ${formatCurrency(repaymentAmount * currency?.lastPrice || 0, 2)}`}
            >
              <span>{repaymentAmount?.toFixed(4)}</span>
            </Tooltip>
          </Box>
        );
      case OffersListFields.APR:
        return `${offer.term.apr}%`;
      case OffersListFields.DURATION:
        return prettifySeconds(offer.term.duration * 86400, "day");
      case OffersListFields.EXPIRATION:
        return offerExpires;
      case OffersListFields.ASSET:
        return (
          <Avatar
            src={
              offer.assetListing.asset?.imageUrl ||
              offer.assetListing.asset?.gifUrl ||
              offer.assetListing.asset?.threeDUrl ||
              (themeType === "dark" ? previewNotAvailableDark : previewNotAvailableLight)
            }
          />
        );
      case OffersListFields.NAME:
        return (
          <Link
            to={`/asset/${offer.assetListing.asset.assetContractAddress}/${offer.assetListing.asset.tokenId}`}
          >
            {offer.assetListing.asset.name || ""}
          </Link>
        );
      case OffersListFields.CREATED_AGO:
        return <span style={{ marginRight: "2em" }}>{offerCreatedSecondsAgo} ago</span>;
      case OffersListFields.STATUS:
        return offer.status !== OfferStatus.Ready ? (
          <Chip
            label={offer.status}
            sx={{
              fontSize: "0.875em",
              marginRight: "2em",
              backgroundColor: "#374FFF",
              color: "#fff",
            }}
          ></Chip>
        ) : (
          ""
        );
      default:
        return "?";
    }
  };

  return (
    <>
      <MakeOffer
        onClose={onDialogClose}
        open={makeOfferDialogOpen}
        listing={offer?.assetListing}
        isEdit={true}
        offerTerm={offer?.term}
      />
      <RemoveOfferConfirmDialog
        open={removeOfferConfirmDialogOpen}
        setOpen={setRemoveOfferConfirmDialogOpen}
        onRemove={handleDeleteOffer}
      />
      <PaperTableRow className={style["row"]}>
        {fields?.map((field: OffersListFields, index: number) => (
          <PaperTableCell key={`offer-list-row-${index}`} className={style["offerElem"]}>
            <Box className="flex fr ai-c">{getFieldData(field)}</Box>
          </PaperTableCell>
        ))}
        <PaperTableCell
          sx={{
            display: "flex",
            fontSize: "1rem",
            alignItems: "middle",
            marginRight: "20px",
          }}
        >
          <Box className="flex fr ai-c">
            {offer.status !== OfferStatus.Ready && (
              <Chip
                label={offer.status}
                sx={{
                  fontSize: "0.875em",
                  backgroundColor: "#374FFF",
                  color: "#fff",
                }}
              ></Chip>
            )}
            {isOwner &&
              !hasPermission &&
              offer.status === OfferStatus.Ready &&
              Date.parse(offer.term.expirationAt) > Date.now() &&
              (isPending ? (
                <Button variant="outlined" className="offer slim">
                  <CircularProgress />
                </Button>
              ) : (
                <Box sx={{ display: "flex" }}>
                  <Button
                    variant="contained"
                    sx={{ my: "10px", mr: "10px", width: "100px" }}
                    className="offer slim"
                    onClick={handleRequestPermission}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ my: "10px", width: "100px" }}
                    className="offer slim"
                    onClick={handleRejectOffer}
                  >
                    Reject
                  </Button>
                </Box>
              ))}
            {isOwner &&
              hasPermission &&
              offer.status === OfferStatus.Ready &&
              (isPending ? (
                <Button variant="outlined" className="offer slim">
                  <CircularProgress />
                </Button>
              ) : (
                <Box sx={{ display: "flex" }}>
                  <Button
                    variant="contained"
                    sx={{ my: "10px", mr: "10px", width: "100px" }}
                    className="offer slim"
                    onClick={handleAcceptOffer}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ my: "10px", width: "100px" }}
                    className="offer slim"
                    onClick={handleRejectOffer}
                  >
                    Reject
                  </Button>
                </Box>
              ))}
            {!isOwner && isMyOffer && offer.status === OfferStatus.Ready && (
              <Box sx={{ display: "flex" }}>
                <Button
                  variant="contained"
                  className="offer slim"
                  sx={{ my: "10px", mr: "10px", width: "100px" }}
                  onClick={handleUpdateOffer}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  className="offer slim"
                  sx={{ my: "10px", width: "100px" }}
                  onClick={() => setRemoveOfferConfirmDialogOpen(true)}
                >
                  Remove
                </Button>
              </Box>
            )}
          </Box>
        </PaperTableCell>
      </PaperTableRow>
    </>
  );
};
