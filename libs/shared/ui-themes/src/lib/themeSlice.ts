import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ThemeState {
  mode: "light" | "dark";
}

const initialState = {
  mode: localStorage.getItem("themeType") || "light",
} as ThemeState;

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.mode = action.payload;
      localStorage.setItem("themeType", action.payload);
    },
  },
});

export const themeReducer = themeSlice.reducer;
export const { setTheme } = themeSlice.actions;
