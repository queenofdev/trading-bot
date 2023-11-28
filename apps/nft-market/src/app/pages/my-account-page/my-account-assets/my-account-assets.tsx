import {
  Box,
  Select,
  CircularProgress,
  MenuItem,
  Container,
  SelectChangeEvent,
} from "@mui/material";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useImpersonateAccount } from "@fantohm/shared-web3";
import {
  useGetListingsQuery,
  useGetLoansQuery,
  useGetNftAssetsQuery,
} from "../../../api/backend-api";
import AssetList from "../../../components/asset-list/asset-list";
import { RootState } from "../../../store";
import { selectAssetsByQuery } from "../../../store/selectors/asset-selectors";
import {
  Asset,
  AssetStatus,
  BackendAssetQueryParams,
  BackendLoanQueryParams,
  BackendNftAssetsQueryParams,
  FrontendAssetFilterQuery,
  LoanStatus,
} from "../../../types/backend-types";
import "./my-account-assets.module.scss";
import style from "../../../components/asset-filter/borrower-asset-filter/borrower-asset-filter.module.scss";

export function MyAccountAssets() {
  const params = useParams();
  const { impersonateAddress, isImpersonating } = useImpersonateAccount();
  const { user } = useSelector((state: RootState) => state.backend);
  const walletAddress = useMemo(() => {
    return !!params["walletAddress"] && params["walletAddress"].length > 1
      ? params["walletAddress"]
      : user.address ?? "";
  }, [user, params["walletAddress"]]);
  const address = isImpersonating ? impersonateAddress : walletAddress;

  const take = 18;
  const [status, setStatus] = useState<string>("All");
  const [continuation, setContinuation] = useState("");
  const [hasNext, setHasNext] = useState(true);
  const isOpenseaUp = useSelector((state: RootState) => state.app.isOpenseaUp);

  // query to pass to opensea to pull data
  const [osQuery, setOsQuery] = useState<BackendNftAssetsQueryParams>({
    limit: take,
    walletAddress: address,
  });

  // query to use on frontend to filter cached results and ultimately display
  const [feQuery, setFeQuery] = useState<FrontendAssetFilterQuery>({
    status: "All",
    wallet: address,
  });

  // query to use on backend api call, to pull data we have
  const [beQuery, setBeQuery] = useState<BackendAssetQueryParams>({
    skip: 0,
    take: take,
  });

  // query assets in escrow
  const [loansQuery, setLoansQuery] = useState<BackendLoanQueryParams>({
    skip: 0,
    take: take,
    walletAddress: address,
    status: LoanStatus.Active,
  });

  const myAssets = useSelector((state: RootState) => selectAssetsByQuery(state, feQuery));
  const allMyAssets = useSelector((state: RootState) =>
    selectAssetsByQuery(state, {
      status: "All",
      wallet: address,
    })
  );
  const { authSignature } = useSelector((state: RootState) => state.backend);

  // load assets from opensea api
  const { data: npResponse, isLoading: assetsLoading } = useGetNftAssetsQuery(osQuery, {
    skip: !osQuery.walletAddress || !isOpenseaUp,
  });

  const { data: loans } = useGetLoansQuery(loansQuery, {});

  // using the opensea assets, crosscheck with backend api for correlated data
  useGetListingsQuery(beQuery, {
    skip: !beQuery.contractAddresses || !authSignature,
  });

  const getStatusType = (status: string): AssetStatus | "All" => {
    switch (status) {
      case "All":
        return "All";
      case "Listed":
        return AssetStatus.Listed;
      case "Unlisted":
        return AssetStatus.Ready;
      case "In Escrow":
        return AssetStatus.Locked;
      default:
        return "All";
    }
  };

  const handleStatusChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      if (
        !["All", "Unlisted", "Listed", "In Escrow", "Unusable"].includes(
          event.target.value
        )
      )
        return;
      setStatus(event.target.value);
      const updatedQuery: FrontendAssetFilterQuery = {
        ...feQuery,
        status: getStatusType(event.target.value),
        usable: event.target.value === "Unusable" ? false : undefined,
      };
      setFeQuery(updatedQuery);
    },
    [feQuery]
  );

  useEffect(() => {
    const newQuery = {
      ...beQuery,
      contractAddresses: npResponse?.assets
        ?.map((asset: Asset) => (asset.assetContractAddress || "").toString())
        .join(","),
      tokenIds: npResponse?.assets
        ?.map((asset: Asset) => (asset.tokenId || "").toString())
        .join(","),
    };
    setBeQuery(newQuery);
    if (npResponse && npResponse.continuation) {
      setContinuation(npResponse?.continuation || "");
    } else if (npResponse && npResponse.continuation === null) {
      setHasNext(false);
    }
  }, [npResponse, npResponse?.assets]);

  useEffect(() => {
    setOsQuery({
      ...osQuery,
      walletAddress: address,
    });
    setFeQuery({
      ...feQuery,
      wallet: address,
    });
    setLoansQuery({
      ...loansQuery,
      walletAddress: address,
    });
  }, [address]);

  const assetsToShow: Asset[] =
    feQuery.status === AssetStatus.Locked && loans
      ? loans?.map((loan) => loan.assetListing.asset)
      : myAssets;

  const fetchMoreData = () => {
    setOsQuery({ ...osQuery, continuation: continuation });
  };

  return (
    <Box className="flex fr fj-c" sx={{ mt: "50px" }}>
      {assetsLoading ? (
        <CircularProgress />
      ) : (
        <Container sx={{ mt: "30px" }} maxWidth="lg">
          <Box className="flex fr fj-fe">
            <Select
              labelId="asset-sort-by"
              label="Sort by"
              defaultValue="Unlisted"
              id="asset-sort-select"
              sx={{
                width: "200px",
                borderRadius: "10px",
                border: "3px solid rgba(0,0,0,0.1)",
                padding: "0 10px 0 20px",
              }}
              onChange={handleStatusChange}
              value={status}
              className={style["sortList"]}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Listed">Listed</MenuItem>
              <MenuItem value="Unlisted">Unlisted</MenuItem>
              <MenuItem value="In Escrow">In Escrow</MenuItem>
              <MenuItem value="Unusable">Unusable</MenuItem>
            </Select>
          </Box>
          <AssetList
            allAssetsCount={
              feQuery.status === AssetStatus.Locked && loans
                ? assetsToShow.length
                : allMyAssets.length
            }
            assets={assetsToShow}
            type="borrow"
            hasMore={hasNext}
            fetchData={fetchMoreData}
          />
        </Container>
      )}
    </Box>
  );
}

export default MyAccountAssets;
