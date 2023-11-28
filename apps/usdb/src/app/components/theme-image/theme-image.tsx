import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  DarkBankIcon,
  LightBankIcon,
  DarkCardsIcon,
  LightCardsIcon,
  DarkDoughnutChartIcon,
  LightDoughnutChartIcon,
  DarkLockIcon,
  LightLockIcon,
  DarkShieldIcon,
  LightShieldIcon,
  DarkCarouselDai0,
  DarkCarouselDai1,
  DarkCarouselDai2,
  LightCarouselDai0,
  LightCarouselDai1,
  LightCarouselDai2,
  DarkCarouselFhm0,
  DarkCarouselFhm1,
  DarkCarouselFhm2,
  LightCarouselFhm0,
  LightCarouselFhm1,
  LightCarouselFhm2,
  DarkUSDBBanner1,
  DarkUSDBBanner2,
  LightUSDBBanner1,
  LightUSDBBanner2,
} from "@fantohm/shared/images";
import { RootState } from "../../store";
import { CSSProperties } from "@mui/styles";

type ThemeImage = {
  alt: string;
  lightIcon: string;
  darkIcon: string;
};

export interface ThemeImages {
  [key: string]: ThemeImage;
}

const imgMap: ThemeImages = {
  BankIcon: {
    alt: "Illustration depicting roman style building to infer a bank. USDB logo on the roof.",
    lightIcon: LightBankIcon,
    darkIcon: DarkBankIcon,
  },
  CardsIcon: {
    alt: "Illustration of Credit Cards Stacked",
    lightIcon: LightCardsIcon,
    darkIcon: DarkCardsIcon,
  },
  DoughnutChartIcon: {
    alt: "Illustration of doughnut chart with 1/4 filled in",
    lightIcon: LightDoughnutChartIcon,
    darkIcon: DarkDoughnutChartIcon,
  },
  LockIcon: {
    alt: "Illustration of padlock with a clock face",
    lightIcon: LightLockIcon,
    darkIcon: DarkLockIcon,
  },
  ShieldIcon: {
    alt: "Illustration of shield with a lock on front and graphs in front.",
    lightIcon: LightShieldIcon,
    darkIcon: DarkShieldIcon,
  },
  MintCarouselDai0: {
    alt: "Black background with dai logos and text",
    lightIcon: LightCarouselDai0,
    darkIcon: DarkCarouselDai0,
  },
  MintCarouselDai1: {
    alt: "Black background with dai logos and text",
    lightIcon: LightCarouselDai1,
    darkIcon: DarkCarouselDai1,
  },
  MintCarouselDai2: {
    alt: "Black background with dai logos and text",
    lightIcon: LightCarouselDai2,
    darkIcon: DarkCarouselDai2,
  },
  MintCarouselFhm0: {
    alt: "Black background with dai logos and text",
    lightIcon: LightCarouselFhm0,
    darkIcon: DarkCarouselFhm0,
  },
  MintCarouselFhm1: {
    alt: "Black background with dai logos and text",
    lightIcon: LightCarouselFhm1,
    darkIcon: DarkCarouselFhm1,
  },
  MintCarouselFhm2: {
    alt: "Black background with dai logos and text",
    lightIcon: LightCarouselFhm2,
    darkIcon: DarkCarouselFhm2,
  },
  USDBBanner1: {
    alt: "Gradient from purple to green to black with coins showing the USDB logo",
    lightIcon: LightUSDBBanner1,
    darkIcon: DarkUSDBBanner1,
  },
  USDBBanner2: {
    alt: "Bordered box with rounded corners. Large coin showing USDB logo",
    lightIcon: LightUSDBBanner2,
    darkIcon: DarkUSDBBanner2,
  },
};

interface ThemeImageProps {
  image:
    | "BankIcon"
    | "CardsIcon"
    | "DoughnutChartIcon"
    | "LockIcon"
    | "ShieldIcon"
    | "MintCarouselDai0"
    | "MintCarouselDai1"
    | "MintCarouselDai2"
    | "MintCarouselFhm0"
    | "MintCarouselFhm1"
    | "MintCarouselFhm2"
    | "USDBBanner1"
    | "USDBBanner2";
  invertTheme?: boolean;
  style?: CSSProperties;
}

export const ThemeImage = (props: ThemeImageProps): JSX.Element => {
  const themeType = useSelector((state: RootState) => state.app.theme);
  const [imgSrc, setImgSrc] = useState("");

  useEffect(() => {
    if (props.invertTheme) {
      setImgSrc(
        themeType === "dark"
          ? imgMap[props.image].lightIcon
          : imgMap[props.image].darkIcon
      );
    } else {
      setImgSrc(
        themeType === "light"
          ? imgMap[props.image].lightIcon
          : imgMap[props.image].darkIcon
      );
    }
  }, [themeType, props.invertTheme, props.image]);

  return <img src={imgSrc} alt={imgMap[props.image].alt} style={{ ...props.style }} />;
};
