import { Avatar, Badge, Box } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetListingQuery,
  useGetLoanQuery,
  useGetOfferQuery,
  useUpdateUserNotificationMutation,
} from "../../api/backend-api";
import {
  Asset,
  Notification,
  NotificationContext,
  NotificationStatus,
  Terms,
  User,
  UserType,
} from "../../types/backend-types";
import style from "./notification-message.module.scss";
import avatarPlaceholder from "../../../assets/images/profile-placeholder.svg";
import { useTermDetails } from "../../hooks/use-term-details";
import { addressEllipsis, formatCurrency } from "@fantohm/shared-helpers";
import { useNavigate } from "react-router-dom";
import { prettifySeconds } from "@fantohm/shared-web3";
import previewNotAvailableDark from "../../../assets/images/preview-not-available-dark.png";
import previewNotAvailableLight from "../../../assets/images/preview-not-available-light.png";
import { RootState } from "../../store";

export interface NotificationMessageProps {
  notification: Notification;
  short?: boolean;
  isMenu?: boolean;
}

export type MessageProp = {
  notification: Notification;
  asset: Asset;
  short: boolean;
  terms?: Terms;
  borrower?: User;
  lender?: User;
};

const getBlueText = (text: any) => {
  return <span style={{ color: "#374fff" }}>{text}</span>;
};

const NewLoanLender = ({ asset, short, terms }: MessageProp): JSX.Element => {
  const { repaymentAmount, currency } = useTermDetails(terms);

  const shortMsg = <span>You have funded a new loan on {getBlueText(asset.name)}.</span>;
  const longMsg = (
    <span style={{ marginTop: "10px", fontSize: "0.85rem" }}>
      You have funded a new loan on {getBlueText(asset.name)} for{" "}
      {formatCurrency(terms?.amount || 0, 2)} {currency.symbol} over {terms?.duration}{" "}
      days, with a total repayment of {formatCurrency(repaymentAmount || 0, 2)}{" "}
      {currency.symbol}.
    </span>
  );
  return (
    <Box className="flex fc">
      {shortMsg}
      {!short && longMsg}
    </Box>
  );
};

const NewLoanBorrower = ({ asset, short, terms, lender }: MessageProp): JSX.Element => {
  const { amount, repaymentTotal, currency } = useTermDetails(terms);
  const shortMsg = (
    <span>
      {addressEllipsis(lender?.address || "")} has funded your loan on{" "}
      {getBlueText(asset.name)}
    </span>
  );
  const longMsg = (
    <span style={{ marginTop: "10px", fontSize: "0.85rem" }}>
      {addressEllipsis(lender?.address || "")} has funded your loan on{" "}
      {getBlueText(asset.name)}, and {formatCurrency(amount || 0, 2)} {currency.symbol}{" "}
      has been released to your wallet. You will need to repay{" "}
      {formatCurrency(repaymentTotal || 0, 2)} {currency.symbol} to{" "}
      {addressEllipsis(lender?.address || "")} to retrieve your NFT.
    </span>
  );
  return (
    <Box className="flex fc">
      {shortMsg}
      {!short && longMsg}
    </Box>
  );
};

const LiquidationLender = ({ asset, short }: MessageProp): JSX.Element => {
  const shortMsg = (
    <span>You have liquidated the loan on {getBlueText(asset.name)}.</span>
  );
  const longMsg = (
    <span style={{ marginTop: "10px", fontSize: "0.85rem" }}>
      You liquidated the loan on {getBlueText(asset.name)} and the NFT has been
      transferred to your wallet.
    </span>
  );
  return (
    <Box className="flex fc">
      {shortMsg}
      {!short && longMsg}
    </Box>
  );
};

const LiquidationBorrower = ({ asset, short }: MessageProp): JSX.Element => {
  const shortMsg = (
    <span>The loan on {getBlueText(asset.name)} has been liquidated.</span>
  );
  const longMsg = (
    <span style={{ marginTop: "10px", fontSize: "0.85rem" }}>
      The loan on {getBlueText(asset.name)} has expired without repayment and the lender
      has claimed the NFT.
    </span>
  );
  return (
    <Box className="flex fc">
      {shortMsg}
      {!short && longMsg}
    </Box>
  );
};

const RepaymentLender = ({ asset, short, terms }: MessageProp): JSX.Element => {
  const { repaymentTotal, currency } = useTermDetails(terms);
  const shortMsg = (
    <span>
      {addressEllipsis(asset.owner.address)} has successfully repaid their loan on{" "}
      {getBlueText(asset.name)}
    </span>
  );
  const longMsg = (
    <span style={{ marginTop: "10px", fontSize: "0.85rem" }}>
      {addressEllipsis(asset.owner.address)} has repaid their loan on{" "}
      {getBlueText(asset.name)}. {formatCurrency(repaymentTotal || 0, 2)}{" "}
      {currency.symbol} has been transferred to your wallet.
    </span>
  );
  return (
    <Box className="flex fc">
      {shortMsg}
      {!short && longMsg}
    </Box>
  );
};

const RepaymentBorrower = ({ asset, short }: MessageProp): JSX.Element => {
  //  const { repaymentTotal } = useTermDetails(terms);
  const shortMsg = <span>You have repaid your loan on {getBlueText(asset.name)}</span>;
  const longMsg = (
    <span style={{ marginTop: "10px", fontSize: "0.85rem" }}>
      Your loan has been repaid and {getBlueText(asset.name)} has been transferred back to
      your wallet.
    </span>
  );
  return (
    <Box className="flex fc">
      {shortMsg}
      {!short && longMsg}
    </Box>
  );
};

const NewOfferLender = ({ asset, short, terms }: MessageProp): JSX.Element => {
  const { repaymentAmount, currency } = useTermDetails(terms);
  const shortMsg = <span>You sent an offer on {getBlueText(asset.name)}</span>;
  const longMsg = (
    <span style={{ marginTop: "10px", fontSize: "0.85rem" }}>
      You have sent an offer on {getBlueText(asset.name)} for{" "}
      {formatCurrency(terms?.amount || 0, 2)} {currency.symbol} over {terms?.duration}{" "}
      days, with a total repayment of {formatCurrency(repaymentAmount || 0, 2)}{" "}
      {currency.symbol}.
    </span>
  );
  return (
    <Box className="flex fc">
      {shortMsg}
      {!short && longMsg}
    </Box>
  );
};

const NewOfferBorrower = ({ asset, short, terms }: MessageProp): JSX.Element => {
  const { repaymentAmount, currency } = useTermDetails(terms);
  const shortMsg = <span>You have a new offer on {getBlueText(asset.name)}</span>;
  const longMsg = (
    <span style={{ marginTop: "10px", fontSize: "0.85rem" }}>
      You have received an offer on {getBlueText(asset.name)} for{" "}
      {formatCurrency(terms?.amount || 0, 2)} {currency.symbol} over {terms?.duration}{" "}
      days, with a total repayment of {formatCurrency(repaymentAmount || 0, 2)}{" "}
      {currency.symbol}.
    </span>
  );
  return (
    <Box className="flex fc">
      {shortMsg}
      {!short && longMsg}
    </Box>
  );
};

const OfferAcceptedLender = ({ asset, short, terms }: MessageProp): JSX.Element => {
  const { repaymentAmount, currency } = useTermDetails(terms);
  const shortMsg = (
    <span>
      {addressEllipsis(asset.owner.address)} has accepted your offer on{" "}
      {getBlueText(asset.name)}
    </span>
  );
  const longMsg = (
    <span style={{ marginTop: "10px", fontSize: "0.85rem" }}>
      {addressEllipsis(asset.owner.address)} has accepted your offer on{" "}
      {getBlueText(asset.name)} for {formatCurrency(terms?.amount || 0, 2)}{" "}
      {currency.symbol} over {terms?.duration} days, with a total repayment of{" "}
      {formatCurrency(repaymentAmount || 0, 2)} {currency.symbol}.
    </span>
  );
  return (
    <Box className="flex fc">
      {shortMsg}
      {!short && longMsg}
    </Box>
  );
};

const OfferAcceptedBorrower = ({ asset, short, terms }: MessageProp): JSX.Element => {
  const { repaymentAmount, currency } = useTermDetails(terms);
  const shortMsg = <span>You have accepted an offer on {getBlueText(asset.name)}</span>;
  const longMsg = (
    <span style={{ marginTop: "10px", fontSize: "0.85rem" }}>
      You have accepted an offer on {getBlueText(asset.name)}
      for {formatCurrency(terms?.amount || 0, 2)} {currency.symbol} over {terms?.duration}{" "}
      days, with a repayment of {formatCurrency(repaymentAmount || 0, 2)}{" "}
      {currency.symbol}.
    </span>
  );
  return (
    <Box className="flex fc">
      {shortMsg}
      {!short && longMsg}
    </Box>
  );
};

const OfferUpdatedLender = ({ asset, short, terms }: MessageProp): JSX.Element => {
  const { repaymentAmount, currency } = useTermDetails(terms);
  const shortMsg = <span>You offer has been updated on {getBlueText(asset.name)}</span>;
  const longMsg = (
    <span style={{ marginTop: "10px", fontSize: "0.85rem" }}>
      You offer has been updated on {getBlueText(asset.name)} for{" "}
      {formatCurrency(terms?.amount || 0, 2)} {currency.symbol} over {terms?.duration}{" "}
      days, with a total repayment of {formatCurrency(repaymentAmount || 0, 2)}{" "}
      {currency.symbol}.
    </span>
  );
  return (
    <Box className="flex fc">
      {shortMsg}
      {!short && longMsg}
    </Box>
  );
};

const OfferUpdatedBorrower = ({ asset, short, terms }: MessageProp): JSX.Element => {
  const { repaymentAmount, currency } = useTermDetails(terms);
  const shortMsg = <span>The offer on {getBlueText(asset.name)} has been updated</span>;
  const longMsg = (
    <span style={{ marginTop: "10px", fontSize: "0.85rem" }}>
      The offer on {getBlueText(asset.name)} has been updated for{" "}
      {formatCurrency(terms?.amount || 0, 2)} {currency.symbol} over {terms?.duration}{" "}
      days, with a total repayment of {formatCurrency(repaymentAmount || 0, 2)}{" "}
      {currency.symbol}.
    </span>
  );
  return (
    <Box className="flex fc">
      {shortMsg}
      {!short && longMsg}
    </Box>
  );
};

const OfferRemovedLender = ({ asset, short, terms }: MessageProp): JSX.Element => {
  const { repaymentAmount, currency } = useTermDetails(terms);
  const shortMsg = <span>You offer has been removed on {getBlueText(asset.name)}</span>;
  const longMsg = (
    <span style={{ marginTop: "10px", fontSize: "0.85rem" }}>
      You offer for {formatCurrency(terms?.amount || 0, 2)} {currency.symbol} over{" "}
      {terms?.duration} days, with a total repayment of{" "}
      {formatCurrency(repaymentAmount || 0, 2)} {currency.symbol} has been removed on{" "}
      {getBlueText(asset.name)}.
    </span>
  );
  return (
    <Box className="flex fc">
      {shortMsg}
      {!short && longMsg}
    </Box>
  );
};

const OfferRemovedBorrower = ({ asset, short, terms }: MessageProp): JSX.Element => {
  const { repaymentAmount, currency } = useTermDetails(terms);
  const shortMsg = <span>The offer on {getBlueText(asset.name)} has been removed</span>;
  const longMsg = (
    <span style={{ marginTop: "10px", fontSize: "0.85rem" }}>
      The offer on {getBlueText(asset.name)} for {formatCurrency(terms?.amount || 0, 2)}{" "}
      {currency.symbol} over {terms?.duration} days, with a total repayment of{" "}
      {formatCurrency(repaymentAmount || 0, 2)} {currency.symbol} has been removed.
    </span>
  );
  return (
    <Box className="flex fc">
      {shortMsg}
      {!short && longMsg}
    </Box>
  );
};

const ListingCancelledLender = ({ asset, short }: MessageProp): JSX.Element => {
  // const { repaymentAmount, currencyPrice } = useTermDetails(terms);
  const shortMsg = <span>The listing for {getBlueText(asset.name)} was cancelled</span>;
  const longMsg = (
    <span style={{ marginTop: "10px", fontSize: "0.85rem" }}>
      The listing on {getBlueText(asset.name)} was cancelled. Your offer is no longer
      active.
    </span>
  );
  return (
    <Box className="flex fc">
      {shortMsg}
      {!short && longMsg}
    </Box>
  );
};

const ListingCancelledBorrower = ({ asset, short }: MessageProp): JSX.Element => {
  //const { repaymentAmount, currencyPrice } = useTermDetails(terms);
  const shortMsg = (
    <span>The listing on {getBlueText(asset.name)} has been cancelled</span>
  );
  const longMsg = (
    <span style={{ marginTop: "10px", fontSize: "0.85rem" }}>
      The listing on {getBlueText(asset.name)} has been cancelled.
    </span>
  );
  return (
    <Box className="flex fc">
      {shortMsg}
      {!short && longMsg}
    </Box>
  );
};

export const NotificationMessage = ({
  notification,
  short,
  isMenu,
}: NotificationMessageProps): JSX.Element => {
  const themeType = useSelector((state: RootState) => state.theme.mode);
  const [assetListingId, setAssetListingId] = useState<string>();
  const [loanId, setLoanId] = useState<string>();
  const [offerId, setOfferId] = useState<string>();
  const [asset, setAsset] = useState<Asset>();
  const [terms, setTerms] = useState<Terms>();
  const [contextType, setContextType] = useState<"loan" | "listing" | "offer">();
  const [lender, setLender] = useState<User>();
  const [borrower, setBorrower] = useState<User>();
  const navigate = useNavigate();
  const [updateNotification] = useUpdateUserNotificationMutation();
  const updatedAgo = useMemo(() => {
    if (!notification || !notification.updatedAt) return "";
    const updatedAtTimestamp = Date.parse(notification?.updatedAt);
    return prettifySeconds((Date.now() - updatedAtTimestamp) / 1000);
  }, [notification.updatedAt]);

  const { data: listing } = useGetListingQuery(assetListingId, {
    skip: !assetListingId,
  });
  const { data: loan } = useGetLoanQuery(loanId, {
    skip: !loanId,
  });
  const { data: offer } = useGetOfferQuery(offerId, {
    skip: !offerId,
  });

  // set the ID for the correct object to trigger get query
  useEffect(() => {
    switch (notification.context) {
      case NotificationContext.NewLoan:
      case NotificationContext.Liquidation:
      case NotificationContext.Repayment:
        setLoanId(notification.contextId);
        setContextType("loan");
        break;
      case NotificationContext.ListingCancelled:
        setAssetListingId(notification.contextId);
        setContextType("listing");
        break;
      case NotificationContext.NewOffer:
      case NotificationContext.OfferAccepted:
      case NotificationContext.OfferUpdated:
      case NotificationContext.OfferRemoved:
        setOfferId(notification.contextId);
        setContextType("offer");
        break;
    }
  }, [notification.context]);

  // loan is loaded
  const avatarSrc = useMemo(() => {
    switch (contextType) {
      case "loan":
        setAsset(loan?.assetListing.asset);
        setTerms(loan?.term);
        setLender(loan?.lender);
        setBorrower(loan?.borrower);
        return loan && loan.assetListing.asset.imageUrl
          ? loan.assetListing.asset.imageUrl
          : avatarPlaceholder;
      case "listing":
        setAsset(listing?.asset);
        setTerms(listing?.term);
        setLender({} as User);
        setBorrower(listing?.asset.owner);
        return listing && listing.asset.imageUrl
          ? listing.asset.imageUrl
          : avatarPlaceholder;
      case "offer":
        setAsset(offer?.assetListing?.asset);
        setTerms(offer?.term);
        setLender(offer?.lender);
        setBorrower(offer?.assetListing?.asset.owner);
        return offer && offer.assetListing?.asset.imageUrl
          ? offer.assetListing?.asset.imageUrl
          : avatarPlaceholder;
      default:
        return avatarPlaceholder;
    }
  }, [contextType, loan, offer, listing]);

  const message = useMemo(() => {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    if (!asset) return <></>;
    const msgParams = {
      notification,
      short: !!short,
      asset,
      terms,
      borrower,
      lender,
    };
    let MsgType;
    switch (notification.context) {
      case NotificationContext.NewLoan:
        MsgType =
          notification.userType === UserType.Lender ? NewLoanLender : NewLoanBorrower;
        break;
      case NotificationContext.Liquidation:
        MsgType =
          notification.userType === UserType.Lender
            ? LiquidationLender
            : LiquidationBorrower;
        break;
      case NotificationContext.Repayment:
        MsgType =
          notification.userType === UserType.Lender ? RepaymentLender : RepaymentBorrower;
        break;
      case NotificationContext.ListingCancelled:
        MsgType =
          notification.userType === UserType.Lender
            ? ListingCancelledLender
            : ListingCancelledBorrower;
        break;
      case NotificationContext.NewOffer:
        MsgType =
          notification.userType === UserType.Lender ? NewOfferLender : NewOfferBorrower;
        break;
      case NotificationContext.OfferAccepted:
        MsgType =
          notification.userType === UserType.Lender
            ? OfferAcceptedLender
            : OfferAcceptedBorrower;
        break;
      case NotificationContext.OfferUpdated:
        MsgType =
          notification.userType === UserType.Lender
            ? OfferUpdatedLender
            : OfferUpdatedBorrower;
        break;
      case NotificationContext.OfferRemoved:
        MsgType =
          notification.userType === UserType.Lender
            ? OfferRemovedLender
            : OfferRemovedBorrower;
        break;
    }
    if (MsgType) {
      return <MsgType {...msgParams} />;
    } else {
      return null;
    }
  }, [notification.context, asset, borrower, lender, terms, short]);

  const handleRecordClick = useCallback(() => {
    if (notification?.status !== NotificationStatus.Read) {
      updateNotification({ ...notification, status: NotificationStatus.Read });
    }
    navigate(`/asset/${asset?.assetContractAddress}/${asset?.tokenId}`);
  }, [notification, asset]);

  return (
    <>
      <Box
        className="flex fr ai-c"
        onClick={handleRecordClick}
        style={{ width: "100%", justifyContent: "space-between" }}
      >
        <Avatar
          src={
            asset
              ? asset?.imageUrl ||
                asset?.gifUrl ||
                asset?.threeDUrl ||
                (themeType === "dark"
                  ? previewNotAvailableDark
                  : previewNotAvailableLight)
              : ""
          }
          sx={{ mr: "1em", borderRadius: "50%" }}
          variant="circular"
        />
        <div style={{ marginRight: "auto" }}>
          {message}
          {isMenu && (
            <Box
              sx={{
                display: "flex",
                color: "#8991A2",
                ml: "auto",
                width: "200px",
                alignItems: "center",
                marginTop: "5px",
                marginLeft: "0px",
                fontSize: "0.8rem",
              }}
            >
              {updatedAgo} ago
            </Box>
          )}
        </div>
      </Box>
      {isMenu && notification.status === NotificationStatus.Unread && (
        <div style={{ width: "20px", marginLeft: "20px" }}>
          <Badge
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            color="info"
            className="unreadBadge"
            classes={{
              colorInfo: style["unreadBadge"],
            }}
            badgeContent=" "
          />
        </div>
      )}
    </>
  );
};

export default NotificationMessage;
