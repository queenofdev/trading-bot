import { NorthEast } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../store";
import style from "./balance-vault-details-page.module.scss";

export type ExternalLinkProps = {
  href: string;
  title: string;
  target: string;
};

export const ExternalLink = ({ href, title, target }: ExternalLinkProps) => {
  const themeType = useSelector((state: RootState) => state.app.theme);
  const lowContrastBg =
    themeType === "light"
      ? style["low-contrast-bg-light"]
      : style["low-contrast-bg-dark"];
  const lowContrastText =
    themeType === "light"
      ? style["low-contrast-text-light"]
      : style["low-contrast-text-dark"];

  if (href === "#") {
    return <></>;
  }

  return (
    <Box
      sx={{ p: "0.75em" }}
      className={`flex fr jf-c ai-c rounded ${lowContrastBg} ${lowContrastText}`}
    >
      <a href={href} target={target}>
        <span className={lowContrastText}>{title}</span>
      </a>
      <NorthEast />
    </Box>
  );
};
