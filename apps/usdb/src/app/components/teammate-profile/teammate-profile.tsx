import { Avatar, Box } from "@mui/material";
import style from "./teammate-profile.module.scss";

export interface Teammate {
  name: string;
  details: string;
}

export interface TeammateProfileProps {
  teammate: Teammate;
}

export const TeammateProfile = (props: TeammateProfileProps): JSX.Element => {
  return (
    <Box className={`${style["wrapper"]} flexCenterCol`}>
      <Avatar className={style["initial"]}>
        {props.teammate.name.slice(0, 1).toUpperCase()}
      </Avatar>
      <Box className={style["name"]}>{props.teammate.name}</Box>
      <Box className={style["details"]}>{props.teammate.details}</Box>
    </Box>
  );
};

export default TeammateProfile;
