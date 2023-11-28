//import style from "./lender-asset-filter.module.scss";
import {
  Box,
  Icon,
  ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  Typography,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { ListingQueryParam, ListingSort } from "../../../store/reducers/interfaces";
import { Collection } from "../../../types/backend-types";
import CollectionsFilter from "../../collections-filter/collections-filter";
import { useGetCollectionsQuery } from "../../../api/backend-api";
import style from "./lender-asset-filter.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import AssetSearch from "../asset-search/asset-search";

export interface LenderAssetFilterProps {
  query: ListingQueryParam;
  setQuery: Dispatch<SetStateAction<ListingQueryParam>>;
}

const initialPriceRange = [0, 100];
const initialAprRange = [0, 400];
const initialDurationRange = [0, 100];

export const LenderAssetFilter = ({
  query,
  setQuery,
}: LenderAssetFilterProps): JSX.Element => {
  const { data: collections } = useGetCollectionsQuery(
    {
      sortQuery: "collection.openListingCount:DESC",
    },
    { refetchOnMountOrArgChange: true }
  );
  const [priceRange, setPriceRange] = useState<number[]>(initialPriceRange);
  const [aprRange, setAprRange] = useState<number[]>(initialAprRange);
  const [durationRange, setDurationRange] = useState<number[]>(initialDurationRange);
  const [collection, setCollection] = useState<Collection>({} as Collection);
  const [sort, setSort] = useState<string>(ListingSort.Recently);
  const [keyword, setKeyword] = useState<string>("");
  const collectionAddresses = useSelector((state: RootState) =>
    Object.values(state.listings.listings).map(
      (listing) => listing.asset.assetContractAddress
    )
  );

  const valuetext = (value: number) => {
    return `$${value}`;
  };

  const aprValuetext = (value: number) => {
    return `${value}%`;
  };

  const durationValuetext = (value: number) => {
    return `${value} ${value > 1 ? "days" : "day"}`;
  };

  const getSortQuery = (status: string): string => {
    switch (status) {
      case "Recent":
        return "asset_listing.createdAt:DESC";
      case "Oldest":
        return "asset_listing.createdAt:ASC";
      case "Highest Price":
        return "term.usdPrice:DESC";
      case "Lowest Price":
        return "term.usdPrice:ASC";
      default:
        return "";
    }
  };

  const handleSortChange = useCallback((event: SelectChangeEvent<string>) => {
    if (!event) return;
    setSort(event.target.value);

    //trigger query update
    setQuery({ ...query, sortQuery: getSortQuery(event.target.value) });
  }, []);

  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    if (!event || typeof newValue === "number") return;
    setPriceRange(newValue);
  };

  const handlePriceRangeChangeCommitted = (
    event: Event | SyntheticEvent,
    newValue: number | number[]
  ) => {
    if (!event || typeof newValue === "number") return;
    setPriceRange(newValue);

    //trigger query update
    setQuery({
      ...query,
      minPrice: scaleValues(newValue)[0],
      maxPrice: scaleValues(newValue)[1],
    });
  };

  const handleAprRangeChange = (event: Event, newValue: number | number[]) => {
    if (!event || typeof newValue === "number") return;
    setAprRange([newValue[0], newValue[1]]);
  };

  const handleAprRangeChangeCommitted = (
    event: Event | SyntheticEvent,
    newValue: number | number[]
  ) => {
    if (!event || typeof newValue === "number") return;
    setAprRange([newValue[0], newValue[1]]);

    //trigger query update
    const newQuery = { ...query, minApr: newValue[0], maxApr: newValue[1] };
    setQuery(newQuery);
  };

  const handleDurationRangeChange = (event: Event, newValue: number | number[]) => {
    if (!event || typeof newValue === "number") return;
    setDurationRange([newValue[0], newValue[1]]);
  };

  const handleDurationRangeChangeCommitted = (
    event: Event | SyntheticEvent,
    newValue: number | number[]
  ) => {
    if (!event || typeof newValue === "number") {
      return;
    }

    setDurationRange([newValue[0], newValue[1]]);

    //trigger query update
    setQuery({
      ...query,
      minDuration: Math.floor(scaleForDuration(newValue[0])),
      maxDuration: Math.floor(scaleForDuration(newValue[1])),
    });
  };

  useMemo(() => {
    const updatedQuery: ListingQueryParam = {
      ...query,
      contractAddress: collection.contractAddress,
    };
    if (updatedQuery.contractAddress === query.contractAddress) return;
    setQuery(updatedQuery);
  }, [collection, JSON.stringify(query), setQuery]);

  const handleResetFilters = () => {
    handlePriceRangeChangeCommitted({ target: {} } as Event, initialPriceRange);
    handleAprRangeChangeCommitted({ target: {} } as Event, initialAprRange);
    handleDurationRangeChangeCommitted({ target: {} } as Event, initialDurationRange);
    handleSortChange({ target: { value: "Recent" } } as SelectChangeEvent<string>);
    setCollection({} as Collection);
    setKeyword("");
  };
  const followersMarks = [
    {
      value: 0,
      scaledValue: 0,
      label: "0",
    },
    {
      value: 25,
      scaledValue: 10000,
      label: "10k",
    },
    {
      value: 50,
      scaledValue: 50000,
      label: "50k",
    },
    {
      value: 75,
      scaledValue: 250000,
      label: "250k",
    },
    {
      value: 100,
      scaledValue: 1000000,
      label: "1M",
    },
  ];

  const followersMarksForDuration = [
    {
      value: 0,
      scaledValue: 0,
      label: "0d",
    },
    {
      value: 20,
      scaledValue: 10,
      label: "10d",
    },
    {
      value: 40,
      scaledValue: 30,
      label: "1m",
    },
    {
      value: 60,
      scaledValue: 180,
      label: "6m",
    },
    {
      value: 80,
      scaledValue: 365,
      label: "1y",
    },
    {
      value: 100,
      scaledValue: 3650,
      label: "10y",
    },
  ];
  const scaleValues = (valueArray: any) => {
    return [scale(valueArray[0]), scale(valueArray[1])];
  };
  const scaleValuesMax = (valueArray: any) => {
    return scale(valueArray[1]);
  };
  const scaleValuesMin = (valueArray: any) => {
    return scale(valueArray[0]);
  };

  const scale = (value: any) => {
    const previousMarkIndex = Math.floor(value / 25);
    const previousMark = followersMarks[previousMarkIndex];
    const remainder = value % 25;
    if (remainder === 0) {
      return previousMark.scaledValue;
    }
    const nextMark = followersMarks[previousMarkIndex + 1];
    const increment = (nextMark.scaledValue - previousMark.scaledValue) / 25;
    return remainder * increment + previousMark.scaledValue;
  };

  const scaleForDuration = (value: any) => {
    const previousMarkIndex = Math.floor(value / 20);
    const previousMark = followersMarksForDuration[previousMarkIndex];
    const remainder = value % 20;
    if (remainder === 0) {
      return previousMark.scaledValue;
    }
    const nextMark = followersMarksForDuration[previousMarkIndex + 1];
    const increment = (nextMark.scaledValue - previousMark.scaledValue) / 20;
    return remainder * increment + previousMark.scaledValue;
  };

  function numFormatter(num: any) {
    if (num > 999 && num < 1000000) {
      return (num / 1000).toFixed(0) + "K"; // convert to K for number from > 1000 < 1 million
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(0) + "M"; // convert to M for number from > 1 million
    } else if (num < 900) {
      return num; // if value < 1000, nothing to do
    }
  }

  function numFormatterForDuration(num: any) {
    if (num > 0 && num < 30) {
      return `${Math.floor(num)}${Math.floor(num) > 1 ? " days" : " day"}`;
    } else if (num >= 30 && num < 365) {
      return `${Math.floor(num / 30)}${Math.floor(num / 30) > 1 ? " months" : " month"} ${
        Math.floor(num % 30) > 0
          ? Math.floor(num % 30) > 1
            ? Math.floor(num % 30) + " days"
            : Math.floor(num % 30) + " day"
          : ""
      }`;
    } else if (num >= 365) {
      const year = Math.floor(num / 365);
      const month = Math.floor((num % 365) / 30);
      const day = Math.floor((num % 365) % 30);
      return `${year} ${year > 1 ? "years" : "year"}${
        month > 0 ? (month > 1 ? " " + month + " months" : " " + month + " month") : ""
      }${day > 0 ? (day > 1 ? " " + day + " days" : " " + day + " day") : ""}`;
    } else {
      return "0 day";
    }
  }

  return (
    <Box sx={{ ml: "auto" }}>
      <AssetSearch
        keyword={keyword}
        setKeyword={setKeyword}
        setCollection={setCollection}
      />
      <Select
        labelId="asset-sort-by"
        label="Sort by"
        defaultValue="Recent"
        id="asset-sort-select"
        sx={{
          width: "100%",
          borderRadius: "10px",
          border: "3px solid rgba(0,0,0,0.1)",
          padding: "0 10px 0 20px",
        }}
        value={sort}
        onChange={handleSortChange}
        className={style["sortList"]}
      >
        <MenuItem value="Recent">Sort by: Recently listed</MenuItem>
        <MenuItem value="Oldest">Sort by: Oldest listed</MenuItem>
        <MenuItem value="Highest Price">Price: Highest - Lowest</MenuItem>
        <MenuItem value="Lowest Price">Price: Lowest - Highest</MenuItem>
      </Select>
      <Box
        className="flex fc"
        sx={{
          padding: "0 10px",
          mt: {
            xs: "20px",
            md: "40px",
          },
        }}
      >
        <ListSubheader
          sx={{
            background: "none",
            padding: "0",
            margin: {
              xs: "0 -10px 0px -10px",
              sm: "0 -10px 10px -10px",
            },
            lineHeight: "20px",
            position: "static",
          }}
        >
          Price range
        </ListSubheader>
        <Slider
          getAriaLabel={() => "Price range"}
          min={0}
          step={1}
          max={100}
          valueLabelFormat={numFormatter}
          marks={followersMarks}
          scale={scale}
          value={priceRange}
          onChange={handlePriceRangeChange}
          onChangeCommitted={handlePriceRangeChangeCommitted}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          sx={{
            margin: {
              xs: "0",
              sm: "10px 0",
            },
          }}
        />
        <Box className="flex fj-sb" sx={{ paddingTop: "10px" }}>
          <Typography sx={{ display: "none" }}>
            Values: {JSON.stringify(scaleValues(priceRange))} USD
          </Typography>
          <Typography className={style["minValueField"]}>
            <span>{JSON.stringify(scaleValuesMin(priceRange))} USD</span>
          </Typography>
          <Typography className={style["maxValueField"]}>
            <span>{JSON.stringify(scaleValuesMax(priceRange))} USD</span>
          </Typography>
        </Box>
      </Box>
      <Box
        className="flex fc"
        sx={{
          padding: "0 10px",
          borderTop: "1px solid rgba(0,0,0,0.1)",
          mt: "40px",
          pt: "40px",
        }}
      >
        <ListSubheader
          sx={{
            background: "none",
            padding: "0",
            margin: {
              xs: "0 -10px 0px -10px",
              sm: "0 -10px 10px -10px",
            },
            lineHeight: "20px",
            position: "static",
          }}
        >
          APR range
        </ListSubheader>
        <Slider
          getAriaLabel={() => "APR range"}
          value={aprRange}
          onChange={handleAprRangeChange}
          onChangeCommitted={handleAprRangeChangeCommitted}
          valueLabelDisplay="auto"
          getAriaValueText={aprValuetext}
          min={0}
          max={400}
        />
      </Box>
      <Box className="flex fj-sb">
        <span style={{ fontSize: "10px" }}>{aprRange[0]}%</span>
        <span style={{ fontSize: "10px" }}>{aprRange[1]}%</span>
      </Box>
      <Box
        className="flex fc"
        sx={{
          padding: "0 10px",
          borderTop: "1px solid rgba(0,0,0,0.1)",
          mt: "40px",
          pt: "40px",
        }}
      >
        <ListSubheader
          sx={{
            background: "none",
            padding: "0",
            margin: {
              xs: "0 -10px 0px -10px",
              sm: "0 -10px 10px -10px",
            },
            lineHeight: "20px",
            position: "static",
          }}
        >
          Duration
        </ListSubheader>
        <Slider
          getAriaLabel={() => "Duration range"}
          min={0}
          step={1}
          max={100}
          valueLabelFormat={numFormatterForDuration}
          marks={followersMarksForDuration}
          scale={scaleForDuration}
          value={durationRange}
          onChange={handleDurationRangeChange}
          onChangeCommitted={handleDurationRangeChangeCommitted}
          valueLabelDisplay="auto"
          getAriaValueText={durationValuetext}
          sx={{
            margin: {
              xs: "0",
              sm: "10px 0",
            },
          }}
        />
      </Box>
      <CollectionsFilter
        collections={collections?.filter(
          (collection) =>
            collectionAddresses?.includes(collection.contractAddress) &&
            collection.openListingCount > 0
        )}
        collection={collection}
        setCollection={setCollection}
        type="lend"
      />

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
    </Box>
  );
};

export default LenderAssetFilter;
