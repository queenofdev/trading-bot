import { Box } from "@mui/material";

export type ColorLabelProps = {
  color: string;
  label: string;
};

export const ColorLabel = ({ color, label }: ColorLabelProps): JSX.Element => {
  return (
    <Box className="flex fr ai-c">
      <Box
        sx={{
          height: "10px",
          width: "10px",
          borderCollapse: "collapse",
          borderRadius: "50%",
          backgroundColor: color,
          marginRight: "5px",
        }}
      ></Box>
      <span style={{ color: "#8891A2" }}>{label}</span>
    </Box>
  );
};

export default ColorLabel;
