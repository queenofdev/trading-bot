import { IconButton, Menu, MenuItem } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { useState, MouseEvent } from "react";

import {
  TradingView_Internal_Date,
  TradingView_Rage_Date,
} from "../../core/constants/tradingview";

export const DateRage = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="xs:hidden sm:flex items-center">
        {Object.keys(TradingView_Internal_Date).map((option) => (
          <p key={option} className="text-second px-10">
            {option}
          </p>
        ))}
      </div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        className="text-second"
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: "80px",
          },
        }}
        sx={{
          "& .MuiList-root": {
            padding: "0px",
            backgroundColor: "#0B0F10",
            width: "200px",
            color: "#ffffff",
          },
          "& .MuiPaper-elevation1": {
            backgroundColor: "#0B0F10",
            py: "5px",
          },
        }}
      >
        {Object.keys(TradingView_Internal_Date).map((option) => (
          <MenuItem
            key={option}
            selected={option === "Pyxis"}
            onClick={handleClose}
            className="text-primary xs:block sm:hidden"
          >
            {option}
          </MenuItem>
        ))}
        {Object.keys(TradingView_Rage_Date).map((option) => (
          <MenuItem
            key={option}
            selected={option === "Pyxis"}
            onClick={handleClose}
            className="text-primary"
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
