import { Box, Grid } from "@mui/material";
import { useNavigate, useHref } from "react-router-dom";
import style from "./balance-icon-link.module.scss";
import { useCallback } from "react";

/* eslint-disable-next-line */
export interface IconLinkProps {
  icon: string | typeof import("*.png");
  title: string;
  text: string;
  link?: string | undefined;
}

export function BalanceIconLink({
  icon,
  title,
  link = undefined,
  text = "",
}: IconLinkProps) {
  const navigate = useNavigate();

  const handleOnClick = useCallback(() => {
    const isHttpLink = link?.startsWith("http");
    if (isHttpLink) window.open(link, "_blank");
    else if (link && link?.includes(".pdf")) navigate(link);
    else if (link) navigate(link);
  }, [navigate, link]);
  const setOpacity = link ? {} : { opacity: "0.4" };
  return (
    <Box className={style["iconLinkContainer"]}>
      <Box
        textAlign="start"
        sx={link ? { cursor: "pointer" } : {}}
        onClick={handleOnClick}
        style={setOpacity}
      >
        <Grid container rowSpacing={3}>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "start",
              alignItems: "start",
              paddingTop: "30px",
            }}
          >
            <Grid item xs={3}>
              <img src={icon as string} alt={title} className={style["iconImage"]} />
            </Grid>
            <Grid item xs={6}>
              <h3 className={style["title"]}>{title}</h3>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <h1 className={style["text"]}>{text}</h1>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "start",
            alignItems: "start",
          }}
        >
          <Grid item xs={12}>
            <h1 className={style["link"]}>Learn more &#11016;</h1>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default BalanceIconLink;
