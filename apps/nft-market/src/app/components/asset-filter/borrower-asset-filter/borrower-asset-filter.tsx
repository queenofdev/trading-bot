import {
  Box,
  Icon,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import {
  AssetStatus,
  Collection,
  FrontendAssetFilterQuery,
} from "../../../types/backend-types";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import CollectionsFilter from "../../collections-filter/collections-filter";
import style from "./borrower-asset-filter.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useGetCollectionsQuery } from "../../../api/backend-api";
import { selectAssetsByQuery } from "../../../store/selectors/asset-selectors";
import { useWeb3Context } from "@fantohm/shared-web3";
import BorrowerAssetSearch from "../borrower-asset-search/borrower-asset-search";

export interface BorrowerAssetFilterProps {
  query: FrontendAssetFilterQuery;
  setQuery: Dispatch<SetStateAction<FrontendAssetFilterQuery>>;
}

export const BorrowerAssetFilter = ({
  query,
  setQuery,
}: BorrowerAssetFilterProps): JSX.Element => {
  const { address } = useWeb3Context();
  const { authSignature } = useSelector((state: RootState) => state.backend);
  const { data: collections } = useGetCollectionsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const myAssets = useSelector((state: RootState) =>
    selectAssetsByQuery(state, {
      status: "All",
      wallet: address,
    })
  );
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<string>("All");
  const [collection, setCollection] = useState<Collection>({} as Collection);

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
        ...query,
        status: getStatusType(event.target.value),
        usable: event.target.value === "Unusable" ? false : undefined,
      };
      setQuery(updatedQuery);
    },
    [JSON.stringify(query)]
  );

  useEffect(() => {
    if (collection.contractAddress === query.assetContractAddress) return;
    const updatedQuery: FrontendAssetFilterQuery = {
      ...query,
      assetContractAddress: collection.contractAddress,
    };
    setQuery(updatedQuery);
  }, [collection]);

  const handleResetFilters = () => {
    handleStatusChange({ target: { value: "All" } } as SelectChangeEvent<string>);
    setCollection({} as Collection);
    setKeyword("");
  };
  const isWalletConnected = address && authSignature;

  return (
    <Box sx={{ ml: "auto" }}>
      <BorrowerAssetSearch
        keyword={keyword}
        setKeyword={setKeyword}
        setCollection={setCollection}
      />
      <Select
        labelId="asset-sort-by"
        label="Sort by"
        defaultValue="Unlisted"
        id="asset-sort-select"
        sx={{
          width: "100%",
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
      {isWalletConnected && (
        <>
          <Box
            className="flex fr ai-c"
            sx={{
              cursor: "pointer",
              margin: "20px 0 0 0",
              padding: "20px 0 0 0",
              borderTop: "1px solid rgba(0,0,0,0.1)",
            }}
            onClick={handleResetFilters}
          >
            <Icon sx={{ opacity: "0.4" }}>
              <CancelOutlinedIcon />
            </Icon>
            <Typography sx={{ opacity: "0.4", margin: "5px 0 0 15px" }}>
              Reset filter
            </Typography>
          </Box>
          <CollectionsFilter
            collections={collections?.filter((collection) =>
              myAssets.find(
                (asset) => asset.assetContractAddress === collection.contractAddress
              )
            )}
            collection={collection}
            setCollection={setCollection}
            type="borrow"
          />
        </>
      )}
    </Box>
  );
};

export default BorrowerAssetFilter;
