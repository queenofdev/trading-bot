import { SvgIcon } from "@mui/material";
import { Report, Twitter } from "@mui/icons-material";
import { Link } from "react-router-dom";

import Logo from "../logo/logo";
import Discord from "../../../assets/icons/discord.svg";
import { NavItemProp } from "../../core/types/types";
import { NavItems } from "../../core/constants/basic";
import { DiscordURL, ReportURL, TwitterURL } from "../../core/constants/social_url";

const Footer = () => {
  return (
    <div>
      <div className="xs:hidden md:flex  flex-col justify-center items-center py-60 text-second text-16 bg-heavybunker">
        <p>
          Hi-Lo is a{" "}
          <a
            href="http://balance.capital"
            target={"_blank"}
            rel="noreferrer"
            className="underline"
          >
            balance.capital
          </a>{" "}
          product.
        </p>
        <p>
          *Trading binary options carries substantial financial and other risks. Hi-Lo
          does not provide financial advice.
        </p>
      </div>

      <footer className="bg-bunker xs:h-60 md:h-90 flex justify-between items-center md:px-40 lg:px-60 text-second text-18 md:mt-0 cursor-default">
        <div className="xs:hidden lg:flex menu md:w-1/3 justify-between items-center">
          {NavItems.map((item: NavItemProp) => {
            return (
              <Link key={item.title} to={item.href}>
                {item.title}
              </Link>
            );
          })}
        </div>
        <div className="h-full flex justify-center items-center xs:w-full lg:w-1/3">
          <Logo dark />
        </div>
        <div className="xs:hidden lg:flex community-tool lg:w-1/3 justify-around items-center">
          <div className="flex items-center">
            <SvgIcon
              component={() => (
                <img
                  src={Discord}
                  width={25}
                  alt="Discord logo"
                  className="text-second mr-10"
                />
              )}
            />
            <a
              href={DiscordURL}
              target="_blank"
              className="cursor-default"
              rel="noreferrer"
            >
              Discord
            </a>
          </div>
          <div className="flex items-center">
            <SvgIcon component={Twitter} sx={{ width: "30px", marginRight: "5px" }} />
            <a
              href={TwitterURL}
              target="_blank"
              className="cursor-default"
              rel="noreferrer"
            >
              Twitter
            </a>
          </div>
          <div className="flex items-center">
            <SvgIcon component={Report} sx={{ width: "30px", marginRight: "5px" }} />
            <a
              href={ReportURL}
              target="_blank"
              className="cursor-default"
              rel="noreferrer"
            >
              Report
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
