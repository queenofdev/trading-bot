import { isRejectedWithValue } from "@reduxjs/toolkit";
import type { MiddlewareAPI, Middleware } from "@reduxjs/toolkit";
import { addAlert, setOpenseaStatus } from "../reducers/app-slice";

export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (
      isRejectedWithValue(action) &&
      action.type === "backendApi/executeQuery/rejected"
    ) {
      api.dispatch(
        addAlert({
          message:
            "There was an error fetching data from the backend. Please try again later.",
          severity: "error",
        })
      );
      console.log("NFT Port Error");
    }

    return next(action);
  };
