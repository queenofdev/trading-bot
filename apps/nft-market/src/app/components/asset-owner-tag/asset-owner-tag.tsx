import { Avatar, Box, SxProps, Theme, Typography } from "@mui/material";
import style from "./asset-owner-tag.module.scss";
import tmpAvatar from "../../../assets/images/temp-avatar.png";
import { Asset } from "../../types/backend-types";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { addressEllipsis } from "@fantohm/shared-helpers";

export interface AssetOwnerTagProps {
  asset: Asset;
  sx?: SxProps<Theme>;
}

export const AssetOwnerTag = ({ asset, sx }: AssetOwnerTagProps): JSX.Element => {
  const user = useSelector((state: RootState) => state.backend.user);

  const ownerName = useMemo(() => {
    if (!asset.owner) return;
    if (asset.owner && asset.owner.address === user.address) {
      return "You";
    }
    if (asset.owner && asset.owner.name) {
      return asset.owner.name;
    }
    return addressEllipsis(asset.owner.address);
  }, [asset.owner, user]);

  return (
    <Box className={style["aotContainer"]} sx={sx}>
      <Avatar
        src={tmpAvatar}
        sx={{ width: "60px", height: "60px", marginRight: "15px" }}
      />
      <Box />
      <Box className={style["aotOwnerTitle"]}>
        <Typography
          className={style["label"]}
          sx={{ color: "#8991A2;", fontSize: "0.875rem" }}
        >
          Owner
        </Typography>
        <Typography className={style["name"]} sx={{ fontSize: "1rem" }}>
          {ownerName}
        </Typography>
      </Box>
    </Box>
  );
};

export default AssetOwnerTag;
