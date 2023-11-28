import { Box, Button, Grid, OutlinedInput, Paper, Typography } from "@mui/material";
import style from "./fhm-page.module.scss";
import {
  FHMBanner,
  FHMCoin,
  FHMLaptop,
  FHMLaptop2,
  OneIcon,
  ThreeIcon,
  TwoIcon,
  Rayne,
  Pwntr0n,
  AtomicSwap,
  Kanan,
  Sleepy_Neko,
  Lilbobross,
  BalanceHeroImage,
} from "@fantohm/shared/images";
import { error, info } from "@fantohm/shared-web3";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Head from "../../components/template/head";

export const FhmPage = (): JSX.Element => {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [sector, setSector] = useState("");
  const [product, setProduct] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  async function updateContact() {
    const options = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key":
          "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",
      },
      body: JSON.stringify({
        email: email,
        attributes: {
          name: name,
          email: email,
          organizationName: organizationName,
          sector: sector,
          websiteUrl: websiteUrl,
          product: product,
        },
      }),
    };

    await fetch("https://api.sendinblue.com/v3/contacts", options)
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
  }

  async function createContact() {
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key":
          "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",
      },
      body: JSON.stringify({
        email: email,
        attributes: {
          name: name,
          email: email,
          organizationName: organizationName,
          sector: sector,
          websiteUrl: websiteUrl,
          product: product,
        },
        updateEnabled: true,
      }),
    };

    const response = await fetch("https://api.sendinblue.com/v3/contacts", options)
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch(async (err) => await updateContact());
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

  const openApp = () => {
    window.open("https://app.fantohm.com/#/dashboard", "_blank");
  };

  const openDocs = () => {
    window.open("https://fantohm.gitbook.io/documentation/", "_blank");
  };

  return (
    <>
      {Head(
        "FHM",
        "FHM Protocol Token functions as a modifiable reserve asset. Committed to stakeholders and long-term interests with two layers of multi-sig protection."
      )}
      <Grid
        container
        rowSpacing={6}
        className={style["productGrid"]}
        style={{ marginTop: "50px" }}
      >
        <Grid
          item
          xs={10}
          md={12}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "30px",
          }}
          className={style["fhmBanner"]}
        >
          <img src={FHMBanner} alt="FHM Banner logo" style={{ width: "100%" }} />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "30px",
          }}
        >
          <Grid item xs={12}>
            <h1 className={style["fhmtitle"]}>The FHM Protocol</h1>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "30px",
            }}
          >
            <h1 className={style["fhmtext"]}>
              The FHM Protocol Token functions as a modifiable reserve asset which backs
              this bridging economy, with its Stakeholders’ DAO governors as the chief
              line of common sense defence against taking actions that would harm the long
              term growth of its treasury.
            </h1>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "30px",
            }}
          >
            <Grid
              item
              xs={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "30px",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={openApp}
                sx={{ px: "4em", display: { md: "flex" } }}
                className={style["link"]}
              >
                Enter App
              </Button>
            </Grid>
            <Grid
              item
              xs={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "30px",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={openDocs}
                sx={{ px: "4em", display: { md: "flex" }, marginLeft: "20px" }}
                className={style["link"]}
              >
                Documentation
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "start",
            paddingTop: "30px",
            marginLeft: { xs: "0", md: "10%" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "start",
              paddingTop: { xs: "32px", md: "62px" },
            }}
            className={style["hero"]}
          >
            <Grid item xs={12}>
              <h1 className={style["text"]}>01 &#8212;</h1>
            </Grid>
            <Grid item xs={12}>
              <h1 className={style["title"]}>
                A self-owned, decentrally governed reserve asset
              </h1>
            </Grid>
            <Grid item xs={12}>
              <h1 className={style["text"]}>
                The FHM Protocol is a self-owned, decentrally governed reserve asset which
                functions to execute the best possible management of its treasury in order
                to produce future gains for the benefit of its stakeholders.
              </h1>
            </Grid>
          </Box>
        </Grid>
        <Grid
          item
          xs={4}
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "start",
            paddingTop: "30px",
          }}
        >
          <img src={FHMCoin} alt="FHM Coin logo" style={{ width: "100%" }} />
        </Grid>

        <Grid
          item
          xs={4}
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "start",
            paddingTop: "30px",
            marginLeft: "10%",
          }}
        >
          <img src={FHMLaptop} alt="FHM Laptop logo" style={{ width: "100%" }} />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "start",
            paddingTop: "30px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "start",
              paddingTop: { xs: "32px", md: "62px" },
            }}
            className={style["hero"]}
          >
            <Grid item xs={8}>
              <h1 className={style["text"]}>02 &#8212;</h1>
            </Grid>
            <Grid item xs={12}>
              <h1 className={style["title"]}>
                Committed to stakeholders and long-term interests
              </h1>
            </Grid>
            <Grid item xs={12}>
              <h1 className={style["text"]}>
                While the FHM protocol is an OHM fork, it should be noted that all aspects
                of the protocol relevant to bonding, staking, inflation, or deflation may
                be edited to suit the changing conditions of the market with consent from
                the FHM Stakeholders’ DAO
              </h1>
            </Grid>
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "start",
            paddingTop: "30px",
            marginLeft: { xs: "0", md: "10%" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "start",
              paddingTop: { xs: "32px", md: "62px" },
            }}
            className={style["hero"]}
          >
            <Grid item xs={8}>
              <h1 className={style["text"]}>01 &#8212;</h1>
            </Grid>
            <Grid item xs={12}>
              <h1 className={style["title"]}>Re-imaging fractional reserve finance</h1>
            </Grid>
            <Grid item xs={12}>
              <h1 className={style["text"]}>
                The key innovation in its success, USDB, allows the reorganisation of
                treasury held liquidity in order to assure the value of FHM through
                fractional reserve finance.
              </h1>
            </Grid>
          </Box>
        </Grid>
        <Grid
          item
          xs={4}
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "start",
            paddingTop: "30px",
          }}
        >
          <img src={FHMLaptop2} alt="FHM Laptop2 logo" style={{ width: "100%" }} />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "30px",
          }}
        >
          <Grid item xs={12}>
            <h1 className={style["fhmtitle"]}>Two layers of Multisig Protection</h1>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "30px",
            }}
          >
            <h1 className={style["fhmtext"]}>
              There are two layers to the multisig protection, Fantom Safe and
              OpenZeppelin Defender. The former is the Gnosis implementation on Fantom,
              and the latter is a secure platform to expand the capabilities of multisig
              operation.
            </h1>
          </Grid>
        </Grid>

        <Grid item xs={12} className={style["sigElems"]}>
          <Grid item md={4} sm={6} className={style["sig"]}>
            <img src={Pwntr0n} alt="Name symbol" style={{ width: "100px" }} />
          </Grid>
          <Grid item md={4} sm={6} className={style["sig"]}>
            <img src={Kanan} alt="Name symbol" style={{ width: "120px" }} />
          </Grid>
          <Grid item md={4} sm={6} className={style["sig"]}>
            <img src={Rayne} alt="Name symbol" style={{ width: "120px" }} />
          </Grid>
          <Grid item md={4} sm={6} className={style["sig"]}>
            <img src={AtomicSwap} alt="Name symbol" style={{ width: "140px" }} />
          </Grid>
          <Grid item md={4} sm={6} className={style["sig"]}>
            <img src={Lilbobross} alt="Name symbol" style={{ width: "150px" }} />
          </Grid>
          <Grid item md={4} sm={6} className={style["sig"]}>
            <img src={Sleepy_Neko} alt="Name symbol" style={{ width: "130px" }} />
          </Grid>
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
      </Grid>
    </>
  );
};

export default FhmPage;
