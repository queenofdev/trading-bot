import { setAll } from "@fantohm/shared-web3";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { loadState } from "../localstorage";
import { RootState } from "..";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries

// export const loadBlogPosts = createAsyncThunk("app/loadBlogPosts", async () => {
//   const posts: BlogPostDTO[] = [];
//
//   return {
//     blogPosts: posts,
//   } as IBlogData;
// });
//
// interface IBlogData {
//   readonly blogPosts: BlogPostDTO[];
// }
//
// // load cached application state
// const appState = loadState();
// const initialState: IBlogData = {
//   loading: true,
//   loadingMarketPrice: false,
//   theme: "dark",
// };
//
// const backendSlice = createSlice({
//   name: "backend",
//   initialState,
//   reducers: {
//     fetchAppSuccess(state, action) {
//       setAll(state, action.payload);
//     },
//   },
// });
//
//
// export const backendReducer = backendSlice.reducer;
//
// export const getAppState = createSelector(baseInfo, (backend) => backend);
