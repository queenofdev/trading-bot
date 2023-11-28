export type BlogPostDTO = {
  id?: string;
  date: string;
  blogTitle: string;
  isFeatured: boolean;
  blogAsset?: string;
  blogCategory?: string;
  content: string;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  getInTouch?: string;
};
