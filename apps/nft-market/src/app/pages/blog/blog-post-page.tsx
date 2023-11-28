import {
  Box,
  Button,
  Grid,
  OutlinedInput,
  Paper,
  SxProps,
  Theme,
  ThemeProvider,
  Typography,
} from "@mui/material";
import {
  ReactChild,
  ReactFragment,
  ReactPortal,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { USDBLight, USDBDark } from "@fantohm/shared-ui-themes";
import { RootState } from "../../store";
import style from "./blog-post-page.module.scss";
import {
  AboutDivider,
  BalanceHeroImage,
  emailIcon,
  linkedinIcon,
  liqidIcon,
  twitterIcon,
} from "@fantohm/shared/images";
import { useLocation, useParams } from "react-router-dom";
import { BlogPostDTO } from "../../types/backend-types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { INLINES, Block, Inline, BLOCKS } from "@contentful/rich-text-types";
import { error, info } from "@fantohm/shared-web3";
import BlogPost from "../../components/blog-page/blog-post";
import { Helmet } from "react-helmet";

export interface BlogPostProps {
  className?: string;
  invertTheme?: boolean;
  setTheme?: "light" | "dark";
  tokenImage?: string;
  sx?: SxProps<Theme>;
  imageLink?: string;
  blogTitle?: string;
  product?: string;
  date?: string;
}

export type ContentfulLink = {
  value?: string;
};

export const BlogPostPage = (props: BlogPostProps): JSX.Element => {
  const themeType = useSelector((state: RootState) => state.app.theme);
  const { id } = useParams();
  const [post, setPost] = useState<BlogPostDTO | undefined>();

  const blogPosts = useSelector((state: RootState) => state.app.blogPosts);

  const theme = useCallback(() => {
    if (props.invertTheme) {
      return themeType === "light" ? USDBDark : USDBLight;
    } else if (props.setTheme) {
      return props.setTheme === "light" ? USDBLight : USDBDark;
    } else {
      return themeType === "light" ? USDBLight : USDBDark;
    }
  }, [themeType, props.invertTheme, props.setTheme]);

  useEffect(() => {
    if (blogPosts && blogPosts.blogPosts) {
      setPost(blogPosts.blogPosts.find((post: BlogPostDTO) => post.id === id));
    }
  }, [blogPosts]);

  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const onSubmitEmail = async () => {
    if (!email.includes("@") && !email.includes(".")) {
      // eslint-disable-next-line no-alert
      return dispatch(error("Please enter a valid email!"));
    }

    const xhr = new XMLHttpRequest();
    const url =
      "https://api.hsforms.com/submissions/v3/integration/submit/26031699/1ef63c14-2b97-4210-ae89-0d37a540dd13";
    const data = {
      fields: [
        {
          name: "email",
          value: email,
        },
      ],
    };

    const final_data = JSON.stringify(data);
    xhr.open("POST", url);
    // Sets the value of the 'Content-Type' HTTP request headers to 'application/json'
    xhr.setRequestHeader("Content-Type", "application/json");

    // Sends the request
    xhr.send(final_data);

    setEmail("");
    dispatch(info("Success!"));
    return;
  };
  const options = {
    renderText: (text: string) => {
      return text.split("\n").reduce((children: any, textSegment: any, index: number) => {
        return [...children, index > 0 && <br key={index} />, textSegment];
      }, []);
    },
    renderNode: {
      [INLINES.ENTRY_HYPERLINK]: (
        node: Block | Inline,
        children: boolean | ReactChild | ReactFragment | ReactPortal | null | undefined
      ) => (
        <a href={`/blog/${node.data["target"].fields.slug}`}>
          {`${(node.content[0] as any)["value"].toString()}`}
        </a>
      ),
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => (
        <img
          src={node.data?.target?.fields?.file?.url}
          alt={node.data?.target?.fields?.title}
          style={{ maxWidth: "90%" }}
        />
      ),
    },
  };
  return (
    <>
      <Helmet>
        <meta property="og:type" content="blog" />
        <meta property="og:locale" content="en-US" />
        <meta property="og:title" content={post?.blogTitle} />
        <meta property="og:description" content={post?.seoDescription} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={`http:${post?.image}`} />
        <meta property="og:image:secure_url" content={`https:${post?.image}`} />
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:title" content={post?.blogTitle} />
        <meta property="twitter:description" content={post?.seoDescription} />
        <meta property="twitter:url" content={window.location.href} />
        <meta property="twitter:image" content={post?.image} />
      </Helmet>
      <ThemeProvider theme={theme}>
        <div style={{ width: "100%", marginTop: "50px" }} className={style["changeDiv"]}>
          <Box
            className={style["titleWrapper"]}
            sx={{
              height: "2em",
              marginLeft: { xs: "25%", md: "40%" },
              marginRight: { xs: "25%", md: "40%" },
              maxWidth: { xs: "50%", md: "20%" },
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <h3
              style={{
                paddingTop: "5px",
                fontSize: "14px",
              }}
            >
              {post ? post.blogCategory : ""}
            </h3>
          </Box>
          <Box>
            <Grid
              container
              columnSpacing={2}
              rowSpacing={{ xs: 4, md: 0 }}
              style={{
                width: "100%",
                marginLeft: "auto",
                marginRight: "auto",
                maxWidth: "900px",
              }}
            >
              <Grid
                item
                md={12}
                order={{ lg: 1 }}
                className={style["iconsElement"]}
                style={{ textAlign: "center", maxWidth: "100%" }}
              >
                <h1>
                  {" "}
                  {blogPosts && blogPosts.blogPosts
                    ? blogPosts.blogPosts.find((post: BlogPostDTO) => post.id === id)
                        ?.blogTitle
                    : ""}
                </h1>
              </Grid>
              <Grid
                item
                xs={12}
                order={{ lg: 1 }}
                className={style["iconsElement"]}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <img
                  src={post && post.image ? post.image : BalanceHeroImage}
                  alt={post ? post.blogTitle : "Balancer Hero Logo"}
                  className={style["imageSymbol"]}
                />
              </Grid>

              <Grid
                item
                className="email-div"
                md={12}
                order={{ lg: 1 }}
                style={{ width: "100%", display: "flex", paddingRight: "16px" }}
              >
                <Grid item md={7} xs={12} style={{ display: "flex" }}>
                  <img alt="Liqd logo" src={liqidIcon} style={{ height: "63px" }} />
                  <Grid sx={{ marginLeft: "10px" }}>
                    <Typography
                      sx={{ fontSize: "18px", fontFamily: "Inter", marginTop: "5px" }}
                      className={style["liqdBlogDiv"]}
                    >
                      Liqd Blog
                    </Typography>
                    <Grid
                      item
                      className={style["twitterLogoDiv"]}
                      md={12}
                      order={{ lg: 1 }}
                      sx={{
                        overflow: "hidden",
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
                        {post && post.date
                          ? new Date(post.date.slice(0, 10)).toDateString().slice(4)
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
                </Grid>
                <Grid
                  item
                  md={5}
                  order={{ lg: 1 }}
                  style={{ display: "flex", alignItems: "center" }}
                  className={style["socialDiv"]}
                >
                  <Typography
                    sx={{ fontSize: "16px", fontFamily: "inter", color: "#6b737c" }}
                  >
                    shared this post:
                  </Typography>
                  <Box className={style["logoDiv"]}>
                    <img
                      alt="TwitterLogo"
                      src={twitterIcon}
                      style={{ width: "25px", height: "21px" }}
                    />
                  </Box>
                  <Box className={style["logoDiv"]}>
                    <img
                      alt="LinkedinLogo"
                      src={linkedinIcon}
                      style={{ width: "25px", height: "21px" }}
                    />
                  </Box>
                  <Box className={style["logoDiv"]}>
                    <img
                      alt="EmailLogo"
                      src={emailIcon}
                      style={{ width: "25px", height: "21px" }}
                    />
                  </Box>
                </Grid>
              </Grid>
              <Grid
                item
                className={style["blogTitleDiv"]}
                md={12}
                order={{ lg: 1 }}
                style={{
                  height: "100%",
                  overflow: "hidden",
                  textAlign: "start",
                  maxWidth: "90%",
                }}
              >
                <h2 style={{ fontSize: "25px" }}>
                  {blogPosts && blogPosts.blogPosts
                    ? blogPosts.blogPosts.find((post: BlogPostDTO) => post.id === id)
                        ?.blogTitle
                    : ""}
                </h2>
              </Grid>
              <Grid
                item
                md={12}
                order={{ lg: 1 }}
                style={{ maxWidth: "90%" }}
                className={style["iconsElement"]}
              >
                {blogPosts && blogPosts.blogPosts
                  ? documentToReactComponents(
                      blogPosts.blogPosts.find((post: BlogPostDTO) => post.id === id)
                        ?.content,
                      options
                    )
                  : ""}
              </Grid>
              <Grid
                item
                md={12}
                order={{ lg: 1 }}
                style={{ maxWidth: "90%" }}
                className={style["iconsElement"]}
              >
                {blogPosts && blogPosts.blogPosts
                  ? documentToReactComponents(
                      blogPosts.blogPosts.find((post: BlogPostDTO) => post.id === id)
                        ?.getInTouch,
                      options
                    )
                  : ""}
              </Grid>
            </Grid>
            <Grid item xs={12} order={{ lg: 1 }} className={style["socialDiv1"]}>
              <img
                alt="divider"
                src={AboutDivider}
                style={{ maxWidth: "100%", marginTop: "60px", marginBottom: "20px" }}
              />
              <Grid
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  sx={{ fontSize: "16px", fontFamily: "inter", color: "#6b737c" }}
                >
                  shared this post:
                </Typography>
                <Grid sx={{ display: "flex" }}>
                  <Box className={style["logoDiv1"]}>
                    <img
                      alt="TwitterLogo"
                      src={twitterIcon}
                      style={{ width: "17px", height: "14px" }}
                    />
                  </Box>
                  <Box className={style["logoDiv1"]}>
                    <img
                      alt="LinkedinLogo"
                      src={linkedinIcon}
                      style={{ width: "17px", height: "14px" }}
                    />
                  </Box>
                  <Box className={style["logoDiv1"]}>
                    <img
                      alt="EmailLogo"
                      src={emailIcon}
                      style={{ width: "17px", height: "14px" }}
                    />
                  </Box>
                </Grid>
              </Grid>
              <img
                alt="divider"
                src={AboutDivider}
                style={{ maxWidth: "100%", marginTop: "22px", marginBottom: "60px" }}
              />
            </Grid>
            <Grid
              item
              md={12}
              order={{ lg: 1 }}
              className={style["iconsElement1"]}
              style={{
                maxWidth: "90%",
                marginTop: "100px",
                marginLeft: "5%",
              }}
            >
              <h1 style={{ fontSize: "32px", fontFamily: "inter" }}>
                More from the balance blog
              </h1>
            </Grid>
            <Grid
              item
              xs={12}
              md={12}
              order={{ lg: 1 }}
              sx={{
                width: { xs: "90%", md: "90%" },
                marginLeft: { xs: "5%", md: "5%" },
                marginRight: { xs: "5%", md: "5%" },
                marginBottom: "20px",
              }}
            >
              <Grid container columnSpacing={2} rowSpacing={{ xs: 4, md: 0 }}>
                {blogPosts &&
                  blogPosts.blogPosts &&
                  blogPosts.blogPosts.slice(0, 3).map((post: BlogPostDTO, index: any) => (
                    <Grid
                      key={index}
                      item
                      className="email-div"
                      xs={12}
                      md={4}
                      order={{ lg: 1 }}
                      style={{ width: "100%" }}
                    >
                      <BlogPost post={post} className={style["blogPost"]}>
                        <h2 className={style["daiAPR"]}>{post.blogTitle}</h2>
                      </BlogPost>
                    </Grid>
                  ))}
              </Grid>
            </Grid>
            <Grid
              item
              className={style["email-div"]}
              md={12}
              order={{ lg: 1 }}
              style={{
                marginTop: "150px",
                marginBottom: "100px",
                maxWidth: "90%",
                marginLeft: "5%",
                marginRight: "5%",
              }}
            >
              <Paper
                style={{
                  width: "100%",
                  borderRadius: "80px",
                  backgroundSize: "100% auto",
                  backgroundPosition: "center right",
                  backgroundRepeat: "no-repeat",
                }}
                className={style["emailBox"]}
              >
                <Grid
                  container
                  style={{ width: "100%", height: "100%", display: "block" }}
                  columnSpacing={2}
                  rowSpacing={{ sm: 0, md: 4 }}
                >
                  <Grid
                    item
                    sm={12}
                    lg={6}
                    order={{ lg: 1 }}
                    className={style["iconsElement"]}
                    sx={{
                      maxWidth: "100% !important",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: "35px",
                        fontFamily: "monument extended",
                        marginBottom: "10px",
                      }}
                      className={style["NewsLetterTitle"]}
                    >
                      Join the Liqd newsletter
                    </Typography>
                    <Typography
                      style={{
                        fontSize: "22px",
                        fontFamily: "inter",
                        color: "#8994a2",
                        marginBottom: "10px",
                      }}
                      className={style["NewsLetterDesc"]}
                    >
                      Join the Liqd newsletter to stay update on the NFT space
                    </Typography>
                    <Grid
                      container
                      style={{
                        width: "50%",
                        marginLeft: "55px",
                      }}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "start",
                        alignItems: "start",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                      }}
                      className={style["EmailBackDiv"]}
                    >
                      <Grid
                        item
                        xs={8}
                        sm={12}
                        md={8}
                        order={{ lg: 1 }}
                        className={style["iconsElement"]}
                      >
                        <OutlinedInput
                          className={`${style["styledInput"]}`}
                          placeholder="Enter your email address"
                          value={email}
                          style={{ color: "#000000", borderColor: "#000000" }}
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        sm={12}
                        md={4}
                        order={{ lg: 1 }}
                        className={style["iconsElement"]}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ px: "3em", display: { md: "flex" } }}
                          className={style["link"]}
                          onClick={onSubmitEmail}
                        >
                          Subscribe
                        </Button>
                      </Grid>
                    </Grid>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontFamily: "inter",
                        color: "#8994a2",
                        paddingTop: "20px",
                      }}
                      className={style["spamDiv"]}
                    >
                      No spam. Never shared. Opt out at any time.
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Box>
        </div>
      </ThemeProvider>
    </>
  );
};

export default BlogPostPage;
