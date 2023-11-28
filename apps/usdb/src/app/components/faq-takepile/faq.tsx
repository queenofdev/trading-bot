import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import style from "./faq.module.scss";
import { ExpandMore } from "@mui/icons-material";
import { RootState } from "../../store";

const faqItemsWithText = [
  {
    title: "Which investment tokens can be deposited in the vaults?",
    text: "The vault creator determines the tokens to be invested ",
  },
  {
    title: "How is Balance able to provide large capital to different protocols?",
    text: "Balance acts solely as an investment facilitator. As such, the better the investment case (timeframe, APRs and other relevant factors) the greater than amount of capital that the vault will be able to attract. This is in addition to the marketing efforts of the protocol.",
  },
  {
    title: "What are the pre-conditions to open a new Vault to raise capital?",
    text: "The required documentation and terms and conditions will need to be submitted.",
  },
  {
    title: "How does Balance protect vault investors from fraudulent vaults?",
    text: "While no investment is 100% certain, a dedicated Discord channel will be opened for each vault in which potential investors are able to ask the vault creators any questions that they may have.",
  },
  {
    title: "How are repayment periods calculated?",
    text: "The repayment periods are determined by the vault creator and written into the smart contract. Funds will flow to and from the smart contract and are completely independent of Balance.",
  },
];

const faqItemsWithLink = [
  { title: "What is Takepile?", link: "https://www.youtube.com/embed/83UDk-bITYw" },
  {
    title: "Where does the APR come from?",
    link: "https://www.youtube.com/embed/ZSEL6IirDR4",
  },
  {
    title: "How does takepile guarantee solvency?",
    link: "https://www.youtube.com/embed/bKa4XknGmWg",
  },
  {
    title: "What makes Takepile different?",
    link: "https://www.youtube.com/embed/24f93z2R354",
  },
  {
    title: "How does Takepile scale?",
    link: "https://www.youtube.com/embed/PFYHG0y1Dqw",
  },
  {
    title: "How does Takepile get prices for different pairs?",
    link: "https://www.youtube.com/embed/zuXtn_KQgKs",
  },
];

export const Faq = (): JSX.Element => {
  const themeType: string = useSelector((state: RootState) => state.app.theme);

  return (
    <Box className="flexCenterCol">
      <Typography className={style["faqHeader"]}>Frequently Asked Questions</Typography>
      <Box
        className="flex fr"
        sx={{
          width: "100%",
          justifyContent: "space-around",
        }}
      >
        <Box
          sx={{
            width: "50%",
            padding: "0px 20px 0px 60px",
          }}
        >
          {faqItemsWithText.map(({ title, text }, key: number) => (
            <Accordion
              key={`faq-acc-${key}`}
              className={style["faqItem"]}
              style={{
                background: themeType === "dark" ? "#20203088" : "white",
                borderRadius: "30px",
                padding: "15px",
                paddingLeft: "40px",
                paddingRight: "20px",
                marginBottom: "25px",
              }}
            >
              <AccordionSummary
                className={style["faqTitle"]}
                expandIcon={<ExpandMore color="primary" />}
              >
                {title}
              </AccordionSummary>
              <AccordionDetails className={style["faqContent"]}>{text}</AccordionDetails>
            </Accordion>
          ))}
        </Box>
        <Box
          sx={{
            width: "50%",
            padding: "0px 60px 0px 20px",
          }}
        >
          {faqItemsWithLink.map(({ title, link }, key: number) => (
            <Accordion
              key={`faq-acc-${key}`}
              className={style["faqItem"]}
              style={{
                background: themeType === "dark" ? "#20203088" : "white",
                borderRadius: "30px",
                padding: "15px",
                paddingLeft: "40px",
                paddingRight: "20px",
                marginBottom: "25px",
              }}
            >
              <AccordionSummary
                className={style["faqTitle"]}
                expandIcon={<ExpandMore color="primary" />}
              >
                {title}
              </AccordionSummary>
              <AccordionDetails className={style["faqContent"]}>
                <iframe
                  src={link}
                  width="100%"
                  height="305"
                  frameBorder="0"
                  allowFullScreen
                  title={title}
                ></iframe>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Faq;
