import { Button, Grid, OutlinedInput, Paper, Typography } from "@mui/material";
import { useState } from "react";
import style from "./balance-about-page.module.scss";
import {
  AboutBridge,
  AboutFHM,
  AboutUSDB,
  AboutBalanceEcosystem,
  AboutLiqd,
  BalanceHeroImage,
  AboutBalancePass,
  AboutUSDBVaults,
} from "@fantohm/shared/images";
import BalanceAboutTile from "./balance-about-tile";
import Head from "../../components/template/head";
import { useDispatch } from "react-redux";
import { error, info } from "@fantohm/shared-web3";

export const BalanceAboutPage = (): JSX.Element => {
  // mailchimp integration
  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src =
  //     "https://chimpstatic.com/mcjs-connected/js/users/30ce909d3542b1d245b54e5b8/8e00ffff339710be3d1981967.js%22";
  //   script.async = true;
  //   document.body.appendChild(script);
  // }, []);
  const [email, setEmail] = useState("");
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
      {Head(
        "About",
        "Balance ecosystem is an economy of conjoined banking and commerce initiatives. USDB stablecoin, FHM, DEX, Bridges, Liquidity Solutions, USDB Bank & Liqdnft are some key products."
      )}
      <BalanceAboutTile
        icon={AboutBalanceEcosystem}
        itemid="ecosystem"
        title="The Balance Ecosystem"
        text="The Balance Ecosystem is an open-source economy of conjoined banking and commerce initiatives formed in March of 2022 with the unveiling of investment opportunities derived solely from the technical application, maintenance, and consumer use of USDB.<br/><br/>The Balance Ecosystem depends on the administration of the Balance Organisation to produce and refine the collected systems of FHM & USDB’s use cases until such a time as they might be further decentralised. Through a continuing dialogue between the Balance Organisation and the FHM Stakeholders’ DAO via governance throughout the development and implementation of these systems, the Balance Ecosystem aims to produce the first, ever, decentralised reserve currency."
      />
      <BalanceAboutTile
        icon={AboutFHM}
        itemid="fhm"
        title="FHM Protocol"
        text="FHM is a Reserve & Rewards Protocol inspired by the Protocol Owned Liquidity software developments of OHM. FHM plays a core part in the Balance ecosystem and acts as the liquidity provider thanks to the POL model. FHM features compounding, single disbursement bonds as the safest possible bonding mechanism to ensure the longevity of exchange liquidity in relation to neighbouring protocols with similar principles."
        link="https://fantohm.com/"
        // docsLink="https://fantohm.gitbook.io/documentation/"
        // learnMore="/fhm"
      />
      <BalanceAboutTile
        icon={AboutLiqd}
        itemid="marketplace"
        title="Liqd"
        text="Liqd is an NFT marketplace built to enable the collateralisation of NFTs. The platform enables individuals who hold NFT assets to unlock liquidity by borrowing against the value of their asset(s).<br/><br/>
        In turn, Liqd unlocks a peer-to-peer lending opportunity for crypto holding individuals to lend capital for a set interest rate, backed by the value of the underlying NFT asset."
      />
      <BalanceAboutTile
        icon={AboutUSDB}
        itemid="usdb"
        title="USDB Stablecoin"
        text="USDB is a stablecoin built for economic adoption. It combines the benefits of algorithmic supply backing, protocol owned liquidity, traditional banking, and decentralised finance.<br/><br/>USDB is uniquely aligned for the cross chain expansion of the protocol. Its use allows the Balance Organisation to store and transfer value on, off and between chains most effectively and efficiently. The ability to capture, store and transfer liquidity across several chains will be advantageous when building out new products under the Balance organisation."
        link="https://www.usdbalance.com/"
        docsLink="https://fantohm.gitbook.io/documentation/usdb/introduction"
      />
      <BalanceAboutTile
        icon={AboutBridge}
        itemid="bridge"
        title="DEX & Bridge"
        text="Bridge & swap thousands of assets across multiple chains with the lowest fees. Through a partnership with Rango Exchange, transactions are intuitively routed through several aggregators to ensure you always get the cheapest fees."
        link="https://app.fantohm.com/#/dex"
      />
      <BalanceAboutTile
        icon={AboutBalancePass}
        itemid="balance-pass"
        title="Balance Pass"
        text="The Balance Pass is a limited collection of 350 NFTs created to unlock perks and exclusive access throughout the Balance Ecosystem. Additionally, Balance pass holders have the ability to gain access to whitelist opportunities for upcoming mints as well as alpha thanks to our strategic partnerships with Leading Alpha groups."
        link="https://opensea.io/collection/balance-pass"
      />
      <BalanceAboutTile
        icon={AboutUSDBVaults}
        itemid="usdb-vaults"
        title="USDB Vaults"
        text="The Liquidity Vaults are a means in which Balance can help provide finance to other DeFi protocols in the space. In order to receive financing, each protocol needs to establish a Liquidity Vault with supporting documentation, including the amount of financing sought and the return on investment. After viewing prospective vaults, users can deposit tokens into those vaults that interest them.<br/><br/>In exchange for depositing their investment tokens into a vault, users receive a receipt token that represents their share of the vault. The receipt token is a tradeable and transferable NFT giving users access to the high staking rewards from locking in their capital, yet flexibility to liquidate their position at any time."
        link="https://www.usdbalance.com/"
      />
      <Grid
        item
        className="email-div"
        md={12}
        order={{ lg: 1 }}
        style={{ marginBottom: "200px", marginTop: "50px" }}
        sx={{
          width: { xs: "90%", md: "90%" },
          marginLeft: { xs: "5%", md: "5%" },
          marginRight: { xs: "5%", md: "5%" },
          marginBottom: "20px",
        }}
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
            <Grid item sm={12} lg={6} order={{ lg: 1 }} className={style["iconsElement"]}>
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
    </>
  );
};

export default BalanceAboutPage;
