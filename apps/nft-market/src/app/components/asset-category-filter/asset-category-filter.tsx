import { Box, ToggleButton } from "@mui/material";
import "./asset-category-filter.module.scss";

/* eslint-disable-next-line */
export interface AssetCategoryFilterProps {}

export const assetCategories = ["Art", "Gaming", "Video", "Music"];

export const AssetCategoryFilter = (props: AssetCategoryFilterProps): JSX.Element => {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
      <ToggleButton value="All">All assets</ToggleButton>
      {assetCategories.map((cat: string, index: number) => (
        <ToggleButton value={cat} key={`catfilter-${index}`}>
          {cat}
        </ToggleButton>
      ))}
    </Box>
  );
};

export default AssetCategoryFilter;
