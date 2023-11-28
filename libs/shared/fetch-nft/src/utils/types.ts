import { Nullable } from "../utils/typeUtils";

export type Chain = "eth" | "sol";

export type CollectibleMediaType = "IMAGE" | "VIDEO" | "GIF" | "THREE_D";

type Owner = {
  id?: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  email?: string;
  description?: string;
  profileImageUrl?: string;
};

export type Collectible = {
  id: string;
  tokenId: string;
  openseaId?: string;
  name: Nullable<string>;
  description: Nullable<string>;
  mediaType: CollectibleMediaType;
  frameUrl: string;
  imageUrl: string;
  gifUrl: string;
  videoUrl: string;
  threeDUrl: string;
  thumbUrl: string;
  isOwned: boolean;
  owner: Owner;
  dateCreated: Nullable<string>;
  dateLastTransferred: Nullable<string>;
  externalLink: Nullable<string>;
  permaLink: Nullable<string>;
  assetContractAddress: Nullable<string>;
  chain: Chain;
  wallet: string;
  collection?: any;
};

export type CollectibleState = {
  [wallet: string]: Collectible[];
};
