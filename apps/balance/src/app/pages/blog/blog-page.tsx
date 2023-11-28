import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  OutlinedInput,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import style from "./blog-page.module.scss";
import { BlogBanner, BalanceHeroImage } from "@fantohm/shared/images";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { error, info } from "@fantohm/shared-web3";
import { useEffect, useState } from "react";
import BlogPost from "../../components/blog-page/blog-post";
import Head from "../../components/template/head";
import BlogFeaturedPost from "../../components/blog-featured-page/blog-featured-post";
import { BlogPostDTO } from "@fantohm/shared-helpers";

export const BlogPage = (): JSX.Element => {
  const [email, setEmail] = useState("");
  const [sortValue, setSortValue] = useState("all");
  const allBlogPosts = useSelector((state: RootState) => state.app.blogPosts);
  const [blogPosts, setBlogPosts] = useState<BlogPostDTO[]>();

  const dispatch = useDispatch();
  async function createContact() {
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key":
          "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",
      },
      body: JSON.stringify({ updateEnabled: true, email: email }),
    };

    await fetch("https://api.sendinblue.com/v3/contacts", options)
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
  }

  const onSubmitEmail = async () => {
    if (!email.includes("@") && !email.includes(".")) {
      // eslint-disable-next-line no-alert
      return dispatch(error("Please enter a valid email!"));
    }
    // await createContact();
    // const options = {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //     "api-key":
    //       "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",
    //   },
    //   body: JSON.stringify({ emails: [email] }),
    // };

    // await fetch("https://api.sendinblue.com/v3/contacts/lists/2/contacts/add", options)
    //   .then((response) => response.json())
    //   .then((response) => console.log(response))
    //   .catch((err) => console.error(err));

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
    if (allBlogPosts && allBlogPosts.blogPosts) {
      if (sortValue === "all") setBlogPosts(allBlogPosts.blogPosts);
      else
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
  console.log("blogposts:", blogPosts);
  return (
    <>
      {Head(
        "Blog",
        "Balance ecosystem is an economy of conjoined banking and commerce initiatives. Balance blog shares blog articles on announcements, partnerships, events, USDB, FHM, and other products"
      )}
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
          <Grid container columnSpacing={2} rowSpacing={{ xs: 4, md: 0 }}>
            <Grid
              item
              className="email-div"
              md={12}
              order={{ lg: 1 }}
              sx={{
                width: { xs: "100%", md: "100%" },
                marginLeft: { xs: "0%", md: "0%" },
              }}
            >
              <Paper
                className="email-box"
                style={{
                  width: "100%",
                  borderRadius: "40px",
                  background: `url(${BlogBanner})`,
                  backgroundSize: "cover",
                }}
              >
                <Grid
                  container
                  style={{ width: "100%", display: "flex", justifyContent: "center" }}
                  columnSpacing={2}
                  rowSpacing={{ xs: 4, md: 0 }}
                >
                  <Grid
                    item
                    md={12}
                    order={{ lg: 1 }}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingTop: "30px",
                      textAlign: "center",
                    }}
                  >
                    <Box style={{ textAlign: "center" }}>
                      <Typography
                        variant="h1"
                        sx={{
                          fontSize: { xs: "24px", md: "36px" },
                          fontWeight: "500",
                          color: "#000000",
                        }}
                      >
                        The Balance Blog
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item md={12} order={{ lg: 1 }}>
              <h2 className={style["daiAPR"]}>Featured Posts</h2>
            </Grid>
            <Grid
              item
              md={12}
              order={{ lg: 1 }}
              sx={{ width: { xs: "100%", md: "100%" }, marginBottom: "64px" }}
              className={style["blogPostsDivF"]}
            >
              <Grid container columnSpacing={2} rowSpacing={{ xs: 4, md: 0 }}>
                {blogPosts &&
                  blogPosts
                    .filter((post: BlogPostDTO) => post.isFeatured)
                    .map((post: BlogPostDTO) => (
                      <Grid item xs={12} sm={12} md={4} order={{ lg: 1 }}>
                        <BlogFeaturedPost post={post} className={style["blogPost"]}>
                          <h2 className={style["daiAPR"]}>{post.blogTitle}</h2>
                        </BlogFeaturedPost>
                      </Grid>
                    ))}
              </Grid>
            </Grid>
            <Grid
              item
              md={3}
              order={{ lg: 1 }}
              style={{ width: "100%" }}
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <h2 className={style["daiAPR"]}>Filters</h2>
            </Grid>
            <Grid item md={9} order={{ lg: 1 }}>
              <h2 className={style["daiAPR"]}>Blog posts</h2>
            </Grid>
            <Grid
              item
              md={3}
              order={{ lg: 1 }}
              style={{ width: "100%" }}
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="all"
                  name="radio-buttons-group"
                  onChange={(e) => {
                    handleChange(e.target.value);
                    console.log(e.target.value); // will be called this time
                  }}
                >
                  <FormControlLabel value="all" control={<Radio />} label="All" />
                  <FormControlLabel
                    value="announcements"
                    control={<Radio />}
                    label="Announcements"
                  />
                  <FormControlLabel
                    value="products"
                    control={<Radio />}
                    label="Products"
                  />
                  <FormControlLabel
                    value="partnerships"
                    control={<Radio />}
                    label="Partnerships"
                  />
                  <FormControlLabel value="events" control={<Radio />} label="Events" />
                  <FormControlLabel value="usdb" control={<Radio />} label="USDB" />
                  <FormControlLabel value="fhm" control={<Radio />} label="FHM" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid
              item
              md={9}
              order={{ lg: 1 }}
              sx={{ width: { xs: "100%", md: "100%" }, paddingBottom: "32px" }}
              className={style["blogPostsDiv"]}
            >
              <Grid container columnSpacing={2} rowSpacing={{ xs: 4, md: 0 }}>
                {blogPosts &&
                  blogPosts.map((post: BlogPostDTO) => (
                    <Grid item xs={12} sm={12} md={4} order={{ lg: 1 }}>
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
                  backgroundImage: `url(${BalanceHeroImage})`,
                  backgroundSize: "100% auto",
                  backgroundPosition: "center right",
                  backgroundRepeat: "no-repeat",
                }}
                className={style["emailBox"]}
              >
                <Grid
                  container
                  style={{ width: "100%", height: "100%" }}
                  columnSpacing={2}
                  rowSpacing={{ sm: 0, md: 4 }}
                >
                  <Grid
                    item
                    sm={12}
                    lg={6}
                    order={{ lg: 1 }}
                    className={style["iconsElement"]}
                  >
                    <Typography style={{ fontSize: "20px", color: "#000000" }}>
                      Receive email updates
                    </Typography>
                    <Grid
                      container
                      style={{ width: "100%", height: "100%" }}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "start",
                        alignItems: "start",
                        paddingTop: "10px",
                      }}
                    >
                      <Grid
                        item
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
                    <Typography style={{ color: "#000000" }}>
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
    </>
  );
};

export default BlogPage;
