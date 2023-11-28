import { Box, SxProps, Theme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import style from "./circle-graph.module.scss";

/* eslint-disable-next-line */
export interface CircleGraphProps {
  progress: number;
  sx?: SxProps<Theme>;
}

export const CircleGraph = (props: CircleGraphProps): JSX.Element => {
  const pCircle = useRef<SVGCircleElement>(null);
  const [circumference, setCircumference] = useState(0);
  const [radius, setRadius] = useState(0);

  useEffect(() => {
    if (!pCircle.current) return;
    if (pCircle.current.r.baseVal.value !== radius) {
      setRadius(pCircle.current.r.baseVal.value);
      setCircumference(pCircle.current.r.baseVal.value * 2 * Math.PI);
    }
  }, [pCircle.current]);

  useEffect(() => {
    if (!pCircle.current) return;
    pCircle.current.style.strokeDasharray = `${circumference} ${circumference}`;
    pCircle.current.style.strokeDashoffset = `${circumference}`;

    const offset = circumference - (props.progress / 100) * circumference;
    pCircle.current.style.strokeDashoffset = offset.toString();
  }, [props.progress, pCircle.current]);

  return (
    <Box sx={props.sx}>
      <svg
        className="progress-ring"
        width="120"
        height="120"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle className={style["baseCircle"]} r="52" cx="60" cy="60" />
        <circle
          ref={pCircle}
          className={style["progressCircle"]}
          r="52"
          cx="60"
          cy="60"
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize="2em"
        >
          {Math.round(props.progress)}%
        </text>
      </svg>
    </Box>
  );
};

export default CircleGraph;
