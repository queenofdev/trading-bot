import { Link } from "react-router-dom";
import ArrowIcon from "../arrow-icon/arrow-icon";

const DemoAccount = () => {
  return (
    <div className="trading-experience bg-woodsmoke sm:pl-40 rounded-2xl relative flex xs:flex-col lg:flex:row xs:items-center sm:items-start xs:justify-start lg:items-start lg:justify-start">
      <div className="flex flex-col justify-between pb-20">
        <p className="experience-title text-40 text-primary xs:w-full sm:w-385 pt-40 leading-8">
          Free demo account
        </p>
        <p className="xs:text-19 lg:text-15 text-second mt-25 mb-40 xs:w-300 lg:w-230">
          New to binary options? No problem. Get started with a demo account to learn the
          basics.
        </p>
        <Link to="/trade">
          <ArrowIcon
            text="TRY NOW"
            revert={true}
            status={"up"}
            className="font-OcrExtendedRegular"
          />
        </Link>
      </div>
      <div className="sm:absolute token-logo items-center xs:w-280 lg:w-180 bottom-0 sm:right-0">
        <img src={`./assets/images/demo-account.png`} alt={`experience logo`} />
      </div>
    </div>
  );
};

export default DemoAccount;
