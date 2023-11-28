import { configureStore, createSelector } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { appReducer } from "./reducers/app-slice";
import { chatReducer } from "./reducers/chat-slice";
import { saveState, walletReducer } from "@fantohm/shared-web3";
import { marketsReducer } from "./reducers/markets-slice";
import { vaultsReducer } from "./reducers/vaults-slice";
import { accountReducer } from "./reducers/account-slice";
import pendingTxReducer from "./reducers/pendingTx-slice";

const store = configureStore({
  reducer: {
    app: appReducer,
    wallet: walletReducer,
    account: accountReducer,
    chat: chatReducer,
    markets: marketsReducer,
    vaults: vaultsReducer,
    pendingTx: pendingTxReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

store.subscribe(() => {
  saveState("app", store.getState().app);
  saveState("wallet", store.getState().wallet);
  saveState("account", store.getState().account);
  saveState("chat", store.getState().chat);
  saveState("markets", store.getState().markets);
  saveState("vaults", store.getState().vaults);
});

const accountInfo = (state: RootState) => state.account;
export const getAccountState = createSelector(accountInfo, (account) => account);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
