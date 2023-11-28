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
    await createContact();
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key":
          "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",
      },
      body: JSON.stringify({ emails: [email] }),
    };

    await fetch("https://api.sendinblue.com/v3/contacts/lists/2/contacts/add", options)
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
    setEmail("");
    dispatch(info("Success!"));
    return;
  };

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
                    <Typography className={style["heroTitle"]}>
                      Infrastructure for decentralized finance
                    </Typography>
                    <Typography style={{ marginTop: "20px", color: "#000000" }}>
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
              className={style["email-box"]}
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
                    columnSpacing={2}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "start",
                      alignItems: "start",
                      paddingTop: "30px",
                    }}
                    rowSpacing={{ xs: 4, md: 0 }}
                  >
                    <Grid
                      item
                      sm={12}
                      md={6}
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
                      md={3}
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
            {/*<Box className={style["heroRight"]}>*/}
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
            {/*</Box>*/}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default BalanceHomePage;
