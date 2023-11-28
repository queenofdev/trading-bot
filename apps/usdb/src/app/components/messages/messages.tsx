import { Alert, AlertColor, AlertTitle, LinearProgress, Snackbar } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { close, handle_obsolete, Message } from "@fantohm/shared-web3";
import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import store, { RootState } from "../../store";

const useStyles = makeStyles({
  root: {
    width: "100%",
    marginTop: "10px",
  },
});

interface ILinearProps {
  message: Message;
}

export const Linear = (props: ILinearProps): JSX.Element => {
  const [progress, setProgress] = useState(100);
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    let isSubscribed = true;
    const timer = setInterval(() => {
      if (isSubscribed) {
        setProgress((oldProgress) => {
          if (oldProgress === 0) {
            clearInterval(timer);
            dispatch(close(props.message));
            return 0;
          }
          return oldProgress - 5;
        });
      }
    }, 333);

    return () => {
      isSubscribed = false;
      clearInterval(timer);
    };
  }, [dispatch, props?.message]);

  return (
    <div className={classes.root}>
      <LinearProgress variant="determinate" value={progress} />
    </div>
  );
};

// A component that displays error messages
export const Messages = (): JSX.Element => {
  const messages = useSelector((state: RootState) => state?.messages);
  const dispatch = useDispatch();
  // Returns a function that can closes a message
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleClose = function (message) {
    return function () {
      dispatch(close(message));
    };
  };
  return (
    <>
      {messages.items.map((message: Message, index: any) => {
        return (
          <Snackbar
            open={message.open}
            key={index}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              variant="filled"
              icon={false}
              severity={message.severity as AlertColor}
              onClose={handleClose(message)}
              // NOTE (appleseed): mui includes overflow-wrap: "break-word", but word-break: "break-word" is needed for webKit browsers
              style={{ wordBreak: "break-word", borderRadius: "10px" }}
            >
              <AlertTitle>{message.title}</AlertTitle>
              {message.text}
              <Linear message={message} />
            </Alert>
          </Snackbar>
        );
      })}
    </>
  );
};
// Invoke repeatedly obsolete messages deletion (should be in slice file but I cannot find a way to access the store from there)
window.setInterval(() => {
  store.dispatch(handle_obsolete());
}, 60000);

export default memo(Messages);
