import { Link } from "react-router-dom";
import ArrowIcon from "../arrow-icon/arrow-icon";

const TradingExperience = () => {
  return (
    <div className="trading-experience bg-woodsmoke px-60 flex xs:flex-col sm:flex-row  sm:justify-between xs:items-center xs:mt-35 md:mt-60 lg:mt-90 rounded-2xl relative cursor-default">
      <div className="flex flex-col justify-between py-40">
        <p className="experience-title text-40 text-primary w-300 leading-8">
          24 hour trading experience
        </p>
        <p className="xs:text-19 lg:text-15 text-second xs:mt-30 sm:mt-20 mb-40 w-230">
          Trade anywhere, anytime
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
      <div className="sm:absolute token-logo items-center w-250 bottom-0 sm:right-25 sm:flex sm:justify-center">
        <img src={`./assets/images/trading-experience.png`} alt={`experience logo`} />
      </div>
    </div>
  );
};

export default TradingExperience;
