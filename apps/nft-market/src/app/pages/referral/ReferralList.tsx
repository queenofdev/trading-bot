import { Box, Typography, Avatar } from "@mui/material";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import AvatarPlaceholder from "../../../assets/images/temp-avatar.png";
import { useMediaQuery } from "@material-ui/core";
import { addressEllipsis } from "@fantohm/shared-helpers";

export const ReferralList = ({
  data,
}: {
  data: {
    user: string;
    affiliate: string;
  }[];
}): JSX.Element => {
  const isDesktop = useMediaQuery("(min-width:767px)");

  const openLink = (address: string) => {
    window.open(`https://etherscan.io/address/${address}`, "_blank");
  };

  return (
    <Box>
      <Box display={"flex"} flexDirection={"row"} alignItems="center">
        <Typography variant="subtitle2" component="span">
          Accounts you've referred
        </Typography>
        <Box ml={1} display={"flex"}>
          <InfoIcon />
        </Box>
      </Box>
      <Box mt={2} sx={{ display: "flex" }}>
        {data && data.length > 0 ? (
          <Box>
            {data.map((item, index) => (
              <Box key={`referred-accounts-${index}`} onClick={() => openLink(item.user)}>
                {
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gridGap: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <Box sx={{ display: "block" }}>
                      <Avatar
                        sx={{ mr: { sm: "0" }, borderRadius: "2rem" }}
                        src={AvatarPlaceholder}
                      ></Avatar>
                    </Box>
                    <Typography variant="caption" component="span">
                      {isDesktop ? item.user : addressEllipsis(item.user)}
                    </Typography>
                  </Box>
                }
              </Box>
            ))}
          </Box>
        ) : (
          <Typography style={{ margin: "auto" }} variant="caption" component="span">
            You haven’t referred anyone yet
          </Typography>
        )}
      </Box>
    </Box>
  );
};
