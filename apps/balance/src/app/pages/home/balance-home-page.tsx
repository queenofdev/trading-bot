import {
  Box,
  Button,
  Container,
  Grid,
  Icon,
  OutlinedInput,
  Paper,
  Typography,
} from "@mui/material";
import style from "./balance-home-page.module.scss";
import {
  BalanceDefine2,
  BalanceHeroImage,
  BalanceEmailBanner,
} from "@fantohm/shared/images";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import InvestmentOptions from "./investment-options/investment-options";
import { DefineGrid } from "./define-grid/define-grid";
import PartnersGrid from "./partners-grid/partners-grid";
import AuditGrid from "./partners-grid/audit-grid";
import { error, info } from "@fantohm/shared-web3";
import { useState } from "react";
import BalanceIconGrid from "./balance-icon-grid/balance-icon-grid";
import Head from "../../components/template/head";
import { Helmet } from "react-helmet";

export const BalanceHomePage = (): JSX.Element => {
  const [email, setEmail] = useState("");

  const themeType = useSelector((state: RootState) => state.app.theme);
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

  return (
    <>
      <Helmet>
        <title>Balance Capital - Infrastructure for decentralized finance</title>
        <meta
          name="description"
          content="Balance.capital provides an infrastructure for decentralized finance and decentralized business experience to help build a sustainable & inclusive crypto investment economy"
        />
      </Helmet>
      <Container
        maxWidth="xl"
        className={style["heroContainer"]}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: { xs: "52px", md: "112px" },
          }}
          className={style["hero"]}
        >
          <Grid container columnSpacing={2} rowSpacing={{ xs: 4, md: 0 }}>
            <Grid
              item
              md={12}
              order={{ lg: 1 }}
              className={style["iconsElement"]}
              style={{ height: "40em" }}
            >
              <Paper
                style={{
                  backgroundImage: `url(${BalanceHeroImage})`,
                  width: "100%",
                  height: "100%",
                  borderTopLeftRadius: "80px",
                  borderTopRightRadius: "80px",
                  borderBottomLeftRadius: "0px",
                  borderBottomRightRadius: "0px",
                  backgroundPosition: "center center",
                }}
                className={style["heroElem"]}
              >
                <Grid
                  container
                  style={{ width: "100%", height: "100%" }}
                  columnSpacing={2}
                  rowSpacing={{ xs: 4, md: 0 }}
                >
                  <Grid
                    item
                    sm={12}
                    md={9}
                    lg={6}
                    order={{ lg: 1 }}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "start",
                      alignItems: "center",
                      paddingTop: "30px",
                    }}
                    className={style["heroRight"]}
                  >
                    <Box
                      sx={{
                        marginLeft: { sm: "1em", md: "3em", lg: "5em" },
                      }}
                    >
                      <h1 className={style["heroTitle"]}>Infrastructure for</h1>
                      <h1 className={style["heroTitle1"]}>decentralized finance</h1>
                      <Typography style={{ marginTop: "20px", color: "#5f5f5f" }}>
                        We are leveraging our decentralized business experience to help
                        build a more sustainable, inclusive crypto investment economy. See
                        how we're delivering on our commitments alongside our stakeholders
                        and partners
                      </Typography>

                      <Button
                        variant="contained"
                        color="primary"
                        href="/#get-started"
                        sx={{
                          px: "3",
                          display: { xs: "none", md: "flex", width: "30%" },
                        }}
                        className={style["link"]}
                        style={{ marginTop: "20px" }}
                      >
                        Get started
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid
              item
              md={12}
              order={{ lg: 1 }}
              className={style["iconsElement"]}
              style={{ paddingTop: "150px" }}
              id="get-started"
            >
              <BalanceIconGrid />
            </Grid>
            <Grid
              item
              md={12}
              order={{ lg: 1 }}
              className={style["iconsElement"]}
              id="about"
            >
              <InvestmentOptions />
            </Grid>
            <Grid
              item
              md={12}
              order={{ lg: 1 }}
              style={{ width: "100%" }}
              className={style["iconsElement"]}
            >
              <DefineGrid />
            </Grid>
            <Grid item md={12} order={{ lg: 1 }} className={style["iconsElement"]}>
              <PartnersGrid />
            </Grid>
            <Grid
              item
              md={12}
              order={{ lg: 1 }}
              className={style["iconsElement"]}
              id="audit"
            >
              <AuditGrid />
            </Grid>
            <Grid
              item
              className="email-div"
              md={12}
              order={{ lg: 1 }}
              style={{ width: "100%" }}
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
            <Grid item lg={12} className={style["heroTextContent"]}>
              {/* <Box className={style["heroRight"]}>*/}
              {/*  <Box*/}
              {/*    sx={{*/}
              {/*      height: { xs: "132px", md: "180px" },*/}
              {/*      display: { xs: "none", md: "flex" },*/}
              {/*    }}*/}
              {/*  >*/}
              {/*    <img*/}
              {/*      src={themeType === "light" ? USDBLogoLight : USDBLogoDark}*/}
              {/*      alt="USDB Logo"*/}
              {/*      className={style["heroLogo"]}*/}
              {/*    />*/}
              {/*  </Box>*/}
              {/*  <h1 className={style["heroTitle"]}>Where traditional finance meets DeFi</h1>*/}
              {/*  <h3 className={style["heroSubtitle"]}>*/}
              {/*    USDB provides a wide range of financial tools and services to individuals*/}
              {/*    and institutions*/}
              {/*  </h3>*/}
              {/*  <a href="/trad-fi" className={style["heroLink"]} rel="noreferrer">*/}
              {/*    Learn more*/}
              {/*    <Icon component={ArrowUpwardIcon} className={style["linkArrow"]} />*/}
              {/*  </a>*/}
              {/*</Box> */}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default BalanceHomePage;
