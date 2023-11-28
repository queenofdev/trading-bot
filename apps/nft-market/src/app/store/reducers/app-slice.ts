import { loadState, setAll } from "@fantohm/shared-web3";
import {
  createSlice,
  createSelector,
  PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { RootState } from "..";
import { BlogPostDTO } from "../../types/backend-types";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const contentful = require("contentful");
export const loadAppDetails = createAsyncThunk("app/loadAppDetails", async () => {
  const posts: BlogPostDTO[] = [];
  const client = contentful.createClient({
    space: "lhm6o2y59b66",
    accessToken: "JQsCRoMe3GxaZvn9yS_mJxT4VfUTWmx380Mr6s7czqk",
    host: "preview.contentful.com",
  });

  const apiResult = await client.getEntries({ content_type: "blogPage" });

  for (const entry of apiResult.items) {
    if (entry) {
      const entryResult = await client.getEntry(entry.sys.id);
      if (entryResult) {
        let imageUrl = "";
        let category = "";
        try {
          imageUrl = entryResult.fields.blogAsset.fields.file.url;
        } catch (e) {
          imageUrl = "";
        }
        try {
          category = entryResult.fields.blogCategory.fields.title;
        } catch (e) {
          category = "";
        }
        posts.push({
          id: entryResult.fields.slug,
          date: entryResult.sys.createdAt,
          blogTitle: entryResult.fields.blogTitle,
          isFeatured: entryResult.fields.isFeatured,
          blogAsset: entryResult.fields.blogAsset,
          content: entryResult.fields.content,
          blogCategory: category,
          image: imageUrl,
          seoTitle: entryResult.fields.seoMetadata.fields.seoTitle,
          seoDescription: entryResult.fields.seoMetadata.fields.description,
          seoKeywords: entryResult.fields.seoMetadata.fields.keywords,
          getInTouch: entryResult.fields.getInTouch.fields.content,
        });
      }
    }
  }

  return {
    blogPosts: posts,
  } as AppData;
});

interface AppData {
  readonly loading: boolean;
  readonly checkedConnection: boolean;
  readonly growlNotifications: GrowlNotification[];
  readonly theme: string;
  readonly isOpenseaUp: boolean;
  blogPosts: any;
}

export type GrowlNotification = {
  title?: string;
  message: string;
  duration: number;
  severity?: string;
  open: boolean;
  startSeconds: number;
};

const previousState = loadState("app");
const initialState: AppData = {
  ...previousState,
  loading: true,
  checkedConnection: false,
  growlNotifications: [],
  blogPosts: undefined,
  theme: "dark",
  isOpenseaUp: true,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      state.blogPosts = action.payload;
      setAll(state, action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCheckedConnection: (state, action: PayloadAction<boolean>) => {
      state.checkedConnection = action.payload;
    },
    addAlert: (state, action: PayloadAction<Partial<GrowlNotification>>) => {
      const alert = {
        duration: action.payload.duration || 10000,
        message: action.payload.message || "",
        severity: action.payload.severity || "success",
        startSeconds: Date.now(),
        title: action.payload.title || "",
        open: true,
      } as GrowlNotification;
      state.growlNotifications = [...state.growlNotifications, alert];
    },
    clearAlert: (state, action: PayloadAction<number>) => {
      state.growlNotifications = [
        ...state.growlNotifications.map((alert: GrowlNotification) => {
          if (alert.startSeconds !== action.payload) return alert;
          return { ...alert, open: false };
        }),
      ];
    },
    setOpenseaStatus: (state, action: PayloadAction<boolean>) => {
      state.isOpenseaUp = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadAppDetails.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(loadAppDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.blogPosts = action.payload;
    });
    builder.addCase(loadAppDetails.rejected, (state, action) => {
      state.loading = false;
    });
  },
});

const baseInfo = (state: RootState) => state.app;

export const appReducer = appSlice.reducer;
export const {
  setLoading,
  setCheckedConnection,
  addAlert,
  clearAlert,
  setOpenseaStatus,
} = appSlice.actions;
export const getAppState = createSelector(baseInfo, (app) => app);
