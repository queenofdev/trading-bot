import { setAll } from "@fantohm/shared-web3";
import {
  createSlice,
  createSelector,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { loadState } from "../localstorage";
import { RootState } from "..";
import { BlogPostDTO } from "@fantohm/shared-helpers";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
// eslint-disable-next-line @typescript-eslint/no-var-requires
const contentful = require("contentful");

export const loadAppDetails = createAsyncThunk("app/loadAppDetails", async () => {
  const posts: BlogPostDTO[] = [];
  const client = contentful.createClient({
    space: "38g4g4wmfp15",
    accessToken: "hIyu_c-gNoP0E__ihOjls2XzVE4Tu5ZPV1YlNq-vaSc",
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
        // console.log(entryResult.fields.getInTouch.fields.content);
        // console.log("entryResult", entryResult);
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
  } as IAppData;
});

interface IAppData {
  readonly loading: boolean;
  readonly theme: string;
  readonly checkedConnection: boolean;
  blogPosts: any;
}

// load cached application state
const appState = loadState();
const initialState: IAppData = {
  loading: true,
  theme: "dark",
  blogPosts: undefined,
  checkedConnection: false,
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  ...appState?.app,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      state.blogPosts = action.payload;
      setAll(state, action.payload);
    },
    setCheckedConnection: (state, action: PayloadAction<boolean>) => {
      state.checkedConnection = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
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

export const { setTheme, setLoading, setCheckedConnection } = appSlice.actions;

export const getAppState = createSelector(baseInfo, (app) => app);
