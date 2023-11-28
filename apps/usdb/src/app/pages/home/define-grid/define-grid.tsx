import { Box, Button, Grid, OutlinedInput } from "@mui/material";
import style from "./define-grid.module.scss";
import { BalanceDefine1, BalanceDefine2 } from "@fantohm/shared/images";
import { error, info } from "@fantohm/shared-web3";
import { useState } from "react";
import { useDispatch } from "react-redux";

export const DefineGrid = (): JSX.Element => {
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

    await fetch("https://api.sendinblue.com/v3/contacts", options)
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch(async (err) => await updateContact());
  }

  const onSubmitEmail = async () => {
    if (
      email === "" ||
      name === "" ||
      organizationName === "" ||
      sector === "" ||
      product === "" ||
      websiteUrl === ""
    ) {
      // eslint-disable-next-line no-alert
      return dispatch(error("Please enter a valid value for each field!"));
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

    await fetch("https://api.sendinblue.com/v3/contacts/lists/3/contacts/add", options)
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
    setEmail("");
    setSector("");
    setOrganizationName("");
    setName("");
    setProduct("");
    setWebsiteUrl("");
    dispatch(info("Success!"));
    return;
  };

  return (
    <Grid
      container
      rowSpacing={1}
      className={style["productGrid"]}
      style={{ marginTop: "50px" }}
    >
      <Grid
        item
        xs={12}
        md={5}
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
          }}
          className={style["hero"]}
        >
          <Grid item xs={8}>
            <h1 className={style["text"]}>01 &#8212;</h1>
          </Grid>
          <Grid item xs={12}>
            <h1 className={style["title"]}>Defining the Balance Ecosystem</h1>
          </Grid>
          <Grid item xs={12}>
            <h1 className={style["text"]}>
              The Balance Ecosystem depends on USDB as the formal vehicle of engagement
              with businesses which feed value directly into FHM buybacks through the
              profits of successful venture capital.
            </h1>
          </Grid>
        </Box>
      </Grid>
      <Grid
        item
        xs={4}
        md={7}
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "start",
          paddingTop: "30px",
        }}
      >
        <img
          src={BalanceDefine2}
          style={{ width: "100%" }}
          alt="Balance USDB definition."
        />
      </Grid>

      <Grid
        item
        md={7}
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "start",
          paddingTop: "30px",
        }}
      >
        <img
          src={BalanceDefine1}
          style={{ width: "100%" }}
          alt="Balance USDB definition. Part 2"
        />
      </Grid>
      <Grid
        item
        xs={12}
        md={5}
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
          }}
          className={style["hero"]}
        >
          <Grid item xs={8}>
            <h1 className={style["text"]}>02 &#8212;</h1>
          </Grid>
          <Grid item xs={12}>
            <h1 className={style["title"]}>Owned By Long Term Interests</h1>
          </Grid>
          <Grid item xs={12}>
            <h1 className={style["text"]}>
              Through the systems in place, new financial interests are welcome to take
              part in both the continued success of the Balance Ecosystem as well as they
              are invited to join in the continued governance and maintenance of FHM’s
              treasury when assistance is necessary.
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
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
          className={style["hero"]}
        >
          <Grid item xs={8}>
            <h1 className={style["text"]}>03 &#8212;</h1>
          </Grid>
          <Grid item xs={12}>
            <h1 className={style["title"]}>Join our partner program</h1>
          </Grid>
          <Grid item xs={12}>
            <h1 className={style["text"]}>
              Are you part of a financial institutions or a DeFi protocol? Get in touch to
              discuss how Balance and your organisation can work together.
            </h1>
          </Grid>
        </Box>
      </Grid>

      <Grid
        item
        md={3}
        sm={12}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "start",
          paddingTop: "30px",
        }}
        id="partner-form"
      >
        <OutlinedInput
          className={`${style["styledInput"]}`}
          placeholder="What’s your name? *"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <OutlinedInput
          className={`${style["styledInput"]}`}
          placeholder="What’s the name of your organization?"
          value={organizationName}
          onChange={(e) => {
            setOrganizationName(e.target.value);
          }}
        />
        <OutlinedInput
          className={`${style["styledInput"]}`}
          placeholder="What’s your website url?"
          value={websiteUrl}
          onChange={(e) => {
            setWebsiteUrl(e.target.value);
          }}
        />
      </Grid>
      <Grid
        item
        md={3}
        sm={12}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "start",
          paddingTop: "30px",
        }}
      >
        <OutlinedInput
          className={`${style["styledInput"]}`}
          placeholder="What’s your email address? *"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <OutlinedInput
          className={`${style["styledInput"]}`}
          placeholder="What sector do you operate within?"
          value={sector}
          onChange={(e) => {
            setSector(e.target.value);
          }}
        />
        <OutlinedInput
          className={`${style["styledInput"]}`}
          placeholder="What product are you interested in?"
          value={product}
          onChange={(e) => {
            setProduct(e.target.value);
          }}
        />
      </Grid>
      <Grid
        item
        md={6}
        sm={12}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "start",
          paddingTop: "30px",
        }}
      />
      <Grid
        item
        md={6}
        sm={12}
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
          sx={{ px: "6em", display: { md: "flex" } }}
          className={style["link"]}
          onClick={onSubmitEmail}
        >
          Submit
        </Button>
      </Grid>
    </Grid>
  );
};

export default DefineGrid;
