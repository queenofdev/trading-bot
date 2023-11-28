import { Box, Paper, SxProps, Theme, ThemeProvider } from "@mui/material";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { USDBLight, USDBDark } from "@fantohm/shared-ui-themes";
import { RootState } from "../../store";
import style from "./dai-card.module.scss";

/* eslint-disable-next-line */
export interface DaiCardProps {
  children: JSX.Element | Array<JSX.Element>;
  className?: string;
  invertTheme?: boolean;
  setTheme?: "light" | "dark";
  tokenImage?: string;
  sx?: SxProps<Theme>;
}

export const DaiCard = (props: DaiCardProps): JSX.Element => {
  const themeType = useSelector((state: RootState) => state.app.theme);

  const theme = useCallback(() => {
    if (props.invertTheme) {
      return themeType === "light" ? USDBDark : USDBLight;
    } else if (props.setTheme) {
      return props.setTheme === "light" ? USDBLight : USDBDark;
    } else {
      return themeType === "light" ? USDBLight : USDBDark;
    }
  }, [themeType, props.invertTheme, props.setTheme]);

  return (
    <ThemeProvider theme={theme}>
      <Paper
        sx={{ marginTop: "47px", ...props.sx }}
        className={`daiCard ${style["cardWrapper"]} ${props.className} flexCenterCol`}
      >
        <Box className={`flexCenterCol`}>
          <div className={`${style["iconWrapper"]}`}>
            <img src={props.tokenImage} alt="DAI token" className={style["daiIcon"]} />
          </div>
        </Box>
        <Box className="flexCenterCol" sx={{ mt: "1em", width: "100%" }}>
          {props.children}
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default DaiCard;
