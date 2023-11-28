import {
  createSlice,
  createSelector,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

import { RootState } from "../index";
import { ChatInterface } from "../../core/interfaces/basic.interface";
import { backendInstance } from "../../helpers/axios";

interface ChatData {
  readonly chatStatus: "unknown" | "pending" | "ready" | "failed";
  messages: ChatInterface[];
}

const initialState: ChatData = {
  chatStatus: "unknown",
  messages: [],
};

export const loadMessages = createAsyncThunk("chat/loadMessages", async () => {
  const response = await backendInstance.get(`/chat`);
  return response;
});

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatStatus: (state, action: PayloadAction<Omit<ChatData, "messages">>) => {
      state.chatStatus = action.payload.chatStatus;
    },
    addMessage: (state, action: PayloadAction<ChatInterface>) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadMessages.pending, (state) => {
      state.chatStatus = "pending";
    });
    builder.addCase(
      loadMessages.fulfilled,
      (state, action: PayloadAction<AxiosResponse<ChatInterface[]>>) => {
        state.chatStatus = "ready";
        state.messages = [...action.payload.data];
      }
    );
    builder.addCase(loadMessages.rejected, (state) => {
      state.chatStatus = "failed";
    });
  },
});

const baseInfo = (state: RootState) => state.chat;

export const chatReducer = chatSlice.reducer;
export const { setChatStatus, addMessage } = chatSlice.actions;
export const getChatState = createSelector(baseInfo, (chat) => chat);
