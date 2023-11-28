import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import {
  Badge,
  Box,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";
import { MouseEvent, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useWeb3Context } from "@fantohm/shared-web3";
import {
  useGetUserNotificationsQuery,
  useUpdateUserNotificationMutation,
} from "../../../api/backend-api";
import { RootState } from "../../../store";
import { NotificationStatus } from "../../../types/backend-types";
import arrowUpRight from "../../../../assets/icons/arrow-right-up.svg";
import NotificationMessage from "../../notification-message/notification-message";
import styles from "./header.module.scss";

export const NotificationMenu = (): JSX.Element => {
  // menu controls
  const [updateNotification] = useUpdateUserNotificationMutation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { address } = useWeb3Context();
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // user data
  const { user, authSignature } = useSelector((state: RootState) => state.backend);
  const { data: unreadNotifications, isLoading: isUnreadNotificationsLoading } =
    useGetUserNotificationsQuery(
      {
        userAddress: user.address,
        status: NotificationStatus.Unread,
      },
      { skip: !address || !authSignature }
    );

  const { data: notifications, isLoading } = useGetUserNotificationsQuery(
    {
      userAddress: user.address,
      status: NotificationStatus.Unread,
      skip: 0,
      take: 4,
    },
    { skip: !address || !authSignature }
  );

  const handleRecordClick = useCallback(() => {
    if (unreadNotifications) {
      for (let i = 0; i < unreadNotifications.length; i++) {
        updateNotification({
          ...unreadNotifications[i],
          status: NotificationStatus.Read,
        });
      }
    }
  }, [unreadNotifications]);

  if (isLoading || isUnreadNotificationsLoading)
    return (
      <Box sx={{ mr: "20px" }} className="flex fr fj-c ai-c">
        <CircularProgress />
      </Box>
    );

  if (!authSignature) {
    return <div></div>;
  }

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          background: "#FFF",
          mr: "10px",
          padding: "12px",
          border: "1px solid #8080801f",
        }}
        className={styles["notificationIcon"]}
      >
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          color="error"
          badgeContent={unreadNotifications?.length}
        >
          <NotificationsNoneOutlinedIcon sx={{ fontSize: "32px", color: "#000" }} />
        </Badge>
      </IconButton>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "user-menu-button",
          sx: {
            "& .MuiMenuItem-root": {
              whiteSpace: "normal",
            },
          },
        }}
        PaperProps={{
          style: {
            padding: "0em 1.5em 0.5em 1.5em",
            margin: "1em 0 0 0",
            borderRadius: "24px",
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        disableScrollLock={true}
      >
        <Box className="flex fr fj-sb" sx={{ mt: "1em" }}>
          <span>Notifications</span>
          <Link
            to={"/my-account/activity"}
            style={{ color: "#8991A2" }}
            onClick={handleClose}
          >
            view all{" "}
            <img
              src={arrowUpRight}
              alt="arrow pointing up and to the right"
              style={{ height: "10px", width: "10px", opacity: "70%" }}
            />
          </Link>
        </Box>
        {(notifications?.length || 0) > 0 && (
          <Box>
            {notifications?.map((notification, i: number) => (
              <MenuItem key={`not-men-${i}`} sx={{ maxWidth: "400px" }}>
                <Paper className="w100" sx={{ padding: "1em" }}>
                  <Box className="flex fr ai-c w100">
                    <NotificationMessage
                      notification={notification}
                      short={true}
                      isMenu
                    />
                  </Box>
                </Paper>
              </MenuItem>
            ))}
            <Box
              className="flex fr fj-c ai-c"
              sx={{ mt: "1em", fontSize: "0.9rem" }}
              style={{ cursor: "pointer" }}
              onClick={handleRecordClick}
            >
              <span>Mark all as read</span>
            </Box>
            <Box className="flex fr fj-c" sx={{ mt: "1em" }}>
              <span style={{ color: "#8991A2" }}>End of recent activity</span>
            </Box>
          </Box>
        )}
        {(notifications?.length || 0) === 0 && (
          <Box
            className="flex fr fj-c ai-c"
            style={{
              width: "250px",
              height: "300px",
              flexDirection: "column",
              margin: "0px 50px",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: "1.4rem" }}>No new notifications</span>
            <span style={{ color: "#8991A2", fontSize: "0.9rem" }}>
              Your recent offers, listings and activity will show up here.
            </span>
          </Box>
        )}
      </Menu>
    </>
  );
};

export default NotificationMenu;
