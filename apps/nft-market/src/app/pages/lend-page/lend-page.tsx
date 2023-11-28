import { scrollTo } from "@fantohm/shared-helpers";
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLazyGetListingsQuery } from "../../api/backend-api";
import LenderAssetFilter from "../../components/asset-filter/lender-asset-filter/lender-asset-filter";
import AssetList from "../../components/asset-list/asset-list";
import AssetTypeFilter from "../../components/asset-type-filter/asset-type-filter";
import HeaderBlurryImage from "../../components/header-blurry-image/header-blurry-image";
import { RootState } from "../../store";
import { ListingQueryParam } from "../../store/reducers/interfaces";
import { Asset, Listing, ListingStatus } from "../../types/backend-types";
import style from "./lend-page.module.scss";

export const LendPage = (): JSX.Element => {
  const [displayAssets, setDisplayAssets] = useState<Asset[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(6);
  const [query, setQuery] = useState<ListingQueryParam>({
    skip: 0,
    take,
    status: ListingStatus.Listed,
  });
  const { user } = useSelector((state: RootState) => state.backend);
  const [trigger, listingsResult] = useLazyGetListingsQuery();

  const isDesktop = useMediaQuery("(min-width: 576px)");

  useEffect(() => {
    // if we're down the page we should go ahead and scroll back to the top of the results
    if (window.scrollY > 300) {
      scrollTo(300);
    }
    setSkip(0);
    trigger({ ...query, skip: 0, take });
    setDisplayAssets([]);
  }, [JSON.stringify(query)]);

  useEffect(() => {
    if (!listingsResult.isSuccess) return;
    if (!listingsResult.data.length) return;
    const listings = listingsResult.data;

    const newAssets: Asset[] = listings
      .filter(
        (listing: Listing) =>
          new Date(listing.term.expirationAt).getTime() >= new Date().getTime()
      )
      .sort((a, b) => {
        if (a.asset.owner.address === user.address) {
          return 1;
        } else if (b.asset.owner.address === user.address) {
          return -1;
        }
        return 0;
      })
      .map((listing: Listing): Asset => {
        return listing.asset;
      });
    setDisplayAssets([...displayAssets, ...newAssets]);
    if (listingsResult.data.length < take) {
      setHasNext(false);
    }
  }, [listingsResult.data]);

  const fetchMoreData = () => {
    setSkip(skip + take);
    trigger({ ...query, skip: skip + take, take });
  };

  return (
    <Container className={style["lendPageContainer"]}>
      <HeaderBlurryImage
        url={
          displayAssets && displayAssets.length > 0
            ? displayAssets[0].imageUrl
            : undefined
        }
        height="300px"
      />
      <h1>Explore loan requests</h1>
      <Box sx={{ mt: "3em" }}>
        <Grid container columnSpacing={5}>
          <Grid item xs={12} md={3}>
            <LenderAssetFilter query={query} setQuery={setQuery} />
          </Grid>
          <Grid item xs={12} md={9}>
            {listingsResult.isLoading && (
              <Box className="flex fr fj-c">
                <CircularProgress />
              </Box>
            )}
            <AssetTypeFilter query={query} setQuery={setQuery} />
            {displayAssets && displayAssets.length > 0 && (
              <AssetList
                allAssetsCount={displayAssets.length}
                assets={displayAssets}
                type="lend"
                fetchData={fetchMoreData}
                hasMore={hasNext}
              />
            )}
            {(!displayAssets || displayAssets.length === 0) && (
              <Typography
                variant="h5"
                component={"h5"}
                color="GrayText"
                sx={{ marginTop: isDesktop ? "200px" : "50px", textAlign: "center" }}
              >
                No items
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default LendPage;
