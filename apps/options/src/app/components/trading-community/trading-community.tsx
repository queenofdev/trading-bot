import { Link } from "react-router-dom";
import ArrowIcon from "../arrow-icon/arrow-icon";

const TradingCommunity = () => {
  return (
    <div className="trading-experience bg-woodsmoke sm:pl-40 rounded-2xl relative flex xs:flex-col xs:items-center sm:items-start xs:justify-between lg:flex-row lg:items-between lg:justify-start">
      <div className="flex flex-col justify-between pb-20">
        <p className="experience-title text-40 text-primary xs:w-full sm:w-385 pt-40 leading-8">
          Trading community
        </p>
        <p className="xs:text-19 lg:text-15 text-second mt-25 mb-40 xs:w-300 lg:w-230">
          Trade and chat with traders from all around the globe.
        </p>
        <Link to="/trade">
          <ArrowIcon
            text="ENTER APP"
            revert={true}
            status={"up"}
            className="font-OcrExtendedRegular"
          />
        </Link>
      </div>
      <div className="sm:absolute token-logo items-center xs:w-300 sm:350 lg:w-250 bottom-0 sm:right-0">
        <img src={`./assets/images/trading-community.png`} alt={`experience logo`} />
      </div>
    </div>
  );
};

export default TradingCommunity;
