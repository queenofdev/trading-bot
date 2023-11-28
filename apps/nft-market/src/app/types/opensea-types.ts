export type Nullable<T> = T | null;

type OpenseaUser = {
  user: {
    username: string;
  };
  address: string;
} | null;
type AssetOwner = OpenseaUser;
type AssetCreator = OpenseaUser;
export interface OpenseaAsset {
  id: number;
  contract: OpenseaContract; // Dictionary of data on the contract itself
  token_id: string; // The token ID of the NFT
  image_url: Nullable<string>; // An image for the item. Note that this is the cached URL we store on our end.
  background_color: Nullable<string>; // The background color to be displayed with the item
  name: Nullable<string>; // Name of the item
  external_link: Nullable<string>; // External link to the original website for the item
  owner: Nullable<AssetOwner>; // Dictionary of data on the owner
  traits: OpenseaTrait[]; // A list of traits associated with the item
  last_sale: string | null; // When this item was last sold (null if there was no last sale)
  collection: OpenseaCollection; // Dictionary of collection information
  description: Nullable<string>;
  is_nsfw: boolean;
  permalink: Nullable<string>;
  image_preview_url: Nullable<string>;
  image_thumbnail_url: Nullable<string>;
  image_original_url: Nullable<string>;
  animation_url: Nullable<string>;
  animation_original_url: Nullable<string>;
  youtube_url: Nullable<string>;
  creator: Nullable<AssetCreator>;
  asset_contract: Nullable<OpenseaContract>;
  wallet: string;
}

type OpenseaContract = {
  address: Nullable<string>;
  asset_contract_type: string;
  created_date: string;
  name: string;
  nft_version: string;
  opensea_version: Nullable<string>;
  owner: Nullable<number>;
  schema_name: string;
  symbol: string;
  total_supply: number;
  description: Nullable<string>;
  external_link: Nullable<string>;
  image_url: Nullable<string>;
  default_to_fiat: boolean;
  dev_buyer_fee_basis_points: number;
  dev_seller_fee_basis_points: number;
  only_proxied_transfers: boolean;
  opensea_buyer_fee_basis_points: number;
  opensea_seller_fee_basis_points: number;
  buyer_fee_basis_points: number;
  seller_fee_basis_points: number;
  payout_address: Nullable<string>;
};

export interface OpenseaTrait {
  value: string; //The name of the trait (for example color)
  display_type: "number" | "boost_percentage" | "boost_number" | "boost_number" | "date"; // How this trait will be displayed (options are number, boost_percentage, boost_number, and date).
}

export interface OpenseaOwner {
  address: string;
  username: string;
}

export type OpenseaGetAssetsResponse = {
  assets: OpenseaAsset[];
  next: string;
};

export type OpenseaCollection = {
  banner_image_url?: string;
  chat_url?: string;
  created_date?: string;
  default_to_fiat?: boolean;
  description?: string;
  dev_buyer_fee_basis_points?: string;
  dev_seller_fee_basis_points?: string;
  discord_url?: string;
  display_data?: OpenseaDisplayData;
  external_url?: string;
  featured?: boolean;
  featured_image_url?: string;
  hidden?: boolean;
  image_url: string;
  instagram_username?: string;
  is_nsfw?: boolean;
  is_subject_to_whitelist?: boolean;
  large_image_url?: string;
  medium_username?: string;
  name: string;
  only_proxied_transfers?: boolean;
  opensea_buyer_fee_basis_points?: string;
  opensea_seller_fee_basis_points?: string;
  payout_address?: string;
  require_email?: boolean;
  safelist_request_status?: string;
  short_description?: string;
  slug: string;
  telegram_url?: string;
  twitter_username?: string;
  wiki_url?: string;
  owned_asset_count?: number;
};

export type OpenseaDisplayData = {
  card_display_style: string;
  images: [];
};
