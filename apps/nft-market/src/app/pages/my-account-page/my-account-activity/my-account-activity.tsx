import { Box, CircularProgress, Container } from "@mui/material";
import { useSelector } from "react-redux";
import { useImpersonateAccount } from "@fantohm/shared-web3";
import { useGetUserNotificationsQuery } from "../../../api/backend-api";
import { RootState } from "../../../store";
import { Notification, NotificationStatus } from "../../../types/backend-types";
import "./my-account-activity.module.scss";
import { NotificationEntry } from "./notification-entry";

export const MyAccountActivity = (): JSX.Element => {
  const { user } = useSelector((state: RootState) => state.backend);
  const { impersonateAddress, isImpersonating } = useImpersonateAccount();
  const userAddress = isImpersonating ? impersonateAddress : user.address;
  const { data: unreadNotifications, isLoading: isUnreadNotificationsLoading } =
    useGetUserNotificationsQuery({
      userAddress,
      status: NotificationStatus.Unread,
    });

  const { data: readNotifications, isLoading: isReadNotificationsLoading } =
    useGetUserNotificationsQuery({
      userAddress,
      status: NotificationStatus.Read,
    });

  return (
    <Container sx={{ mt: "50px" }} maxWidth="lg">
      {(isUnreadNotificationsLoading || isReadNotificationsLoading) && (
        <Box className="flex fr fj-c ai-c">
          <CircularProgress />
        </Box>
      )}
      <Box className="flex fc ai-fs">
        <h2>Unread Notifications ({unreadNotifications?.length || 0})</h2>
        {!!unreadNotifications &&
          unreadNotifications.length > 0 &&
          unreadNotifications.map((notification: Notification, index: number) => (
            <NotificationEntry
              notification={notification}
              key={`unread-notification-${index}`}
            />
          ))}
        <h2>Past Notifications ({readNotifications?.length || 0})</h2>
        {!!readNotifications &&
          readNotifications.length > 0 &&
          readNotifications.map((notification: Notification, index: number) => (
            <NotificationEntry
              notification={notification}
              key={`read-notification-${index}`}
            />
          ))}
      </Box>
    </Container>
  );
};

export default MyAccountActivity;
