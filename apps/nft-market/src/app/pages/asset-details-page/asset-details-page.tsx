import { useWeb3Context } from "@fantohm/shared-web3";
import { Box, CircularProgress, Container, Grid, Paper, Typography } from "@mui/material";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  useGetListingsQuery,
  useGetLoansQuery,
  useGetNftAssetQuery,
  useGetOffersQuery,
  useValidateNFTQuery,
} from "../../api/backend-api";
import { AssetDetails } from "../../components/asset-details/asset-details";
import { BorrowerCreateListing } from "../../components/borrower-create-listing/borrower-create-listing";
import { BorrowerListingDetails } from "../../components/borrower-listing-details/borrower-listing-details";
import { BorrowerLoanDetails } from "../../components/borrower-loan-details/borrower-loan-details";
import { LenderListingTerms } from "../../components/lender-listing-terms/lender-listing-terms";
import LenderLoanDetails from "../../components/lender-loan-details/lender-loan-details";
import OffersList, { OffersListFields } from "../../components/offers-list/offers-list";
import OwnerInfo from "../../components/owner-info/owner-info";
import PreviousLoans from "../../components/previous-loans/previous-loans";
import { RootState } from "../../store";
import { selectAssetByAddress } from "../../store/selectors/asset-selectors";
import { selectListingsByAddress } from "../../store/selectors/listing-selectors";
import {
  AssetStatus,
  Listing,
  ListingStatus,
  Loan,
  LoanStatus,
} from "../../types/backend-types";

export const AssetDetailsPage = (): JSX.Element => {
  const params = useParams();
  const { address } = useWeb3Context();
  const { authSignature } = useSelector((state: RootState) => state.backend);

  // find listing from store
  const listings = useSelector((state: RootState) =>
    selectListingsByAddress(state, {
      contractAddress: params["contractAddress"] || "123",
      tokenId: params["tokenId"] || "123",
    })
  );

  // find asset from store
  const asset = useSelector((state: RootState) =>
    selectAssetByAddress(state, {
      contractAddress: params["contractAddress"] || "123",
      tokenId: params["tokenId"] || "123",
    })
  );

  // load asset data from backend
  const { data: npResponse, isLoading: isAssetLoading } = useGetNftAssetQuery(
    {
      contractAddress: params["contractAddress"] || "",
      tokenId: params["tokenId"] || "",
    },
    { skip: !params["contractAddress"] || !params["tokenId"] }
  );

  // load listing data from backend
  const { isLoading: isListingLoading } = useGetListingsQuery(
    {
      skip: 0,
      take: 50,
      contractAddress: params["contractAddress"] || "",
      tokenId: params["tokenId"] || "",
    },
    { skip: !params["contractAddress"] || !params["tokenId"] }
  );

  const { error: isValidNFTError, isLoading: isValidating } = useValidateNFTQuery(
    asset?.id?.toString() || "",
    { skip: !authSignature || !asset?.id }
  );

  // load loans for this contract
  const { data: loans, isLoading: isLoansLoading } = useGetLoansQuery(
    {
      skip: 0,
      take: 1,
      sortQuery: "loan.updatedAt:DESC",
      assetId: asset?.id || "",
      status: LoanStatus.Active,
    },
    {
      skip: !authSignature || !asset || !asset.id || asset.status !== AssetStatus.Locked,
    }
  );

  // is the user the owner of the asset?
  const isValidNFT = useMemo(() => {
    return (
      (isValidNFTError as any)?.data?.message !==
      "This asset is already transferred outside our platform."
    );
  }, [isValidNFTError]);

  const isOwner = useMemo(() => {
    return address.toLowerCase() === asset?.owner?.address.toLowerCase();
  }, [asset, address]);

  const activeListing = useMemo(() => {
    return listings.find((listing: Listing) => listing.status === ListingStatus.Listed);
  }, [listings]);

  const assetId = useMemo(() => {
    if (!asset) {
      return null;
    }
    return asset?.id;
  }, [asset]);

  const { data: offers, isLoading: isOffersLoading } = useGetOffersQuery({
    assetId: assetId || "",
    sortQuery: "offer.updatedAt:DESC",
  });

  const activeLoan = useMemo(() => {
    if (!loans) return {} as Loan;
    return loans.find((loan: Loan) => loan.status === LoanStatus.Active);
  }, [loans]);

  const offersFields = [
    OffersListFields.LENDER_PROFILE,
    OffersListFields.PRINCIPAL,
    OffersListFields.TOTAL_INTEREST,
    OffersListFields.REPAYMENT_TOTAL,
    OffersListFields.APR,
    OffersListFields.DURATION,
    OffersListFields.EXPIRATION,
  ];

  if (isListingLoading || isAssetLoading || !asset || isLoansLoading || isValidating) {
    return (
      <Box className="flex fr fj-c">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <AssetDetails
        contractAddress={asset.assetContractAddress}
        tokenId={asset.tokenId}
        listing={activeListing}
        sx={{ mt: "5em", mb: "3em" }}
      />
      {!activeListing && !asset && <h1>Loading...</h1>}
      {!authSignature &&
        activeListing &&
        activeListing.asset?.status === AssetStatus.Listed && (
          <Box className="flex fr fj-c">
            <h2>Connect your wallet to fund the loan or make an offer.</h2>
          </Box>
        )}
      {isValidNFT === false && (
        <Container sx={{ mt: "3em" }}>
          <Paper>
            <Box className="flex fr fj-sa fw">
              <Box className="flex fc">
                <Typography>NFT has been transferred</Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
      )}
      {isValidNFT !== false &&
        asset &&
        authSignature &&
        !isOwner &&
        activeListing &&
        activeListing.asset &&
        activeListing.asset?.status === AssetStatus.Listed && (
          <LenderListingTerms
            offers={offers || []}
            listing={activeListing}
            sx={{ mt: "3em" }}
            key={`llt-${activeListing.id}`}
          />
        )}
      {isValidNFT !== false &&
        asset &&
        !isOwner &&
        activeLoan &&
        activeLoan.assetListing &&
        activeLoan.assetListing.asset?.status === AssetStatus.Locked &&
        authSignature && (
          <LenderLoanDetails asset={asset} loan={activeLoan} sx={{ mt: "3em" }} />
        )}
      {isValidNFT !== false &&
        isOwner &&
        authSignature &&
        [AssetStatus.Ready, AssetStatus.New].includes(asset?.status) && (
          <BorrowerCreateListing asset={asset} sx={{ mt: "3em" }} />
        )}
      {isValidNFT !== false &&
        isOwner &&
        authSignature &&
        asset?.status === AssetStatus.Listed && (
          <BorrowerListingDetails asset={asset} sx={{ mt: "3em" }} />
        )}
      {isValidNFT !== false &&
        isOwner &&
        authSignature &&
        asset?.status === AssetStatus.Locked &&
        activeLoan && (
          <BorrowerLoanDetails asset={asset} loan={activeLoan} sx={{ mt: "3em" }} />
        )}
      {asset.id && authSignature && (
        <OffersList
          offers={offers}
          isLoading={isOffersLoading}
          fields={offersFields}
          title="Offers received"
        />
      )}
      <Container maxWidth="xl" sx={{ mt: "5em" }}>
        <Grid container columnSpacing={5}>
          <Grid item xs={12} md={5}>
            <OwnerInfo address={asset.owner.address} />
          </Grid>
          <Grid item xs={12} md={7}>
            <PreviousLoans asset={asset} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default AssetDetailsPage;
