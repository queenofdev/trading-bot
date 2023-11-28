import { createTheme } from "@mui/material/styles";

// TODO: Break repeated use color values out into list of consts declared here
// then set the values in riverTheme using the global color variables

const riverTheme = {
  color: "#FCFCFC",
  gold: "#F7C775",
  gray: "#A3A3A3",
  textHighlightColor: "#F7C775",
  backgroundColor: "rgba(12,76,75,1)",
  background: `
    linear-gradient(90deg, rgba(57,151,148,1), rgba(12,76,75,1));
    `,
  paperBg: "rgba(50,46,32,0.4)",
  modalBg: "#24242699",
  popoverBg: "rgba(50,46,32, 0.99)",
  menuBg: "#322e2080",
  backdropBg: "rgba(50,46,32, 0.5)",
  largeTextColor: "#F7C775",
  activeLinkColor: "#F5DDB4",
  activeLinkSvgColor:
    "brightness(0) saturate(100%) invert(84%) sepia(49%) saturate(307%) hue-rotate(326deg) brightness(106%) contrast(92%)",
  primaryButtonColor: "#333333",
  primaryButtonBG: "#F7C775",
  primaryButtonHoverBG: "#EDD8B4",
  secondaryButtonHoverBG: "rgba(50,46,32, 1)",
  outlinedPrimaryButtonHoverBG: "#F7C775",
  outlinedPrimaryButtonHoverColor: "#333333",
  outlinedSecondaryButtonHoverBG: "transparent",
  outlinedSecondaryButtonHoverColor: "#F7C775", //gold
  containedSecondaryButtonHoverBG: "rgba(255, 255, 255, 0.15)",
  graphStrokeColor: "rgba(255, 255, 255, .1)",
};

export const river = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: riverTheme.color,
    },
    secondary: {
      main: riverTheme.color,
    },
  },
});
