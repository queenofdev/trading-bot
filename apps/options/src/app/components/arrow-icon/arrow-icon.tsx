import { SvgIcon } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/CallMade";
import ArrowDownwardIcon from "@mui/icons-material/CallReceived";

interface ArrowIconProps {
  text: string;
  revert?: boolean;
  status?: "up" | "down" | undefined;
  className?: string;
}

const ArrowIcon = (props: ArrowIconProps) => {
  const { text, revert, status } = props;
  return (
    <div
      className={`${props?.className} flex items-center ${
        status ? (status === "up" ? "text-success" : "text-danger") : "text-primary"
      }`}
    >
      {revert ? (
        <>
          <p>{text}</p>
          <SvgIcon
            className="text-18 m-5"
            component={
              status
                ? status === "up"
                  ? ArrowOutwardIcon
                  : ArrowDownwardIcon
                : ArrowOutwardIcon
            }
          />
        </>
      ) : (
        <>
          <SvgIcon
            className="text-18 m-5"
            component={
              status
                ? status === "up"
                  ? ArrowOutwardIcon
                  : ArrowDownwardIcon
                : ArrowOutwardIcon
            }
          />
          <p>{text}</p>
        </>
      )}
    </div>
  );
};

export default ArrowIcon;
