import { Alert, AlertTitle, LinearProgress, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { GrowlNotification, clearAlert } from "../../store/reducers/app-slice";
import "./growl.module.scss";
import { FailIcon, SuccessCheck } from "@fantohm/shared/images";

export type GrowlColor = "success" | "info" | "warning" | "error";

export const Linear = ({
  growlNotification,
}: {
  growlNotification: GrowlNotification;
}): JSX.Element => {
  const [progress, setProgress] = useState(100);
  const dispatch = useDispatch();

  useEffect(() => {
    const newTimer = setInterval(() => {
      const secondsSinceStart = Date.now() - growlNotification.startSeconds;
      const percentComplete = (secondsSinceStart / growlNotification.duration) * 100;
      const newProgress = 100 - percentComplete;
      setProgress(newProgress);
      if (newProgress <= 0) {
        window.clearInterval(newTimer);
        dispatch(clearAlert(growlNotification.startSeconds));
      }
    }, 333);
    // cleanup function
    return () => clearInterval(newTimer);
  }, []);

  return <LinearProgress variant="determinate" value={progress} />;
};

export const Growl = (): JSX.Element => {
  const { growlNotifications } = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();

  const handleClose = (growlNotification: GrowlNotification) => {
    dispatch(clearAlert(growlNotification.startSeconds));
  };

  return (
    <>
      {growlNotifications.map((growlNotification: GrowlNotification, index: number) => (
        <Snackbar
          open={growlNotification.open}
          key={`alert-${index}`}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            variant="filled"
            icon={false}
            severity={growlNotification.severity as GrowlColor}
            onClose={() => handleClose(growlNotification)}
            style={{
              wordBreak: "break-word",
              borderRadius: "10px",
              backgroundColor: "#000000",
            }}
          >
            <div
              style={{
                height: "30px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <img
                src={
                  growlNotification.severity === "error" ||
                  growlNotification.severity === "warning"
                    ? FailIcon
                    : SuccessCheck
                }
                alt={
                  growlNotification.severity === "error" ||
                  growlNotification.severity === "warning"
                    ? "Icon showing red X"
                    : "Icon showing green checkbox"
                }
                style={{ width: "30px", height: "30px", marginRight: "10px" }}
              />

              <AlertTitle
                style={{
                  height: "100%",
                  fontWeight: "700",
                  fontSize: "16px",
                  marginTop: "7px",
                }}
              >
                {growlNotification.title}
              </AlertTitle>
            </div>
            <div style={{ marginTop: "10px" }}>
              {growlNotification.message}
              <Linear growlNotification={growlNotification} />
            </div>
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default Growl;
