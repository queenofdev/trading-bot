import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import tradFiGraphLight from "../../../../assets/images/trad-fi-graph.svg";
import tradFiGraphDark from "../../../../assets/images/trad-fi-graph-dark.svg";
import { Box, Paper, SxProps, Theme } from "@mui/material";
import style from "./graph.module.scss";

/* eslint-disable-next-line */
export interface GraphProps {
  style?: SxProps<Theme>;
}

export const Graph = (props: GraphProps): JSX.Element => {
  const themeType = useSelector((state: RootState) => state.app.theme);

  return (
    <Box maxWidth="md" sx={{ ...props.style, my: "2em" }}>
      <Paper
        className={`${style["graphContainer"]} ${style["lightBG"]}`}
        sx={{ padding: { xs: "2em 1em", md: "4em 3em" } }}
        elevation={0}
      >
        <Box sx={{ width: "100%" }}>
          <img
            src={themeType === "light" ? tradFiGraphLight : tradFiGraphDark}
            className={style["graphImg"]}
            alt="Graph showing APR for various investments"
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default Graph;
