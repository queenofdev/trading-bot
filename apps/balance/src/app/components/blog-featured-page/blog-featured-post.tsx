import { Box, Grid, Paper, SxProps, Theme, ThemeProvider } from "@mui/material";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { USDBLight, USDBDark } from "@fantohm/shared-ui-themes";
import { RootState } from "../../store";
import style from "./blog-featured-post.module.scss";
import { BalanceHeroImage, BalanceTwitter } from "@fantohm/shared/images";
import { BlogPostDTO } from "@fantohm/shared-helpers";

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
          borderRadius: "25px",
          ...props.sx,
        }}
        className={`${style["cardWrapper"]} ${props.className} flexCenterCol`}
        onClick={openPost}
      >
        <Grid
          container
          sx={{ width: { xs: "100%", md: "100%" }, height: "100%" }}
          columnSpacing={2}
          rowSpacing={{ xs: 4, md: 0 }}
          direction="row"
        >
          <Grid
            item
            className="email-div"
            md={12}
            order={{ lg: 1 }}
            style={{
              width: "100%",
              overflow: "hidden",
              backgroundColor: "#f4f4f4",
              height: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={props.post && props.post.image ? props.post.image : BalanceHeroImage}
              alt="DAI token"
              className={style["daiIcon"]}
            />
            <Box
              className={style["titleWrapper"]}
              style={{
                height: "30px",
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
              height: "10%",
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
            className={style["twitterLogoDiv"]}
            md={2}
            order={{ lg: 1 }}
            sx={{ justifyContent: "center", marginTop: { xs: "8px" } }}
          >
            <img
              src={BalanceTwitter}
              alt="Balance Twitter logo"
              style={{ width: "40px" }}
              className={style["TwitterLogo"]}
            />
          </Grid>
          <Grid
            item
            className={style["twitterLogoDiv"]}
            md={8}
            order={{ lg: 1 }}
            sx={{
              height: "100%",
              overflow: "hidden",
              marginLeft: { xs: "5px" },
              paddingLeft: "0px !important",
            }}
          >
            <h2 style={{ fontSize: "15px", marginLeft: "10px", marginBottom: "0px" }}>
              The Balance Blog
            </h2>
            <h2 style={{ fontSize: "15px", marginLeft: "10px", marginTop: "0px" }}>
              {props.post && props.post.date
                ? new Date(props.post.date.slice(0, 10)).toDateString().slice(4)
                : ""}
            </h2>
          </Grid>
        </Grid>
      </Paper>
    </ThemeProvider>
  );
};

export default BlogFeaturedPost;
