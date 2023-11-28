import { Badge, Button, Popover, SvgIcon } from "@mui/material";
import { NotificationsNone } from "@mui/icons-material";
import { useEffect, useState } from "react";

const notifications = [
  {
    type: "price",
    description: "ETH/DAI is up +5.00% over the past 24 hours",
  },
  {
    type: "price",
    description: "ETH/DAI is above 15100",
  },
  {
    type: "price",
    description: "ETH/DAI is up -5.00% over currently",
  },
  {
    type: "price",
    description: "ETH/DAI is up +5.00% over the past 24 hours",
  },
  {
    type: "price",
    description: "ETH/DAI is above 15100",
  },
  {
    type: "price",
    description: "ETH/DAI is up -5.00% over currently",
  },
];

const NotificationMenu = () => {
  const [isInvisible, setInvisible] = useState(false);
  const [flagAccountDropDown, setFlagAccountDropDown] = useState<null | HTMLElement>(
    null
  );

  useEffect(() => {
    if (notifications.length > 0) setInvisible(false);
    else setInvisible(true);
  }, [notifications]);

  const accountDrop = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFlagAccountDropDown(event.currentTarget);
  };

  return (
    <div className="rounded-2xl">
      <Button
        id="notification-menu-button"
        aria-controls={flagAccountDropDown ? "notification-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={flagAccountDropDown ? "true" : undefined}
        className="bg-woodsmoke hover:bg-bunker rounded-2xl xs:hidden sm:block mr-10"
        onClick={accountDrop}
        sx={{
          p: "10px",
          minWidth: "30px",
          "& .Mui-focused": { backgroundColor: "#0E1415" },
          "& .css-8je8zh-MuiTouchRipple-root": { display: "none" },
        }}
      >
        <Badge
          badgeContent=""
          variant="dot"
          invisible={isInvisible}
          sx={{ "& .MuiBadge-dot": { backgroundColor: "#12b3a8" } }}
        >
          <NotificationsNone className="text-primary" />
        </Badge>
      </Button>
      <Popover
        id={"notification-menu"}
        open={Boolean(flagAccountDropDown)}
        anchorEl={flagAccountDropDown}
        onClose={() => setFlagAccountDropDown(null)}
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        className="accountDropdown mt-20"
        disableScrollLock={true}
        sx={{
          "& .MuiPopover-paper": { backgroundColor: "#0B0F10", borderRadius: "25px" },
        }}
      >
        <div className="py-20 bg-woodsmoke text-primary sm:w-450 cursor-default shadow-3xl">
          <div className="flex justify-between items-center px-20 pb-10">
            <h3 className="text-primary text-19">Notifications</h3>
          </div>
          <div className="notifications px-20 max-h-180 overflow-y-auto scrollbar-hide">
            {notifications.map((item, index) => (
              <div className="notification flex items-center mb-10" key={index}>
                <SvgIcon
                  component={NotificationsNone}
                  className="text-35 text-primary rounded-full p-5 bg-[#0f1617] mr-10 w-40 h-40"
                />
                <div className="grow text-primary">
                  <p className="text-16 font-InterMedium">
                    {item.type[0].toUpperCase() + item.type.slice(1).toLowerCase()}
                    &nbsp;Alert
                  </p>
                  <p className="text-18">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Popover>
    </div>
  );
};

export default NotificationMenu;
