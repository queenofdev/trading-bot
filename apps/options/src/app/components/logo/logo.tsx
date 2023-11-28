import { Link } from "react-router-dom";
import OptionsLogo from "../../../assets/images/Options_logo.png";
import OptionsLogoDark from "../../../assets/images/Options_logo_dark.png";

export interface LogoProps {
  dark?: boolean;
}

export function Logo(props: LogoProps) {
  return (
    <div className="min-w-[120px]">
      <Link to="/">
        <img
          src={props?.dark === true ? OptionsLogoDark : OptionsLogo}
          width="100%"
          alt="Options Logo"
        />
      </Link>
    </div>
  );
}

export default Logo;
