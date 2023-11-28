import { createTheme } from "@mui/material/styles";
import { ThemeOptions } from "@mui/material";
import { makeStyles } from "@mui/styles";

import lightBG from "./images/USDB_gradient_light.png";
import darkBG from "./images/USDB_gradient_dark.png";
import {
  DarkUSDBBanner1,
  DarkUSDBBanner2,
  LightUSDBBanner1,
  LightUSDBBanner2,
} from "@fantohm/shared/images";

export const noBorderOutlinedInputStyles = makeStyles(() => ({
  root: {
    "& $notchedOutline": {
      border: "none",
    },
    "&:hover $notchedOutline": {
      border: "none",
    },
    "&$focused $notchedOutline": {
      border: "none",
    },
  },
  focused: {},
  notchedOutline: {},
}));

const theme = createTheme();

// light color pallet for use in themes
const usdbLightColors = {
  color: "#000",
  invertedColor: "#FFF",
  errorColor: "#CC335C",
  errorBackground: "#CC335C40",
  backgroundColor: "#ECECF4",
  paperBg: "#FFF",
  gray: "#696C80",
  iconButtonBg: "#181A1C0F",
};

// dark color pallet for use in themes
const usdbDarkColors = {
  color: "#FFF",
  invertedColor: "#000",
  errorColor: "#CC335C",
  errorBackground: "#CC335C40",
  backgroundColor: "#000",
  paperBg: "#0E0F10",
  gray: "#929BA0",
  iconButtonBg: "#181A1CD4",
};

// global theme options that apply to both light and dark
const globalTheme: ThemeOptions = {
  palette: {
    action: {
      disabledBackground: "#696C8029",
      disabled: "#696C80",
    },
    text: {
      disabled: "#696C80",
    },
  },
  typography: {
    fontFamily: ["Sora", "Roboto", "sans-serif"].join(","),
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          fontSize: "18px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "53px",
          padding: "2.5em",
          "&.MuiAppBar-root": {
            padding: "0",
            marginTop: "2em",
          },
          "&.dai": {
            border: "1px solid #F3AC28",
            borderRadius: "2em",
            background: "transparent",
            width: "100%",
            maxWidth: "525px",
          },
          "&.softGradient": {
            borderRadius: "2em",
          },
          "&.MuiMenu-paper": {
            borderRadius: "10px",
            padding: "0.5em",
          },
          "&.MuiAccordion-root, &.MuiAccordion-root:last-of-type": {
            padding: "1.75em 0 1em 0",
            borderRadius: "0",
          },
          "&.usdbBanner": {
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            width: "100%",
          },
          "&.usdbBanner2": {
            backgroundPosition: "85%",
            backgroundSize: "fill",
            backgroundRepeat: "no-repeat",
            width: "100%",
          },
        },
      },
      defaultProps: {
        elevation: 0,
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          // background: 'rgba(100, 100, 100, 0.1)',
          // backdropFilter: 'blur(33px)',
          // '-webkit-backdrop-filter': 'blur(33px)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "30px",
          padding: "1em 1.25em",
          fontSize: "1em",
          textTransform: "unset",
          "&.paperButton": {
            width: "100%",
            padding: "1em 1.25em",
          },
          "&.menuButton": {
            height: "1em",
            paddingTop: "1em",
            paddingBottom: "1em",
            paddingLeft: "1.25em",
            paddingRight: "1.25em",
            borderRadius: "1.5em",
            margin: "auto 0 auto 1em",
            fontSize: "1em",
          },
          "&.thinButton": {
            height: "1em",
            paddingTop: "1em",
            paddingBottom: "1em",
            paddingLeft: "1.25em",
            paddingRight: "1.25em",
            borderRadius: "1.5em",
            margin: "auto 0 auto 1em",
            fontSize: "1em",
          },
          "&.thinSquaredButton": {
            height: "1em",
            paddingTop: "1.25em",
            paddingBottom: "1.25em",
            paddingLeft: "1.25em",
            paddingRight: "1.25em",
            borderRadius: "0.5em",
            margin: "auto 0 auto 1em",
            fontSize: "1em",
          },
          "&.cardActionButton": {
            width: "100%",
          },
          "&.thin": {
            padding: "15px 27px",
          },
          "&.border": {
            background: "none",
          },
          "&.ultraThin": {
            padding: "5px 27px",
          },
          "&.portfolio": {
            height: "38px",
            paddingTop: "1em",
            paddingBottom: "1em",
            paddingRight: "1.5em",
            fontSize: "0.8em",
            background: "#384bff",
            color: "#FFF",
          },
          "&.portfolio svg": {
            height: "20px",
            width: "20px",
          },
          "&.fill": {
            fontSize: "14px",
            backgroundColor: "#000",
            borderRadius: "1.5em",
            color: "#FFF",
            padding: "15px 27px",
          },
          "&.inputButton": {
            height: "3em",
            borderRadius: "2em",
            width: "245px",
          },
          "&.Mui-disabled": {
            backgroundColor: "rgba(0, 0, 0, 0.25)",
          },
        },
        outlined: {
          borderRadius: "30px",
          padding: "1em 1.25em",
          fontSize: "1em",
        },
        contained: {
          "&.closeButton": {
            borderRadius: "50%",
            p: "0.5em",
            boxSizing: "border-box",
            minWidth: "16px",
          },
          "&.MuiButton-containedError": {
            color: "#CC335C",
            background: "#CC335C40",
          },
          "&.MuiButton-containedError:disabled": {
            color: "#CC335C",
            background: "#CC335C40",
          },
          "&:disabled": {
            background: "#696C8029",
            color: "#696C80",
          },
        },
      },
      defaultProps: {
        autoCapitalize: "none",
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          "&.MuiAccordionSummary-root": {
            paddingLeft: "0",
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "unset",
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          background: "transparent",
          "&.Mui-expanded": {
            margin: "0",
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          fontSize: "2em",
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          textAlign: "left",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        "&.heroBackground": {
          backgroundPosition: "top 0 right 50%",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          "&.contact": {
            width: "100%",
            paddingBottom: "1em",
            fontSize: "24px",
            marginBottom: "0.5em",
          },
          "&.outlined": {
            borderRadius: "2em",
            padding: "1em",
            ":before,:after": {
              border: "none",
            },
            ":hover:before,:hover:after": {
              border: "none",
            },
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontSize: "32px",
          borderRadius: "50%",
          height: "2.5em",
          width: "2.5em",
        },
      },
    },
  },
};

// light theme
const USDBLightBase: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: usdbLightColors.color,
      contrastText: usdbLightColors.invertedColor,
    },
    secondary: {
      main: usdbLightColors.invertedColor,
      contrastText: usdbLightColors.color,
    },
    background: {
      default: usdbLightColors.backgroundColor,
      paper: usdbLightColors.paperBg,
    },
    text: {
      primary: usdbLightColors.color,
      secondary: usdbLightColors.gray,
    },
    error: {
      main: usdbLightColors.errorColor,
      light: usdbLightColors.errorBackground,
    },
  },
  components: {
    MuiToolbar: {
      styleOverrides: {
        root: {
          color: usdbLightColors.color,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          "&.paperButton": {
            color: "#FFF",
            backgroundColor: "#000",
          },
          "&.menuButton": {
            border: "1px solid #000",
          },
          "&.thinButton": {
            background: "#000",
            color: "#FFF",
            border: "1px solid #000",
          },
          "&.border": {
            border: "1px solid #000",
            color: "#000",
          },
        },
        outlined: {
          "&, &:hover": {
            border: "3px solid #000",
          },
        },
        contained: {
          "&.closeButton": {
            color: usdbLightColors.color,
            background: usdbLightColors.iconButtonBg,
          },
          "&.inverted": {
            color: usdbLightColors.color,
            background: usdbDarkColors.color,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          color: usdbLightColors.color,
          "&.softGradient": {
            background:
              "linear-gradient(45deg, rgba(229,229,235,1) 15%, rgba(229,229,235,0.42) 90%)",
          },
          "&.MuiAccordion-root": {
            borderBottom: "2px solid #00000040",
          },
          "&.usdbBanner": {
            backgroundImage: `url(${LightUSDBBanner1})`,
          },
          "&.usdbBanner2": {
            backgroundImage: `url(${LightUSDBBanner2})`,
            [theme.breakpoints.down("sm")]: {
              background: "#f5f5f5",
            },
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        "&.heroBackground": {
          backgroundImage: `url(${lightBG})`,
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          "&.outlined": {
            border: "3px solid #000",
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: "2px solid #000",
          color: "#FFF",
          backgroundColor: "#000",
        },
      },
    },
  },
};

// dark theme
const USDBDarkBase: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: usdbDarkColors.color,
      contrastText: usdbDarkColors.invertedColor,
    },
    secondary: {
      main: usdbDarkColors.invertedColor,
      contrastText: usdbDarkColors.color,
    },
    background: {
      default: usdbDarkColors.backgroundColor,
      paper: usdbDarkColors.paperBg,
    },
    text: {
      primary: usdbDarkColors.color,
      secondary: usdbDarkColors.gray,
    },
    error: {
      main: usdbDarkColors.errorColor,
      light: usdbDarkColors.errorBackground,
    },
  },
  components: {
    MuiToolbar: {
      styleOverrides: {
        root: {
          color: usdbDarkColors.color,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          "&.paperButton": {
            color: "#FFF",
            backgroundColor: "#000",
          },
          "&.menuButton": {
            border: "1px solid #FFF",
          },
          "&.thinButton": {
            background: "transparent",
            color: "#FFF",
            border: "1px solid #FFF",
          },
          "&.border": {
            border: "1px solid #FFF",
            color: "#FFF",
          },
          "&.Mui-disabled": {
            color: usdbDarkColors.gray,
          },
        },
        outlined: {
          "&, &:hover": {
            border: "3px solid #FFF",
          },
        },
        contained: {
          "&.closeButton": {
            color: usdbDarkColors.color,
            background: usdbDarkColors.iconButtonBg,
          },
          "&.inverted": {
            color: usdbDarkColors.color,
            background: usdbLightColors.color,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          color: usdbDarkColors.color,
          "&.softGradient": {
            background:
              "linear-gradient(45deg, rgba(8,9,10,1) 0%, rgba(8,9,10,0.62) 5%, rgba(14,15,16,1) 90%)",
          },
          "&.MuiAccordion-root": {
            borderBottom: "2px solid #FFFFFF40",
          },
          "&.usdbBanner": {
            backgroundImage: `url(${DarkUSDBBanner1})`,
          },
          "&.usdbBanner2": {
            //backgroundImage: `url(${DarkUSDBBanner2})`,
            background: `no-repeat right 85% url(${DarkUSDBBanner2}), padding-box linear-gradient(to right, black, black), border-box linear-gradient(165deg, rgba(50,121,112,1) 0%, rgba(0,0,0,1) 50%, rgba(60,34,134,1) 100%)`,
            [theme.breakpoints.down("sm")]: {
              background: "#000",
            },
            border: "4px solid transparent",
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        "&.heroBackground": {
          backgroundImage: `url(${darkBG})`,
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          "&.outlined": {
            border: "3px solid #FFF",
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: "2px solid #FFF",
          color: "#FFF",
          backgroundColor: "transparent",
        },
      },
    },
  },
};

export const USDBLight = createTheme(globalTheme, USDBLightBase);
export const USDBDark = createTheme(globalTheme, USDBDarkBase);
