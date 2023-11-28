import { addressEllipsis } from "@fantohm/shared-helpers";
import { Avatar, Box, CircularProgress, SxProps, Theme } from "@mui/material";
import tmpAvatar from "../../../assets/images/temp-avatar.png";
import style from "./simple-profile.module.scss";
import { useGetUserQuery } from "../../api/backend-api";

export interface SimpleProfileProps {
  address: string;
  sx?: SxProps<Theme>;
}

export const SimpleProfile = ({ address, sx }: SimpleProfileProps): JSX.Element => {
  const { data: userProfile, isLoading } = useGetUserQuery(address, { skip: !address });

  if (isLoading) {
    return (
      <Box className="flex fr fj-c">
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box className="flex fr ai-c" sx={sx}>
      <Avatar src={userProfile?.profileImageUrl || tmpAvatar} />
      <Box className="flex fc" sx={{ ml: "1em" }}>
        <span className={style["ownerName"]}>
          {userProfile?.name || addressEllipsis(address)}
        </span>
        <span className={style["ownerAddress"]}>{addressEllipsis(address)}</span>
      </Box>
    </Box>
  );
};

export default SimpleProfile;
