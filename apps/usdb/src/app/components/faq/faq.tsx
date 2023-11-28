import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import style from "./faq.module.scss";
import dots from "../../../assets/images/dots.svg";
import { ExpandMore } from "@mui/icons-material";

/* eslint-disable-next-line */
export interface FaqProps {
  faqItems: FaqItem[];
  sx?: SxProps<Theme>;
}

export type FaqItem = {
  title: string;
  content: string | JSX.Element;
};

export const Faq = (props: FaqProps): JSX.Element => {
  return (
    <Box
      className={`${style["faqSection"]} flexCenterCol`}
      sx={{ marginTop: "5em", ...props.sx }}
    >
      <Grid container columnSpacing={5}>
        <Grid item xs={12} md={6}>
          <Box className="flexCenterCol">
            <span className={style["faqHeader"]}>Frequently asked questions</span>
            <Box className={style["dots"]}>
              <img src={dots} alt="grid of dots" style={{ marginBottom: "2em" }} />
              <img src={dots} alt="grid of dots" />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          {props.faqItems.map((faqItem: FaqItem, key: number) => (
            <Accordion key={`faq-acc-${key}`} square={false}>
              <AccordionSummary
                className={style["faqTitle"]}
                expandIcon={<ExpandMore color="primary" />}
              >
                {faqItem.title}
              </AccordionSummary>
              <AccordionDetails className={style["faqContent"]}>
                {typeof faqItem.content == "string" ? (
                  <Typography style={{ whiteSpace: "pre-line" }}>
                    {faqItem.content}
                  </Typography>
                ) : (
                  faqItem.content
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Faq;
