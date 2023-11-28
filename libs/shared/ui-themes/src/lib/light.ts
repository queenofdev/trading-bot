import { createTheme } from "@mui/material/styles";

export const lightTheme = {
  color: "#253449",
  gold: "#F8CC82",
  gray: "#A3A3A3",
  blueish_gray: "#768299",
  textHighlightColor: "#93AEBC", // "#F4D092",
  backgroundColor: "#AFCDE9",
  // background:
  // "radial-gradient(circle at 25% 0%, rgba(227,255,240,.5), rgba(227,255,240,0) 50%), radial-gradient(circle at 80% 80%, rgba(131,165,203,.5), rgba(131,165,203,0) 50%)",
  background: "linear-gradient(180deg, #AFCDE9 1%, #F7FBE7 100%)",
  paperBg: "rgba(255, 255, 255, 0.6)",
  modalBg: "#FAFAFAEF",
  popoverBg: "rgba(255, 255, 255, 0.95)",
  menuBg: "rgba(255, 255, 255, 0.5)",
  backdropBg: "rgba(200, 200, 200, 0.4)",
  largeTextColor: "#759AAE",
  activeLinkColor: "#222222",
  activeLinkSvgColor:
    "invert(64%) sepia(11%) saturate(934%) hue-rotate(157deg) brightness(90%) contrast(86%)",
  // primaryButtonBG: "#759AAE",
  primaryButtonBG: "#93AEBC",
  primaryButtonHoverBG: "#759AAE",
  // these need fixing
  primaryButtonHoverColor: "#333333",
  secondaryButtonHoverBG: "rgba(54, 56, 64, 1)",
  outlinedPrimaryButtonHoverBG: "#F8CC82",
  outlinedPrimaryButtonHoverColor: "#333333",
  outlinedSecondaryButtonHoverBG: "#FCFCFC",
  outlinedSecondaryButtonHoverColor: "#333333",
  containedSecondaryButtonHoverBG: "#33333333",
  graphStrokeColor: "rgba(37, 52, 73, .2)",
};

export const light = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: lightTheme.color,
    },
    secondary: {
      main: lightTheme.color,
    },
  },
});
