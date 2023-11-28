import { SxProps, Theme } from "@mui/material";

export type PageParams = {
  sx?: SxProps<Theme> | undefined;
  comingSoon?: boolean;
};

export type Page = {
  title: string;
  params?: PageParams;
  href?: string;
};

export type FooterItem = {
  label: string;
  pages: Page[];
};

export const headerPages: Page[] = [
  // { title: "Traditional Finance", href: "/trad-fi", params: { comingSoon: false } },
  // { title: "Stablecoin Farming", href: "/staking", params: { comingSoon: false } },
  { title: "Minter", href: "/mint", params: { comingSoon: false } },
  // { title: "xFHM", href: "/xfhm?enable-testnet=true", params: { comingSoon: true } },
  // { title: "USDB Bank", href: "", params: { comingSoon: true } },
  {
    title: "Bridge",
    href: "https://synapseprotocol.com/?inputCurrency=USDB&outputCurrency=USDB&outputChain=1",
    params: { comingSoon: false },
  },
  /* FIXME vercel */
  { title: "Vault", href: "/vault", params: { comingSoon: false } },
  // { title: "Backed NFT", href: "/backed-nft", params: { comingSoon: false } },
  // { title: "Amps", href: "/amps", params: { comingSoon: true } },
];

export const balanceheaderPages: Page[] = [
  { title: "About", href: "/about", params: { comingSoon: false } },
  { title: "USDB", href: "/usdb", params: { comingSoon: false } },
  { title: "FHM", href: "https://fantohm.com/", params: { comingSoon: false } },
  { title: "Dex", href: "https://app.fantohm.com/#/dex", params: { comingSoon: false } },
  { title: "NFT Marketplace", href: "", params: { comingSoon: true } },
];

export const footerItems: FooterItem[] = [
  {
    label: "Products",
    pages: [
      // { title: "Tradfi", href: "/trad-fi" },
      // { title: "Stablecoin Farming", href: "/staking" },
      // { title: "xFHM", href: "", params: { comingSoon: true } },
      // { title: "USDB Bank", href: "", params: { comingSoon: true } },
      { title: "Minter", href: "/mint" },
      {
        title: "Bridge",
        href: "https://synapseprotocol.com/?inputCurrency=USDB&outputCurrency=USDB&outputChain=1",
      },
      { title: "Vault", href: "/vault", params: { comingSoon: false } },
      // { title: "Backed NFT", href: "/backed-nft" },
      // { title: "Amps", href: "/amps", params: { comingSoon: true } },
    ],
  },
  {
    label: "Useful Links",
    pages: [
      { title: "My Account", href: "/my-account" },
      { title: "Documentation", href: "https://fantohm.gitbook.io/documentation" },
      {
        title: "Audits",
        href: "https://github.com/fantohm-dev/fantohm-contracts/tree/main/audit",
      },
      { title: "FantOHM", href: "https://app.fantohm.com/" },
    ],
  },
  {
    label: "Community",
    pages: [
      { title: "Twitter", href: "https://twitter.com/usdb_" },
      { title: "Discord", href: "https://discord.com/invite/8wAQWZgjCv" },
      {
        title: "Youtube",
        href: "https://www.youtube.com/channel/UCa1eJEgcVnFhfLNdjw3yr4g",
      },
      { title: "Reddit", href: "https://www.reddit.com/r/USDB_OFFICIAL/" },
    ],
  },
];
