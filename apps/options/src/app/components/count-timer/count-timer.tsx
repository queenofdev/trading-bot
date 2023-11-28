import DisplayTime from "./display-time";
import { useCountdown } from "../../hooks/useCountdown";
import { SvgIcon } from "@mui/material";
import { WatchLaterOutlined } from "@mui/icons-material";

const CountTimer = (props: { countdown: number }) => {
  const dangerCounter = 3 * 60 * 1000;
  const { hours, minutes, seconds, counter } = useCountdown(props.countdown);
  return (
    <div className="show-counter w-160 bg-white rounded-3xl px-10 py-5 flex items-center text-second">
      <SvgIcon component={WatchLaterOutlined} className="text-30 mr-10" />
      <div className="flex flex-col justify-start items-between text-12">
        <p className="text-[#5b7481]">Next game starts:</p>
        <div className="flex items-center text-[#dbedff] text-16">
          <DisplayTime value={hours} isDanger={counter < dangerCounter} />
          <p>:</p>
          <DisplayTime value={minutes} isDanger={counter < dangerCounter} />
          <p>:</p>
          <DisplayTime value={seconds} isDanger={counter < dangerCounter} />
        </div>
      </div>
    </div>
  );
};

export default CountTimer;
