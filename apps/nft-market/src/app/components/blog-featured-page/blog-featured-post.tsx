import { Box, Grid, Paper, SxProps, Theme, ThemeProvider } from "@mui/material";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { USDBLight, USDBDark } from "@fantohm/shared-ui-themes";
import { RootState } from "../../store";
import style from "./blog-featured-post.module.scss";
import { BalanceHeroImage, BalanceLogoDark } from "@fantohm/shared/images";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { BlogPostDTO } from "../../types/backend-types";

/* eslint-disable-next-line */
export interface BlogFeaturedPostProps {
  children: JSX.Element | Array<JSX.Element>;
  className?: string;
  invertTheme?: boolean;
  setTheme?: "light" | "dark";
  tokenImage?: string;
  sx?: SxProps<Theme>;
  post: BlogPostDTO;
}

export const BlogFeaturedPost = (props: BlogFeaturedPostProps): JSX.Element => {
  const themeType = useSelector((state: RootState) => state.app.theme);
  const theme = useCallback(() => {
    if (props.invertTheme) {
      return themeType === "light" ? USDBDark : USDBLight;
    } else if (props.setTheme) {
      return props.setTheme === "light" ? USDBLight : USDBDark;
    } else {
      return themeType === "light" ? USDBLight : USDBDark;
    }
  }, [themeType, props.invertTheme, props.setTheme]);

  function openPost() {
    window.open("/blog/" + props.post.id, "_self");
  }
  return (
    <ThemeProvider theme={theme}>
      <Paper
        sx={{
          marginTop: "47px",
          padding: "0px",
          background: "none",
          display: "flex",
          borderRadius: "0px",
          ...props.sx,
        }}
        className={`daiCard ${style["cardWrapper"]} ${props.className} flexCenterCol`}
        onClick={openPost}
      >
        <Grid
          item
          container
          className={style["imgDiv"]}
          sx={{ width: { xs: "100%", md: "100%" }, height: "100%", paddingRight: "20px" }}
          md={6}
          xs={12}
          sm={12}
          columnSpacing={2}
          direction="row"
        >
          <img
            src={props.post && props.post.image ? props.post.image : BalanceHeroImage}
            alt="DAI token"
            className={style["daiIcon"]}
          />
        </Grid>
        <Grid item md={6} xs={12} sm={12} className={style["FeaturedDiv"]}>
          <Grid
            item
            className={style["email-div"]}
            order={{ lg: 1 }}
            style={{
              width: "100%",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0px",
              height: "40px",
              marginBottom: "5px",
            }}
          >
            <Box
              className={style["titleWrapper"]}
              style={{
                height: "40px",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <h3 className={style["categoryDisplay"]}>
                {props.post && props.post.blogCategory ? props.post.blogCategory : ""}
              </h3>
            </Box>
          </Grid>
          <Grid
            item
            className={style["emaildiv"]}
            md={12}
            order={{ lg: 1 }}
            style={{
              overflow: "hidden",
              width: "100%",
              paddingTop: "0px",
              marginTop: "-10px",
            }}
          >
            <h2 className={style["blogTitle"]}>
              {props.post ? props.post.blogTitle : "title"}
            </h2>
          </Grid>
          <Grid
            item
            className={style["emaildiv"]}
            md={12}
            order={{ lg: 1 }}
            style={{
              overflow: "hidden",
              width: "100%",
              paddingTop: "0px",
              marginTop: "-10px",
            }}
          >
            <h3 className={style["blogDescription"]}>
              Aenean congue sodales magna non sodales. Maecenas tristique vestibulum
              tellus, sit amet mattis diam ultrices non.
            </h3>
          </Grid>
          <Grid
            item
            className={style["twitterLogoDiv"]}
            md={8}
            order={{ lg: 1 }}
            sx={{
              overflow: "hidden",
              marginLeft: { xs: "5px" },
              paddingLeft: "0px !important",
              display: "flex",
            }}
          >
            <h2
              style={{
                fontSize: "16px",
                fontWeight: "normal",
                fontFamily: "inter",
              }}
            >
              {props.post && props.post.date
                ? new Date(props.post.date.slice(0, 10)).toDateString().slice(4)
                : ""}
            </h2>
            <span
              style={{
                lineHeight: "28px",
                fontSize: "37px",
                paddingLeft: "5px",
                paddingRight: "5px",
              }}
            >
              .
            </span>
            <h2
              style={{
                fontSize: "16px",
                fontWeight: "normal",
                fontFamily: "inter",
              }}
            >
              5 min read
            </h2>
          </Grid>
        </Grid>
      </Paper>
    </ThemeProvider>
  );
};

export default BlogFeaturedPost;
