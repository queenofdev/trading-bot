import { Button, Grid } from "@mui/material";
import { useNavigate, useHref } from "react-router-dom";
import style from "./investment-options.module.scss";
import { useCallback } from "react";

/* eslint-disable-next-line */
export interface IconLinkProps {
  icon: string | typeof import("*.png");
  title: string;
  text: string;
  link?: string | undefined;
  linkText?: string | undefined;
}

export function InvestmentLink({
  icon,
  title,
  link = undefined,
  text = "",
  linkText = "",
}: IconLinkProps) {
  const navigate = useNavigate();

  const handleOnClick = useCallback(() => {
    const isHttpLink = link?.startsWith("http");
    if (isHttpLink) window.open(link, "_blank");
    else if (link) navigate(link);
  }, [navigate, link]);
  const setOpacity = link ? {} : { opacity: "0.4" };
  return (
    <Grid container className={style["iconLinkContainer"]}>
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "start",
          paddingTop: "30px",
        }}
      >
        <Grid item xs={4}>
          <img src={icon as string} alt={title} className={style["iconImage"]} />
        </Grid>
        <Grid item xs={12}>
          <h1 className={style["title"]}>{title}</h1>
        </Grid>
        <Grid item xs={12}>
          <h1 className={style["text"]}>{text}</h1>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOnClick}
            sx={{ px: "3em", display: { xs: "none", md: "flex" } }}
            className={style["link"]}
          >
            {linkText}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default InvestmentLink;
