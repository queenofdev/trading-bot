import { NftPortAsset } from "../api/nftport";
import { OpenseaAsset, OpenseaCollection } from "./opensea-types";
import { ReservoirToken } from "../api/reservoir";
import { erc20Currency } from "../helpers/erc20Currency";
import { BigNumber } from "ethers";

// request types
export type CreateListingRequest = {
  asset: Asset | string;
  status: ListingStatus;
} & IncludesTerms;

// response types
export type LoginResponse = User;

export type AllAssetsResponse = {
  data: Asset[];
  count: number;
};

export type CreateAssetResponse = {
  asset: Asset;
};

export type AllListingsResponse = {
  data: Listing[];
  count: number;
};

export type CreateListingResponse = {
  asset: Asset;
  status: ListingStatus;
} & IncludesTerms;

export type AffiliateFee = {
  id: string;
  affilate: string;
  currency: string;
  fee: string;
  updatedAt: string;
  price: number;
  icon: string;
  tokenName: string;
  tokenSymbol: string;
  decimals: number;
};

export type AffiliateData = {
  referralCode?: string;
  referredAddresses?: {
    user: string;
    affiliate: string;
  }[];
  affiliateFees?: AffiliateFee[];
  proofs?: string[][];
  isBonus?: boolean;
  totalAmounts?: {
    token: erc20Currency;
    amount: BigNumber;
  }[];
};

export type SaveAffiliateResponse = {
  data: {
    user: string;
    affiliate: string;
  };
  success: boolean;
};

// data models
export enum AssetStatus {
  New = "NEW", // Not on backend yet
  Ready = "READY", // on backend, unlisted, unlocked
  Listed = "LISTED",
  Locked = "LOCKED",
  TRANSFERRED = "TRANSFERRED",
}

export enum CollectibleMediaType {
  Image = "IMAGE",
  Video = "VIDEO",
  Gif = "GIF",
  ThreeD = "THREE_D",
  Html = "HTML",
  Audio = "AUDIO",
}

export enum AssetChain {
  eth,
  sol,
}

export type Person = {
  id?: string;
  address: string;
  name?: string;
  email?: string;
  description?: string;
  profileImageUrl?: string;
} & StandardBackendObject;

export type Owner = {
  id?: string;
  address: string;
  name?: string;
  email?: string;
  description?: string;
  profileImageUrl?: string;
} & StandardBackendObject;

export type User = Person;

export type Terms = {
  id?: string;
  usdPrice?: number;
  amount: number;
  apr: number;
  duration: number;
  expirationAt: string;
  signature: string;
  currencyAddress: string;
} & StandardBackendObject;

export enum ListingStatus {
  Pending = "PENDING",
  Listed = "LISTED",
  Completed = "COMPLETED",
  Cancelled = "CANCELLED",
}

export type IncludesTerms = {
  term: Terms;
};

export type Listing = {
  id?: string;
  asset: Asset;
  status: ListingStatus;
  cacheExpire?: number;
} & StandardBackendObject &
  IncludesTerms;

export type Chain = "eth" | "sol";

export enum NftPriceProvider {
  Nabu = "NABU",
  Upshot = "UPSHOT",
  NftBank = "NFT_BANK",
}

export type BackendAsset = {
  status: AssetStatus;
  cacheExpire?: number;
  openseaLoaded?: number;
  hasPermission?: boolean;
  id?: string;
  tokenId: string;
  openseaId?: string;
  name: Nullable<string>;
  description: Nullable<string>;
  mediaType: CollectibleMediaType;
  frameUrl: Nullable<string>;
  imageUrl: Nullable<string>;
  gifUrl: Nullable<string>;
  videoUrl: Nullable<string>;
  threeDUrl: Nullable<string>;
  fileUrl?: Nullable<string>;
  magicUrl?: Nullable<string>;
  contentType?: Nullable<string>;
  contentLength?: number;
  thumbUrl: string;
  isOwned: boolean;
  owner: Owner;
  dateCreated: Nullable<string>;
  dateLastTransferred: Nullable<string>;
  externalLink: Nullable<string>;
  permaLink: Nullable<string>;
  assetContractAddress: string;
  chain: Chain;
  wallet: string;
  usable: boolean;
} & StandardBackendObject;

export type Asset = BackendAsset & {
  collection: OpenseaCollection;
  osData?: OpenseaAsset;
  npData?: NftPortAsset;
  reservoirData?: ReservoirToken;
};

export type Nullable<T> = T | null;

export type StandardAssetLookupParams = {
  tokenId: string;
  contractAddress: string;
};

export enum NotificationStatus {
  Read = "READ",
  Unread = "UNREAD",
}

export enum NotificationContext {
  NewLoan = "NEW_LOAN",
  Repayment = "REPAYMENT",
  Liquidation = "LIQUIDATION",
  NewOffer = "NEW_OFFER",
  OfferAccepted = "OFFER_ACCEPTED",
  OfferUpdated = "OFFER_UPDATED",
  OfferRemoved = "OFFER_REMOVED",
  OfferRejected = "OFFER_REJECTED",
  ListingCancelled = "LISTING_CANCELLED",
}

export enum Importance {
  High = "HIGH",
  Medium = "MEDIUM",
  Low = "LOW",
}

export type AllNotificationsResponse = {
  data: Notification[];
  count: number;
};

export enum UserType {
  Lender = "LENDER",
  Borrower = "BORROWER",
}

export type Notification = {
  id?: string;
  user: User;
  importance?: Importance;
  contextId: string;
  status?: NotificationStatus;
  userType?: UserType;
  context: NotificationContext;
} & StandardBackendObject;

export type ApiResponse = {
  success: boolean;
  message: string;
};

export type EditNotificationRequest = {
  id: string;
  importance: Importance;
  message: string;
  status: NotificationStatus;
};

export enum BackendLoadingStatus {
  idle = "idle",
  loading = "loading",
  succeeded = "succeeded",
  failed = "failed",
}

export enum LoanStatus {
  Active = "ACTIVE",
  Default = "DEFAULT",
  Complete = "COMPLETE",
}

export type Loan = {
  id?: string;
  lender: Person;
  borrower: Person;
  assetListing: Listing;
  term: Terms;
  status: LoanStatus;
  contractLoanId?: number;
  currencyPrice?: number;
  amountDue?: number;
  offerId?: string;
  lendingContractAddress?: string;
} & StandardBackendObject;

export type Updatable = {
  updatedAt?: string;
};

export type Deleteable = {
  deletedAt?: string;
};

export type Creatable = {
  createdAt?: string;
};

export type StandardBackendObject = Updatable & Creatable & Deleteable;

export enum OfferStatus {
  Accepted = "ACCEPTED",
  Cancelled = "CANCELLED",
  Complete = "COMPLETE",
  Expired = "EXPIRED",
  Ready = "READY",
  Rejected = "REJECTED",
}

export type Offer = {
  id?: string;
  lender: User;
  assetListing: Listing;
  status: OfferStatus;
} & StandardBackendObject &
  IncludesTerms;

export type Collection = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  contractAddress: string;
  openListingCount: number;
  closeListingCount: number;
  openLoanCount: number;
  closeLoanCount: number;
} & StandardBackendObject;

export type BackendCollectionQuery = {
  contractAddress?: string;
  slug: string;
  keyword: string;
  sortQuery: string;
} & BackendStandardQuery;

export type BackendStandardQuery = {
  skip: number;
  take: number;
  sortQuery?: string;
};

export type FrontendAssetFilterQuery = Omit<Partial<Asset>, "status"> & {
  openseaIds?: string[];
  status: AssetStatus | "All";
};
export type BackendAssetQueryParams = {
  status?: AssetStatus;
  contractAddresses?: string;
  tokenIds?: string;
  mediaType?: CollectibleMediaType;
} & BackendStandardQuery;

export type BackendLoanQueryParams = {
  assetId?: string;
  contractAddress?: string;
  tokenId?: string;
  assetListingId?: string;
  lenderAddress?: string;
  borrowerAddress?: string;
  walletAddress?: string;
  status?: LoanStatus;
} & BackendStandardQuery;

export type BackendOfferQueryParams = {
  assetId: string;
  assetListingId: string;
  lenderAddress: string;
  borrowerAddress: string;
  status: OfferStatus;
} & BackendStandardQuery;

export type BackendNotificationQueryParams = {
  status?: NotificationStatus;
  context?: NotificationContext;
  userAddress?: string;
} & BackendStandardQuery;

export type PlatformWalletInfo = {
  totalBorrowed: number;
  totalLent: number;
  loansRepaid: number;
  loansDefaulted: number;
  loansBorrowed: number;
  loansGiven: number;
};
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

export type NftPrice = {
  id: string;
  chain: Chain;
  collection: string;
  tokenId: string;
  priceProvider: NftPriceProvider;
  priceInEth: string;
  priceInUsd: string;
  originalProviderResponse: string;
};

export type BackendNftAssetsQueryParams = {
  walletAddress: string;
  limit: number;
  contractAddress?: string;
  continuation?: string;
};

export type BackendNftAssetsQueryResponse = {
  continuation: string;
  count: number;
  assets: Asset[];
};

export type SendReport = {
  subject: string;
  text: string;
  to: string;
};
