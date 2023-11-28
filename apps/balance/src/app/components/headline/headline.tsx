import { Box, SxProps, Theme, Typography } from "@mui/material";
import style from "./headline.module.scss";

/* eslint-disable-next-line */
export interface HeadlineProps {
  id?: string;
  hero?: boolean;
  title: string;
  subtitle: string | string[] | JSX.Element;
  sx?: SxProps<Theme>;
}

export const Headline = (props: HeadlineProps): JSX.Element => {
  const subtitle: string[] | JSX.Element =
    typeof props.subtitle === "string" ? [props.subtitle] : props.subtitle;

  const isElement = (element: JSX.Element | string[]): element is JSX.Element => {
    return (element as JSX.Element).type !== undefined;
  };

  return (
    <Box
      className={`${style[props.hero ? "hero" : "standard"]} flexCenterCol`}
      sx={{ ...props.sx }}
      id={props.id}
    >
      <Typography variant="h1">{props.title}</Typography>
      {subtitle && !isElement(subtitle)
        ? subtitle.map((value: string, index: number) => (
            <Typography
              key={index}
              variant="h2"
              maxWidth="md"
              sx={{ textAlign: "center" }}
            >
              {value}
            </Typography>
          ))
        : subtitle}
    </Box>
  );
};

export default Headline;
