import { IconButton, Menu } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { MouseEvent, useState } from "react";
import { Link } from "react-router-dom";

import Logo from "../logo/logo";
import SearchBar from "./search";
import { NavItemProp } from "../../core/types/types";
import { NavItems } from "../../core/constants/basic";
import UserMenu from "./user-menu";

const Navbar = (): JSX.Element => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  return (
    <div className="w-full xs:h-70 md:h-90 flex justify-between items-center bg-aztec xs:p-10 sm:py-10 md:py-20 fixed top-0 left-0 z-40 bg-opacity-0 backdrop-blur-lg border-b border-bunker font-Inter sm:px-20 lg:px-50 xl:px-60 2xl:px-90">
      <div className="h-90 flex items-center mr-5 border-b-2 border-b-aztec border-opacity-0 hover:border-success">
        <Logo />
      </div>
      <SearchBar />
      <div className="xs:hidden md:flex">
        {NavItems.map((items, index) => {
          return (
            <Link
              to={items.href}
              key={index}
              className="h-90 flex items-center text-18 text-primary xs:px-10 xl:px-20 cursor-default border-b-2 border-b-aztec border-opacity-0 hover:border-b-success"
            >
              {items.title}
            </Link>
          );
        })}
      </div>
      <div className="flex justify-end items-center">
        <div className="flex">
          <UserMenu />
        </div>
        <div className="xs:block md:hidden xs:ml-5 sm:ml-15">
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
            className="xs:w-20 sm:w-auto flex justify-center items-center"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="basic-menu"
            className="flex flex-col"
            anchorEl={anchorElNav}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            sx={{
              "& .MuiList-root": {
                padding: "0px",
              },
            }}
          >
            {NavItems.map((item: NavItemProp) => {
              return (
                <div
                  className="flex justify-center bg-gray-500 text-white px-40 py-10 cursor-default"
                  key={item.title}
                >
                  <Link
                    onClick={handleCloseNavMenu}
                    to={item.href}
                    className="cursor-default"
                  >
                    {item.title}
                  </Link>
                </div>
              );
            })}
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
