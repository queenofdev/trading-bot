import { SvgIcon, MenuItem, Menu, Button } from "@mui/material";
import {
  KeyboardArrowDownOutlined,
  KeyboardArrowUpOutlined,
  Search,
} from "@mui/icons-material";
import { useState, MouseEvent } from "react";

import { LabelIcon } from "../label-icon/label-icon";
import { TokenPair } from "../token-pair/token-pair";
import { CryptoCurrency } from "../../core/types/types";
import { useSelector } from "react-redux";

import { RootState } from "../../store";

interface CurrencyDropDownProps {
  bettingCurrencies: CryptoCurrency[];
}

export const BettingCurrencyDropdown = (props: CurrencyDropDownProps) => {
  const underlyingToken = useSelector((state: RootState) => state.app.underlyingToken);

  const { bettingCurrencies } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState<boolean>(false);

  const handleDropDownOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(!open);
  };
  const handleDropDownClose = () => {
    setAnchorEl(null);
    setOpen(!open);
  };

  const handleMenuItemClick = (currency: CryptoCurrency) => {
    setAnchorEl(null);
    setOpen(!open);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleDropDownOpen}
        className="flex items-center px-10 py-5 w-200 justify-between"
      >
        <LabelIcon
          label={underlyingToken.name}
          icon={() => (
            <img
              src={`./assets/images/${underlyingToken.symbol}.png`}
              alt={`${underlyingToken.symbol} logo`}
              width={30}
            />
          )}
          reverse
          labelFontSize={25}
          className="bg-inherit"
        />
        <SvgIcon
          component={!open ? KeyboardArrowDownOutlined : KeyboardArrowUpOutlined}
          className="text-white ml-5"
        />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleDropDownClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={{
          "& .MuiList-root": {
            padding: "0px",
            backgroundColor: "#0B0F10",
            width: "200px",
          },
          "& .MuiPaper-elevation1": {
            backgroundColor: "#0B0F10",
            py: "5px",
            borderRadius: "30px",
          },
        }}
      >
        <div className="search flex items-center py-10 px-20">
          <SvgIcon className="text-25 text-second" component={Search} />
          <div className="px-5">
            <input
              type="text"
              className="xs:text-10 md:text-16 w-140 outline-none bg-woodsmoke text-primary"
              placeholder="Search for token"
            />
          </div>
        </div>
        {Object.values(bettingCurrencies).map((currency: CryptoCurrency, index) => (
          <MenuItem
            onClick={() => handleMenuItemClick(currency)}
            key={index}
            className="w-200"
          >
            <TokenPair underlyingToken={currency} basicToken="DAI" key={index} />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
