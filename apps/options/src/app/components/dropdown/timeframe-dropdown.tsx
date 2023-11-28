import { SvgIcon, MenuItem, Menu, Button } from "@mui/material";
import {
  KeyboardArrowDownOutlined,
  KeyboardArrowUpOutlined,
  WatchLaterOutlined,
} from "@mui/icons-material";
import { useState, MouseEvent, Dispatch, SetStateAction } from "react";

import { LabelIcon } from "../label-icon/label-icon";
import { timeframes } from "../../core/constants/tradingview";

interface TimeframeDropdownProps {
  timeframe: number;
  setTimeframe: Dispatch<SetStateAction<number>>;
}

export const TimeframeDropdown = (props: TimeframeDropdownProps) => {
  const { timeframe, setTimeframe } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState<boolean>(false);

  const convertTimeString = (e: number) => {
    let timeType: string;
    if (e < 10) timeType = "0:0" + e.toString() + ":00";
    else timeType = "0:" + e.toString() + ":00";
    return timeType;
  };

  const handleDropDownOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(!open);
  };
  const handleDropDownClose = () => {
    setAnchorEl(null);
    setOpen(!open);
  };

  const handleMenuItemClick = (timeframe: number) => {
    setAnchorEl(null);
    setOpen(!open);
    setTimeframe(timeframe);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleDropDownOpen}
        className="flex items-center rounded-2xl bg-woodsmoke p-10 w-150 justify-between"
      >
        <LabelIcon
          label={convertTimeString(timeframe)}
          icon={WatchLaterOutlined}
          reverse
          backgroundColor="woodsmoke"
          iconColor="success"
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
            width: "150px",
          },
          "& .MuiPaper-elevation1": {
            backgroundColor: "#0B0F10",
            py: "5px",
          },
        }}
      >
        {timeframes.map((timeframe: number, index) => (
          <MenuItem onClick={() => handleMenuItemClick(timeframe)} key={index}>
            <p className="text-primary">{timeframe}&nbsp;m</p>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
