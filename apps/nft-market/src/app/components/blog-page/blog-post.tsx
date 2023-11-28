import { Box, Grid, Paper, SxProps, Theme, ThemeProvider } from "@mui/material";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { USDBLight, USDBDark } from "@fantohm/shared-ui-themes";
import { RootState } from "../../store";
import style from "./blog-post.module.scss";
import { BalanceHeroImage, BalanceLogoDark } from "@fantohm/shared/images";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { BlogPostDTO } from "../../types/backend-types";

/* eslint-disable-next-line */
export interface BlogPostProps {
  children: JSX.Element | Array<JSX.Element>;
  className?: string;
  invertTheme?: boolean;
  setTheme?: "light" | "dark";
  tokenImage?: string;
  sx?: SxProps<Theme>;
  post: BlogPostDTO;
}

export const BlogPost = (props: BlogPostProps): JSX.Element => {
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
        className={`daiCard ${style["cardWrapper"]} ${props.className} flexCenterCol`}
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
            style={{ width: "100%", padding: 0 }}
          >
            <section
              style={{
                height: "270px",
                borderRadius: "25px",
                backgroundImage:
                  props.post && props.post.image
                    ? `url('${props.post.image}')`
                    : `url('${BalanceHeroImage}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            ></section>
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
            className="email-div"
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
            md={8}
            order={{ lg: 1 }}
            sx={{
              overflow: "hidden",
              marginLeft: { xs: "5px" },
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

export default BlogPost;
