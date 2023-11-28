import { useCallback, useMemo } from "react";
import { Box, Paper } from "@mui/material";
import { prettifySeconds } from "@fantohm/shared-web3";
import { Notification, NotificationStatus } from "../../../types/backend-types";
import { useUpdateUserNotificationMutation } from "../../../api/backend-api";
import NotificationMessage from "../../../components/notification-message/notification-message";

export type NotificationEntryProps = {
  notification: Notification;
};

export const NotificationEntry = ({
  notification,
}: NotificationEntryProps): JSX.Element => {
  const [updateNotification] = useUpdateUserNotificationMutation();
  const handleRecordClick = useCallback(() => {
    if (notification?.status !== NotificationStatus.Read) {
      updateNotification({ ...notification, status: NotificationStatus.Read });
    } else {
      updateNotification({ ...notification, status: NotificationStatus.Unread });
    }
  }, [notification]);

  const createdAgo = useMemo(() => {
    if (!notification || !notification.createdAt) return "";
    const createdAtTimestamp = Date.parse(notification?.createdAt);
    return prettifySeconds((Date.now() - createdAtTimestamp) / 1000);
  }, [notification.createdAt]);

  return (
    <Paper sx={{ my: "1em", width: "100%", cursor: "pointer" }}>
      <Box className="flex fr">
        <NotificationMessage notification={notification} />
        <Box
          sx={{
            display: "flex",
            width: "200px",
            justifyContent: "space-around",
            alignItems: "center",
            ml: "10px",
            mr: "10px",
            color: "#8991A2",
          }}
          onClick={handleRecordClick}
        >
          {notification.status === NotificationStatus.Read && `Mark as unread`}
          {notification.status === NotificationStatus.Unread && (
            <>
              <Box
                sx={{
                  width: "15px",
                  height: "15px",
                  background: "#374fff",
                  borderRadius: "50%",
                }}
              />
              Mark as read
            </>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            color: "#8991A2",
            ml: "auto",
            width: "200px",
            alignItems: "center",
          }}
        >
          {createdAgo} ago
        </Box>
      </Box>
    </Paper>
  );
};
