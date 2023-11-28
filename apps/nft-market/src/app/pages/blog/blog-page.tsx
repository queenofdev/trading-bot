import {
  Box,
  Button,
  Container,
  Grid,
  InputBase,
  OutlinedInput,
  Paper,
  Typography,
} from "@mui/material";
import style from "./blog-page.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { error, info } from "@fantohm/shared-web3";
import { useEffect, useState } from "react";
import { BlogPostDTO } from "../../types/backend-types";
import BlogFeaturedPost from "../../components/blog-featured-page/blog-featured-post";
import BlogPost from "../../components/blog-page/blog-post";
import { AboutDivider } from "@fantohm/shared/images";
import { styled } from "@material-ui/core";
import { loadAppDetails } from "../../store/reducers/app-slice";

export const BlogPage = (): JSX.Element => {
  const [email, setEmail] = useState("");
  const [sortValue, setSortValue] = useState("tutorials");
  const allBlogPosts = useSelector((state: RootState) => state.app.blogPosts);
  const [blogPosts, setBlogPosts] = useState<BlogPostDTO[]>();
  const dispatch = useDispatch();
  const DisplayBlogPosts = allBlogPosts?.blogPosts[0];

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

    // xhr.onreadystatechange = function () {
    //   if (xhr.readyState == 4 && xhr.status == 200) {
    //     alert(xhr.responseText); // Returns a 200 response if the submission is successful.
    //   } else if (xhr.readyState == 4 && xhr.status == 400) {
    //     alert(xhr.responseText); // Returns a 400 error the submission is rejected.
    //   } else if (xhr.readyState == 4 && xhr.status == 403) {
    //     alert(xhr.responseText); // Returns a 403 error if the portal isn't allowed to post submissions.
    //   } else if (xhr.readyState == 4 && xhr.status == 404) {
    //     alert(xhr.responseText); //Returns a 404 error if the formGuid isn't found
    //   }
    // };

    // Sends the request
    xhr.send(final_data);

    setEmail("");
    dispatch(info("Success!"));
    return;
  };

  useEffect(() => {
    dispatch(loadAppDetails());
  }, []);

  useEffect(() => {
    if (allBlogPosts && allBlogPosts.blogPosts) {
      if (sortValue === "tutorials") {
        setBlogPosts(allBlogPosts.blogPosts);
      } else
        setBlogPosts(
          allBlogPosts.blogPosts.filter(
            (posts: { blogCategory: string }) =>
              posts.blogCategory.toLowerCase() === sortValue.toLowerCase()
          )
        );
    }
  }, [allBlogPosts, sortValue]);

  const handleChange = (value: string) => {
    setSortValue(value);
  };

  const Search = styled("div")(({ theme }) => ({
    display: "flex",
    position: "relative",
    border: "1px solid grey",
    paddingLeft: "15px",
    borderRadius: "19px",
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    // padding: theme.spacing(0, 2),
    height: "100%",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: "10px",
      fontSize: "18px",
      transition: theme.transitions.create("width"),
      width: "100%",
    },
  }));

  return (
    <Container
      maxWidth="xl"
      className={style["heroContainer"]}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: { xs: "52px", md: "112px" },
          width: "100%",
        }}
        className={style["hero"]}
      >
        <Grid item container columnSpacing={2} rowSpacing={{ xs: 4, md: 0 }}>
          <Grid
            item
            md={12}
            order={{ lg: 1 }}
            sx={{ width: { xs: "100%", md: "100%" } }}
            className={style["blogPostsDivF"]}
          >
            <Grid item md={12}>
              {blogPosts && (
                <Grid item xs={12} sm={12} md={12} order={{ lg: 1 }}>
                  <BlogFeaturedPost post={DisplayBlogPosts} className={style["blogPost"]}>
                    <h2 className={style["daiAPR"]}>{blogPosts[0]?.blogTitle}</h2>
                  </BlogFeaturedPost>
                </Grid>
              )}
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "70px",
              }}
            >
              <img src={AboutDivider as string} alt="divider" style={{ width: "100%" }} />
            </Grid>
          </Grid>
          {/* <Grid
            item
            md={12}
            order={{ lg: 1 }}
            style={{ width: "100%" }}
            sx={{
              display: { md: "flex" },
              justifyContent: "space-between",
              marginBottom: "40px",
            }}
            className={style["classifyDiv"]}
          >
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="tutorials"
                name="radio-buttons-group"
                sx={{ display: "flex", flexDirection: "row" }}
                onChange={(e) => {
                  handleChange(e.target.value);
                }}
              >
                <FormControlLabel
                  className={style["radiobutton"]}
                  value="tutorials"
                  control={<Radio />}
                  label="Tutorials"
                />
                <FormControlLabel
                  className={style["radiobutton"]}
                  value="announcements"
                  control={<Radio />}
                  label="Announcements"
                />
                <FormControlLabel
                  className={style["radiobutton"]}
                  value="competitions"
                  control={<Radio />}
                  label="Competitions"
                />
                <FormControlLabel
                  className={style["radiobutton"]}
                  value="news"
                  control={<Radio />}
                  label="News"
                />
              </RadioGroup>
            </FormControl>
            <Search className={style["searchDiv"]}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
          </Grid> */}
          <Grid
            item
            md={12}
            order={{ lg: 1 }}
            sx={{ width: { xs: "100%", md: "100%" }, paddingBottom: "32px" }}
            className={style["blogPostsDiv"]}
          >
            <Grid item container columnSpacing={2} rowSpacing={{ xs: 4, md: 0 }}>
              {blogPosts &&
                blogPosts.map((post: BlogPostDTO, index) => (
                  <Grid item xs={12} sm={12} md={4} order={{ lg: 1 }} key={index}>
                    <BlogPost post={post} className={style["blogPost"]}>
                      <h2 className={style["daiAPR"]}>{post.blogTitle}</h2>
                    </BlogPost>
                  </Grid>
                ))}
            </Grid>
          </Grid>
          <Grid
            item
            className="email-div"
            md={12}
            order={{ lg: 1 }}
            style={{ width: "100%", marginTop: "100px" }}
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
                item
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
                      maxWidth: "600px",
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
                        style={{
                          width: "100%",
                        }}
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
          <Grid item lg={12} className={style["heroTextContent"]}></Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default BlogPage;
