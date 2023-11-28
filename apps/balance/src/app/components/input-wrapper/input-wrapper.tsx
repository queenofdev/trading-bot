import { Box, Grid, Paper, SxProps, Theme, ThemeProvider } from "@mui/material";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { USDBLight, USDBDark } from "@fantohm/shared-ui-themes";
import { RootState } from "../../store";
import style from "./input-wrapper.module.scss";

/* eslint-disable-next-line */
export interface InputWrapperProps {
  children: JSX.Element | Array<JSX.Element>;
  className?: string;
  invertTheme?: boolean;
  theme?: Theme;
  sx?: SxProps<Theme>;
}

export const InputWrapper = (props: InputWrapperProps): JSX.Element => {
  const themeType = useSelector((state: RootState) => state.app.theme);

  const theme = useCallback(() => {
    if (props.invertTheme) {
      return themeType === "light" ? USDBDark : USDBLight;
    } else {
      return themeType === "light" ? USDBLight : USDBDark;
    }
  }, [themeType, props.invertTheme]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          border: 2,
          borderRadius: "2em",
          padding: "1em",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          ...props.sx,
        }}
        className={`inputWrapper ${style["inputWrapper"]} ${props.className}`}
      >
        {props.children}
      </Box>
    </ThemeProvider>
  );
};

export default InputWrapper;
