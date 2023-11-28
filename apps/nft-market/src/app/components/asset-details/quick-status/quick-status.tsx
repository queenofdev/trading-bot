import { prettifySeconds } from "@fantohm/shared-web3";
import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import { Listing } from "../../../types/backend-types";
import style from "./quick-status.module.scss";

export interface QuickStatusProps {
  listing?: Listing;
}

export const QuickStatus = ({ listing }: QuickStatusProps): JSX.Element => {
  const createdDate = useMemo(() => {
    if (!listing || !listing.createdAt) return;
    const createdTimestamp = Date.parse(listing.createdAt) / 1000;
    const createdDate = prettifySeconds(Date.now() / 1000 - createdTimestamp);
    return createdDate;
  }, [listing]);
  return (
    <>
      {listing && listing?.createdAt && (
        <Box>
          <Typography
            className={style["label"]}
            sx={{ color: "#8991A2;", fontSize: "0.875rem" }}
          >
            Listed
          </Typography>
          <Typography className={style["name"]} sx={{ fontSize: "1rem" }}>
            {createdDate} ago
          </Typography>
        </Box>
      )}
      {!listing && (
        <Box>
          <Typography>Asset Idle</Typography>
        </Box>
      )}
    </>
  );
};

export default QuickStatus;
