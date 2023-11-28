/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-useless-fragment */
import { Box, Button, Grid } from "@mui/material";
import { useNavigate, useHref } from "react-router-dom";
import style from "./balance-about-page.module.scss";
import { useCallback } from "react";
import { AboutDivider } from "@fantohm/shared/images";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

/* eslint-disable-next-line */
export interface IconLinkProps {
  icon: string | typeof import("*.png");
  itemid?: string | undefined;
  title: string;
  text: string;
  link?: string | undefined;
  docsLink?: string | undefined;
  learnMore?: string | undefined;
}

export function BalanceAboutTile({
  icon,
  itemid = undefined,
  title,
  link = undefined,
  text = "",
  docsLink = undefined,
  learnMore = undefined,
}: IconLinkProps) {
  const navigate = useNavigate();
  const themeType = useSelector((state: RootState) => state.app.theme);

  const handleOnClick = useCallback(() => {
    const isHttpLink = link?.startsWith("http");
    if (isHttpLink) window.open(link, "_blank");
    else if (link) navigate(link);
  }, [navigate, link]);

  const handleOnDocsClick = useCallback(() => {
    const toLink = docsLink;
    const isHttpLink = toLink?.startsWith("http");
    if (isHttpLink) window.open(toLink, "_blank");
    else if (docsLink) navigate(docsLink);
  }, [navigate, docsLink, learnMore]);

  const handleOnLearnClick = useCallback(() => {
    const toLink = learnMore;
    const isHttpLink = toLink?.startsWith("http");
    if (isHttpLink) window.open(toLink, "_blank");
    else if (learnMore) window.open(learnMore);
  }, [navigate, docsLink, learnMore]);

  return (
    <Grid
      container
      rowSpacing={6}
      className={style["productGrid"]}
      style={{ marginTop: "100px" }}
    >
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "50px",
          paddingLeft: { sm: "0%", md: "5%" },
          paddingRight: { sm: "0%", md: "5%" },
          width: { sm: "100%", md: "100%" },
        }}
      >
        <img
          src={icon as string}
          alt={title}
          style={{ width: "100%" }}
          className={style["image"]}
        />
      </Grid>
      <Grid
        item
        sm={12}
        md={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "start",
          paddingTop: "30px",
          paddingLeft: "50px",
          paddingRight: "100px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
          className={style["iconLinkContainer"]}
        >
          <Grid item xs={12} md={12}>
            <h2
              className={style["title"]}
              style={{ marginBottom: itemid === "ecosystem" ? "40px" : "0px" }}
            >
              {title}
            </h2>
          </Grid>

          <Grid item xs={12} md={12}>
            <h3 className={style["text"]} dangerouslySetInnerHTML={{ __html: text }} />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              flexDirection: { xs: "row", md: "row" },
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "30px",
            }}
            style={{ color: "primary" }}
          >
            {link === undefined ? (
              itemid !== "ecosystem" && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOnDocsClick}
                  sx={{
                    px: "4em",
                    display: { md: "flex" },
                    color: themeType === "dark" ? "#FFFFFF" : "#000000",
                    borderColor: themeType === "dark" ? "#FFFFFF" : "#000000",
                  }}
                  style={{ color: "primary" }}
                  className={style["link"]}
                  disabled={true}
                >
                  Coming soon
                </Button>
              )
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleOnClick}
                sx={{
                  px: "4em",
                  display: { md: "flex" },
                  color: themeType === "dark" ? "#FFFFFF" : "#000000",
                  borderColor: themeType === "dark" ? "#FFFFFF" : "#000000",
                }}
                className={style["link"]}
                disabled={false}
              >
                {itemid === "balance-pass" ? "View on Opensea" : "Enter app"}
              </Button>
            )}
            {itemid === undefined ? <a id={itemid} /> : <a id={itemid} />}
            {docsLink !== undefined ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleOnDocsClick}
                sx={{
                  px: "4em",
                  display: { md: "flex" },
                  marginLeft: "20px",
                  color: themeType === "dark" ? "#FFFFFF" : "#000000",
                  borderColor: themeType === "dark" ? "#FFFFFF" : "#000000",
                }}
                className={style["link"]}
                style={{ color: "primary" }}
              >
                Documentation
              </Button>
            ) : (
              <></>
            )}
            {learnMore !== undefined ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleOnLearnClick}
                sx={{
                  px: "4em",
                  display: { md: "flex" },
                  marginLeft: "20px",
                  color: themeType === "dark" ? "#FFFFFF" : "#000000",
                  borderColor: themeType === "dark" ? "#FFFFFF" : "#000000",
                }}
                className={style["link"]}
              >
                Learn more
              </Button>
            ) : (
              <></>
            )}
          </Grid>
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
        style={{ paddingTop: "50px" }}
      >
        <img src={AboutDivider as string} alt="divider" style={{ width: "100%" }} />
      </Grid>
    </Grid>
  );
}

export default BalanceAboutTile;
