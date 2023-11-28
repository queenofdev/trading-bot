import { createTheme } from "@mui/material/styles";
import fonts from "./fonts";

export const darkTheme = {
  color: "#FCFCFC",
  gold: "#F7C775",
  gray: "#E0E0E0",
  textHighlightColor: "#F7C775",
  backgroundColor: "rgba(60,67,78,1)",
  background: `
    linear-gradient(90deg, rgba(102,114,129,1), rgba(60,67,78,1));
    `,
  paperBg: "rgba(60,67,78,0.4)",
  modalBg: "#24242699",
  popoverBg: "rgba(60,67,78, 0.99)",
  menuBg: "#36384080",
  backdropBg: "rgba(60,67,78, 0.5)",
  largeTextColor: "#F7C775",
  activeLinkColor: "#F5DDB4",
  activeLinkSvgColor:
    "brightness(0) saturate(100%) invert(84%) sepia(49%) saturate(307%) hue-rotate(326deg) brightness(106%) contrast(92%)",
  primaryButtonColor: "#3C434E",
  primaryButtonBG: "#F7C775",
  primaryButtonHoverBG: "#CCA551",
  secondaryButtonHoverBG: "rgba(60,67,78, 1)",
  outlinedPrimaryButtonHoverBG: "#F7C775",
  outlinedPrimaryButtonHoverColor: "#3C434E",
  outlinedSecondaryButtonHoverBG: "transparent",
  outlinedSecondaryButtonHoverColor: "#F7C775", //gold
  containedSecondaryButtonHoverBG: "rgba(255, 255, 255, 0.15)",
  graphStrokeColor: "rgba(255, 255, 255, .1)",
};

export const dark = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: darkTheme.color,
      contrastText: darkTheme.color,
    },
    secondary: {
      main: darkTheme.color,
    },
    background: {
      default: darkTheme.backgroundColor,
      paper: darkTheme.paperBg,
    },
    text: {
      primary: darkTheme.color,
      secondary: darkTheme.gray,
    },
  },
  typography: {
    fontFamily: ["Montserrat", "sans-serif"].join(","),
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: darkTheme.paperBg,
          "&.ohm-card": {
            backgroundColor: darkTheme.paperBg,
          },
          "&.ohm-card-secondary": {
            backgroundColor: darkTheme.paperBg,
          },
          "&.dapp-sidebar": {
            backgroundColor: darkTheme.paperBg,
          },
          "&.ohm-modal": {
            backgroundColor: darkTheme.modalBg,
          },
          "&.ohm-menu": {
            backgroundColor: darkTheme.menuBg,
            backdropFilter: "blur(33px)",
          },
          "&.ohm-popover": {
            backgroundColor: darkTheme.popoverBg,
            color: darkTheme.color,
            backdropFilter: "blur(15px)",
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        "@font-face": fonts,
        body: {
          background: darkTheme.background,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          color: darkTheme.primaryButtonColor,
          backgroundColor: darkTheme.gold,
          "&:hover": {
            backgroundColor: darkTheme.primaryButtonHoverBG,
            color: darkTheme.outlinedPrimaryButtonHoverColor,
          },
          "&:active": {
            backgroundColor: darkTheme.primaryButtonHoverBG,
            color: darkTheme.outlinedPrimaryButtonHoverColor,
          },
          "@media (hover:none)": {
            color: darkTheme.primaryButtonColor,
            backgroundColor: darkTheme.gold,
            "&:hover": {
              backgroundColor: darkTheme.primaryButtonHoverBG,
            },
          },
        },
        containedSecondary: {
          backgroundColor: darkTheme.paperBg,
          color: darkTheme.color,
          "&:hover": {
            backgroundColor: `${darkTheme.containedSecondaryButtonHoverBG} !important`,
          },
          "&:active": {
            backgroundColor: darkTheme.containedSecondaryButtonHoverBG,
          },
          "&:focus": {
            backgroundColor: darkTheme.paperBg,
          },
          "@media (hover:none)": {
            color: darkTheme.color,
            backgroundColor: darkTheme.paperBg,
            "&:hover": {
              backgroundColor: `${darkTheme.containedSecondaryButtonHoverBG} !important`,
            },
          },
        },
        outlinedPrimary: {
          color: darkTheme.gold,
          borderColor: darkTheme.gold,
          "&:hover": {
            color: darkTheme.outlinedPrimaryButtonHoverColor,
            backgroundColor: darkTheme.primaryButtonHoverBG,
          },
          "@media (hover:none)": {
            color: darkTheme.gold,
            borderColor: darkTheme.gold,
            "&:hover": {
              color: darkTheme.outlinedPrimaryButtonHoverColor,
              backgroundColor: `${darkTheme.primaryButtonHoverBG} !important`,
              textDecoration: "none !important",
            },
          },
        },
        outlinedSecondary: {
          color: darkTheme.color,
          borderColor: darkTheme.color,
          "&:hover": {
            color: darkTheme.outlinedSecondaryButtonHoverColor,
            backgroundColor: darkTheme.outlinedSecondaryButtonHoverBG,
            borderColor: darkTheme.gold,
          },
        },
        textPrimary: {
          color: "#A3A3A3",
          "&:hover": {
            color: darkTheme.gold,
            backgroundColor: "#00000000",
          },
          "&:active": {
            color: darkTheme.gold,
            borderBottom: "#F7C775",
          },
        },
        textSecondary: {
          color: darkTheme.color,
          "&:hover": {
            color: darkTheme.textHighlightColor,
          },
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          color: darkTheme.color,
          "&:hover": {
            color: darkTheme.textHighlightColor,
            textDecoration: "none",
            "&.active": {
              color: darkTheme.color,
            },
          },
          "&.active": {
            color: darkTheme.color,
            textDecoration: "underline",
          },
        },
      },
    },
  },
});
