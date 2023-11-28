import { DebugHelper } from "./helpers/debug-helper";
import {
  FantomIcon,
  RinkebyIcon,
  EthereumIcon,
  MoonriverIcon,
  BscIcon,
  MoonBaseAlphaIcon,
} from "@fantohm/shared-ui-themes";

export type NetworkId = number;

export enum NetworkIds {
  Ethereum = 1,
  Rinkeby = 4,
  Goerli = 5,
  Bsc = 56,
  FantomOpera = 250,
  FantomTestnet = 4002,
  Moonriver = 1285,
  MoonbaseAlpha = 1287,
  Boba = 288,
  Avalanche = 43114,
}

export const defaultNetworkId = NetworkIds.FantomOpera;

// TODO once for a while update block times, use yesterday's value as today is not complete day
// https://ftmscan.com/chart/blocktime
// https://moonscan.io/chart/blocktime

interface INetwork {
  name: string;
  logo: any;
  isEnabled: boolean;
  isTestNet: boolean;
  blocktime: number; // NOTE could get this from an outside source since it changes slightly over time
  epochBlock: number;
  epochInterval: number;
  blockCountdownUrl: (block: number) => string;
  getEtherscanUrl: (txnHash: string) => string;
  getPoolTogetherUrls: (contractAddress: string) => string[];
  getEtherscanAddress: (contractAddress: string) => string;
  poolGraphUrl: string;
  liquidityPoolReserveDecimals: {
    token0Decimals: number;
    token1Decimals: number;
  };
  addresses: { [key: string]: string };
  USDB_LENDING_ADDRESSES?: string[];
}

interface INetworks {
  [key: string]: INetwork;
}

export const networks: INetworks = {
  [NetworkIds.FantomOpera]: {
    name: "Fantom",
    logo: FantomIcon,
    isEnabled: true,
    isTestNet: false,
    epochBlock: 20187783,
    blocktime: 0.867, // https://ftmscan.com/chart/blocktime
    epochInterval: 28800,
    blockCountdownUrl: (block) => `https://ftmscan.com/block/countdown/${block}`,
    getEtherscanUrl: (txnHash) => "https://ftmscan.com/tx/" + txnHash,
    getEtherscanAddress: (contractAddress) =>
      "https://ftmscan.com/address/" + contractAddress,
    getPoolTogetherUrls: (contractAddress) => [
      `https://community.pooltogether.com/pools/mainnet/${contractAddress}/home`,
      `https://community.pooltogether.com/pools/mainnet/${contractAddress}/manage#stats`,
    ],
    poolGraphUrl:
      "https://api.thegraph.com/subgraphs/name/pooltogether/pooltogether-v3_4_3",
    liquidityPoolReserveDecimals: {
      token0Decimals: 18,
      token1Decimals: 9,
    },
    addresses: {
      OHM_ADDRESS: "0xfa1FBb8Ef55A4855E5688C0eE13aC3f202486286",
      STAKING_ADDRESS: "0xcb9297425C889A7CbBaa5d3DB97bAb4Ea54829c2", // The new staking contract
      STAKING_HELPER_ADDRESS: "0x068e87aa1eABEBBad65378Ede4B5C16E75e5a671", // Helper contract used for Staking only
      SOHM_ADDRESS: "0x5E983ff70DE345de15DbDCf0529640F14446cDfa",
      PRESALE_ADDRESS: "0xcBb60264fe0AC96B0EFa0145A9709A825afa17D8",
      AOHM_ADDRESS: "0x24ecfd535675f36ba1ab9c5d39b50dc097b0792e",
      DISTRIBUTOR_ADDRESS: "0xCD12666f754aCefa1ee5477fA809911bAB915aa0",
      BONDINGCALC_ADDRESS: "0xf7595d3D87D976CA011E89Ca6A95e827E31Dd581",
      CIRCULATING_SUPPLY_ADDRESS: "0x59EC309001Ec92879790dbdd94d9180B8bCAe908",
      TREASURY_ADDRESS: "0xA3b52d5A6d2f8932a5cD921e09DA840092349D71",
      DAO_ADDRESS: "0xD4aC626A1F87b5955f78FF86237DB055e62D43a0",
      CRUCIBLE_OHM_LUSD: "0x2230ad29920D61A535759678191094b74271f373",
      LQTY: "0x6dea81c8171d0ba574754ef6f8b412f2ed88c54d",
      MIST: "0x88acdd2a6425c3faae4bc9650fd7e27e0bebb7ab",
      REDEEM_HELPER_ADDRESS: "0xF709c33F84Da692f76F035e51EE660a456196A67",
      FUSE_6_SOHM: "0x59bd6774c22486d9f4fab2d448dce4f892a9ae25", // Tetranode's Locker
      FUSE_18_SOHM: "0x6eDa4b59BaC787933A4A21b65672539ceF6ec97b", // Olympus Pool Party
      PT_TOKEN_ADDRESS: "0x0E930b8610229D74Da0A174626138Deb732cE6e9", // 33T token address, taken from `ticket` function on PRIZE_STRATEGY_ADDRESS
      PT_PRIZE_POOL_ADDRESS: "0xEaB695A8F5a44f583003A8bC97d677880D528248", // NEW
      PT_PRIZE_STRATEGY_ADDRESS: "0xf3d253257167c935f8C62A02AEaeBB24c9c5012a", // NEW
      MARKET_PRICE_LP_ADDRESS: "0xd77fc9c4074b56ecf80009744391942fbfddd88b",
      WSOHM_ADDRESS: "0x73199ba57BBFe82a935B9C95850395d80a400937",
      USDB_ADDRESS: "0x6Fc9383486c163fA48becdEC79d6058f984f62cA",
      DAI_ADDRESS: "0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e",
      MASTERCHEF_ADDRESS: "0x4897EB3257A5391d80B2f73FB0748CCd4150b586",
      XFHM_ADDRESS: "",
      LQDR_ADDRESS: "",
      LQDR_USDB_POL_BOND_DEPOSITORY_ADDRESS: "",
      LQDR_USDB_LP_ADDRESS: "",
      USDB_DAI_LP_ADDRESS: "0xD5E946b5619fFf054c40D38c976f1d06C1e2fA82",
      MERKLE_DISTRIBUTOR: "",
      BALANCE_VAULT_MANAGER_ADDRESS: "0x60E71c90510EB4983cf0631d3Bd8909d12c0d051",
    },
  },
  [NetworkIds.FantomTestnet]: {
    name: "Fantom Testnet",
    logo: FantomIcon,
    isEnabled: DebugHelper.isActive("enable-testnet"),
    isTestNet: true,
    blocktime: 3.589,
    epochBlock: 6617987,
    epochInterval: 2880,
    blockCountdownUrl: (block) => `https://testnet.ftmscan.com/block/countdown/${block}`,
    getEtherscanUrl: (txnHash) => "https://testnet.ftmscan.com/tx/" + txnHash,
    getEtherscanAddress: (contractAddress) =>
      "https://testnet.ftmscan.com/address/" + contractAddress,
    getPoolTogetherUrls: (contractAddress) => [
      `https://community.pooltogether.com/pools/rinkeby/${contractAddress}/home`,
      `https://community.pooltogether.com/pools/rinkeby/${contractAddress}/manage#stats`,
    ],
    poolGraphUrl: "https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-v3_4_3",
    liquidityPoolReserveDecimals: {
      token0Decimals: 18,
      token1Decimals: 9,
    },
    addresses: {
      OHM_ADDRESS: "0x4B209fd2826e6880e9605DCAF5F8dB0C2296D6d2",
      STAKING_ADDRESS: "0x1cED6A6253388A56759da72F16D16544577D4dB7",
      STAKING_HELPER_ADDRESS: "0x51d763baa5F18252a6A5CAd441c34d56f3731e96",
      SOHM_ADDRESS: "0x892bca2C0c2C2B244a43289885732a356Fde84cE",
      DISTRIBUTOR_ADDRESS: "0x68896113FCCa7c277e54a76975EEBA06394f5007",
      BONDINGCALC_ADDRESS: "0x3929699b5a68B20D6d6315d02112549638312F1F",
      CIRCULATING_SUPPLY_ADDRESS: "0xE296B1A262b7Ab6395c5609cA5440AE9E0a1E468",
      TREASURY_ADDRESS: "0xB58E41fadf1bebC1089CeEDbbf7e5E5e46dCd9b9",
      DAO_ADDRESS: "0xD4aC626A1F87b5955f78FF86237DB055e62D43a0",
      REDEEM_HELPER_ADDRESS: "0xE827c1D2da22496A09055140c2454c953710751C",
      PT_TOKEN_ADDRESS: "0x0000000000000000000000000000000000000000", // 33T token address, taken from `ticket` function on PRIZE_STRATEGY_ADDRESS
      PT_PRIZE_POOL_ADDRESS: "0x0000000000000000000000000000000000000000", // NEW
      PT_PRIZE_STRATEGY_ADDRESS: "0x0000000000000000000000000000000000000000", // NEW
      MARKET_PRICE_LP_ADDRESS: "0x076B1c0A1f4CA76C1AAB1c3E86cd5110fEec3eCB",
      WSOHM_ADDRESS: "0x2FD0fF45263143DcD616EcADa45c0D22e49aDBB7",
      USDB_ADDRESS: "0xD40f6eDc014b42cF678D7eeF4A1310EEe229C50f",
      USDB_MINTER: "0xc7330002761E52034efDC0cAe69B5Bd20D69aD38",
      FHUD_ADDRESS: "0x18F7f88BE24a1d1d0a4E61B6Ebf564225398adb0",
      DAI_ADDRESS: "0x05db87C4Cbb198717F590AabA613cdD2180483Ce",
      XFHM_ADDRESS: "",
      MASTERCHEF_ADDRESS: "",
      LQDR_ADDRESS: "",
      LQDR_USDB_POL_BOND_DEPOSITORY_ADDRESS: "",
      LQDR_USDB_LP_ADDRESS: "",
      // staking warmup: 0x312DBa92153E931D91c5e75870Dbc62E2DCD21AC
      // staking warmup manager: 0x8D4603d7302f2F962CCf6044A6AC2Dfd812B92bE
      // FHUD Minter: 0xA3b5fE35db679D21af9a499EE88231Ea9B656Cb8
      // mock oracle: 0xB85a387b0DfBFA6BAf834118C5478D9a8D418322
      MERKLE_DISTRIBUTOR: "",
    },
  },
  [NetworkIds.Moonriver]: {
    name: "Moonriver",
    logo: MoonriverIcon,
    isEnabled: false,
    isTestNet: false,
    blocktime: 21.46, // https://moonriver.moonscan.io/chart/blocktime
    epochBlock: 979500,
    epochInterval: 1960,
    blockCountdownUrl: (block) =>
      `https://moonriver.moonscan.io/block/countdown/${block}`,
    getEtherscanUrl: (txnHash) => "https://moonriver.moonscan.io/tx/" + txnHash,
    getEtherscanAddress: (contractAddress) =>
      "https://moonriver.moonscan.io/address/" + contractAddress,
    getPoolTogetherUrls: (contractAddress) => [
      `https://community.pooltogether.com/pools/rinkeby/${contractAddress}/home`,
      `https://community.pooltogether.com/pools/rinkeby/${contractAddress}/manage#stats`,
    ],
    liquidityPoolReserveDecimals: {
      token0Decimals: 6,
      token1Decimals: 9,
    },
    poolGraphUrl: "https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-v3_4_3",
    addresses: {
      OHM_ADDRESS: "0xfa1FBb8Ef55A4855E5688C0eE13aC3f202486286",
      STAKING_ADDRESS: "0xF5C7D63C5Fc0aD4b7Cef7d8904239860725Ebc87",
      STAKING_HELPER_ADDRESS: "0xCD12666f754aCefa1ee5477fA809911bAB915aa0",
      SOHM_ADDRESS: "0x1888BB30f9EdD63b265942F3E3D061F186f38079",
      DISTRIBUTOR_ADDRESS: "0xA3b52d5A6d2f8932a5cD921e09DA840092349D71",
      BONDINGCALC_ADDRESS: "0x71b967717e90E66E2EFa399910d46FF7A6ed2A45",
      CIRCULATING_SUPPLY_ADDRESS: "0x9DC084Fd82860cDb4ED2b2BF59F1076F47B03Bd6",
      TREASURY_ADDRESS: "0x5E983ff70DE345de15DbDCf0529640F14446cDfa",
      REDEEM_HELPER_ADDRESS: "0x64eaB56A4cD1D48EE15263f177529C9B7547D449",
      DAO_ADDRESS: "0xD4aC626A1F87b5955f78FF86237DB055e62D43a0",
      PT_TOKEN_ADDRESS: "0x0000000000000000000000000000000000000000",
      PT_PRIZE_POOL_ADDRESS: "0x0000000000000000000000000000000000000000",
      PT_PRIZE_STRATEGY_ADDRESS: "0x0000000000000000000000000000000000000000",
      BRIDGE_TOKEN_ADDRESS: "0x147DBAE284BBd624b7b5a98Dc862E21e8857446d",
      BRIDGE_ADDRESS: "0xcb9297425C889A7CbBaa5d3DB97bAb4Ea54829c2",
      MARKET_PRICE_LP_ADDRESS: "0x0b6116bb2926d996cdeba9e1a79e44324b0401c9",
      WSOHM_ADDRESS: "0x9051c67790f6ABBF464a023ff6A85D678c20e3CA",
      USDB_ADDRESS: "0x3E193c39626BaFb41eBe8BDd11ec7ccA9b3eC0b2",
      MASTERCHEF_ADDRESS: "",
      XFHM_ADDRESS: "",
      LQDR_ADDRESS: "",
      LQDR_USDB_POL_BOND_DEPOSITORY_ADDRESS: "",
      LQDR_USDB_LP_ADDRESS: "",
      MERKLE_DISTRIBUTOR: "",
    },
  },
  [NetworkIds.MoonbaseAlpha]: {
    name: "Moonbase Alpha",
    logo: MoonBaseAlphaIcon,
    isEnabled: DebugHelper.isActive("enable-testnet"),
    isTestNet: true,
    blocktime: 21.46,
    epochBlock: 979500,
    epochInterval: 1960,
    blockCountdownUrl: (block) => `https://moonbase.moonscan.io/block/countdown/${block}`,
    getEtherscanUrl: (txnHash) => "https://moonbase.moonscan.io/tx/" + txnHash,
    getEtherscanAddress: (contractAddress) =>
      "https://moonbase.moonscan.io/address/" + contractAddress,
    getPoolTogetherUrls: (contractAddress) => [
      `https://community.pooltogether.com/pools/rinkeby/${contractAddress}/home`,
      `https://community.pooltogether.com/pools/rinkeby/${contractAddress}/manage#stats`,
    ],
    liquidityPoolReserveDecimals: {
      token0Decimals: 6,
      token1Decimals: 9,
    },
    poolGraphUrl: "https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-v3_4_3",
    addresses: {
      // KFC's hidden testnet
      // OHM_ADDRESS: "0x29a3f7E3E4925FC576d77b115E4F7327307bf018",
      // STAKING_ADDRESS: "0x1E79020Edb8872bd90fA73781b97862Da6f0D45e",
      // STAKING_HELPER_ADDRESS: "0x0bB56b553cc2Ff6A24aAbD67758D5aE0840AE560",
      // SOHM_ADDRESS: "0xddAec4ac3510a3d38fDDd927217bFAb1cE069060",
      // DISTRIBUTOR_ADDRESS: "0xEb794D088e7DF7360c94993Ba6619420F9d18B0B",
      // BONDINGCALC_ADDRESS: "0x3cd4a4A5c13e93ac354b9Aa1Ac48ba53078Ba5EA",
      // CIRCULATING_SUPPLY_ADDRESS: "0x732a5b7E41F1b1338B5cD5366ee77497a94aEb9B",
      // TREASURY_ADDRESS: "0xcAa0EB441b18976EE4Dc3915c5dFb2124EDC69a4",
      // REDEEM_HELPER_ADDRESS: "0xE0A28434c4093a1D6F820331e4E5DC03cE1C23Bd",

      // pwntron's hidden testnet
      OHM_ADDRESS: "0x471D67Af380f4C903aD74944D08cB00d0D07853a",
      STAKING_ADDRESS: "0xcafBA8D8cc502b3A6Ec9CDB4201F8cAEFC542838",
      STAKING_HELPER_ADDRESS: "0x8984d3edCa588DEa900658095A6de0A2cC93f9aD",
      SOHM_ADDRESS: "0x2575633c713578a99D51317e2424d4CAbfda2cc2",
      DISTRIBUTOR_ADDRESS: "0x0EC3feb9E51E6E9d108B785348bceE05399C71EC",
      BONDINGCALC_ADDRESS: "0xb5c44B5819EB994b18cF2df2302f5e1B12312752",
      CIRCULATING_SUPPLY_ADDRESS: "0xA405d1591BF3c9bFf25135eF8A6Bea10A984529e",
      TREASURY_ADDRESS: "0x6039910e36D1f5823f88006eeaC13d0A486Aa0Bc",
      REDEEM_HELPER_ADDRESS: "0x6f0E8115d0a12D2D4c6DbA358F69110fff7c33e2",
      DAO_ADDRESS: "0x63A77B78A95ae8683ed23a92a563f514796Ca1e0",
      PT_TOKEN_ADDRESS: "0x0000000000000000000000000000000000000000",
      PT_PRIZE_POOL_ADDRESS: "0x0000000000000000000000000000000000000000",
      PT_PRIZE_STRATEGY_ADDRESS: "0x0000000000000000000000000000000000000000",
      MARKET_PRICE_LP_ADDRESS: "0x0000000000000000000000000000000000000000",
      BRIDGE_TOKEN_ADDRESS: "0x652648562f233c95e4e8de417f8e99f4188649ef",
      BRIDGE_ADDRESS: "0x688d514e98bbc32FdCD8Ab2197eFF203A13dD7A1",
      WSOHM_ADDRESS: "0xefa60366a9C414A584375721125a8A42aDb663C0",
      USDB_ADDRESS: "0x0000000000000000000000000000000000000000",
      DAI_ADDRESS: "0xfa1FBb8Ef55A4855E5688C0eE13aC3f202486286",
      MASTERCHEF_ADDRESS: "",
      XFHM_ADDRESS: "",
      LQDR_ADDRESS: "",
      LQDR_USDB_POL_BOND_DEPOSITORY_ADDRESS: "",
      LQDR_USDB_LP_ADDRESS: "",
      MERKLE_DISTRIBUTOR: "",
    },
  },
  [NetworkIds.Rinkeby]: {
    name: "Rinkeby Testnet",
    logo: RinkebyIcon,
    isEnabled: DebugHelper.isActive("enable-testnet"),
    isTestNet: true,
    blocktime: 15.01,
    epochBlock: 10112184,
    epochInterval: 687,
    blockCountdownUrl: (block) => `https://rinkeby.etherscan.io/block/countdown/${block}`,
    getEtherscanUrl: (txnHash) => "https://rinkeby.etherscan.io/tx/" + txnHash,
    getEtherscanAddress: (contractAddress) =>
      "https://rinkeby.etherscan.io/address/" + contractAddress,
    getPoolTogetherUrls: () => [],
    poolGraphUrl: "https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-v3_4_3",
    liquidityPoolReserveDecimals: {
      token0Decimals: 9,
      token1Decimals: 18,
    },
    addresses: {
      OHM_ADDRESS: "0x9DC084Fd82860cDb4ED2b2BF59F1076F47B03Bd6",
      STAKING_ADDRESS: "0xf7595d3D87D976CA011E89Ca6A95e827E31Dd581",
      STAKING_HELPER_ADDRESS: "0xcb9297425C889A7CbBaa5d3DB97bAb4Ea54829c2",
      SOHM_ADDRESS: "0xF5C7D63C5Fc0aD4b7Cef7d8904239860725Ebc87",
      DISTRIBUTOR_ADDRESS: "0xA3b52d5A6d2f8932a5cD921e09DA840092349D71",
      BONDINGCALC_ADDRESS: "0x64eaB56A4cD1D48EE15263f177529C9B7547D449",
      CIRCULATING_SUPPLY_ADDRESS: "0x88162eb8f6347B9Bb31B4A35434E0C0d5CbD5FE6",
      TREASURY_ADDRESS: "0x686AcF5A89d09D936B09e5a5a64Dd6B241CD20c6",
      DAO_ADDRESS: "0xD4aC626A1F87b5955f78FF86237DB055e62D43a0",
      REDEEM_HELPER_ADDRESS: "0xdaE326522C63aad3AeB94be79a0C55e30435d054",
      PT_TOKEN_ADDRESS: "0x0000000000000000000000000000000000000000", // 33T token address, taken from `ticket` function on PRIZE_STRATEGY_ADDRESS
      PT_PRIZE_POOL_ADDRESS: "0x0000000000000000000000000000000000000000", // NEW
      PT_PRIZE_STRATEGY_ADDRESS: "0x0000000000000000000000000000000000000000", // NEW
      MARKET_PRICE_LP_ADDRESS: "0xfb7f259e16ce5c3706dfffd0ab73033f58c6ce21",
      WSOHM_ADDRESS: "0x0bEd9f95b3fEEf5672b10693cF7ed7b78F021793",
      USDB_ADDRESS: "0x334bf069C185b0E5e4DF3B4a15A67ecb905941fa", //old: 0xE827c1D2da22496A09055140c2454c953710751C
      DAI_ADDRESS: "0xfa1FBb8Ef55A4855E5688C0eE13aC3f202486286",
      XFHM_ADDRESS: "0x9597Cc20C59AdB0c9113151Cd1f3B974557c7F87",
      LQDR_ADDRESS: "0xf03b216dfc70008442e6f56ac085c18210b740f5",
      LQDR_USDB_POL_BOND_DEPOSITORY_ADDRESS: "0x4f06EC6079BB6F6B39aF11010d764f1B4747E3eC",
      LQDR_USDB_LP_ADDRESS: "0xF1AF8B78eAB2E33e59a4D487fb9CF9dCCEF65427",
      MASTERCHEF_ADDRESS: "0xa742025b8137b71BEc3A3242cE50A052E1F85D22",
      USDB_DAI_LP_ADDRESS: "0x67B694d556879b8cAC9Ae751209c43c85a1ebD2e",
      USDB_NFT_ADDRESS: "0x23fdfF8f22fCb7CC3Aee6cEab41070e973371ccc",
      WETH_ADDRESS: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
      WBTC_ADDRESS: "0x577D296678535e4903D59A4C929B718e1D575e0A",
      USDC_ADDRESS: "0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b",
      USDT_ADDRESS: "0xeaB17C8E6d2d643d078ef8c7b1A6D8f0021bFB48", //old: 0xD9BA894E0097f8cC2BBc9D24D308b98e36dc6D02
      CRYPTOPUNKS_ADDRESS: "0x4cf4bedB4A260f12d56AE2eD63Eb060bBbc7aF62",
      STAKING_BACKED_NFT_ADDRESS_1: "0xD5e510680710242fbdD6EE9eD680f306eE8305C7",
      STAKING_BACKED_NFT_ADDRESS_2: "0x812BF917981CFCe295965A405cdce7DA522c4a25",
      STAKING_BACKED_NFT_ADDRESS_3: "0xc8bb850404460725A27619029e2DCa475188D748",
      AMPS_ADDRESS: "0xF8F17f3Bb48e27308F13B4d5b3D5a254182800e1",
      BALANCE_VAULT_MANAGER_ADDRESS: "0x95d18604957ed8689dC3aB6BC7E2ABDCaf81A8eE",
      // staking warmup: 0xCD12666f754aCefa1ee5477fA809911bAB915aa0
      // staking warmup manager: 0xeD1f984502f8773Ec950E2D006781D7ce33CEEE4
      // FHUD Minter: 0x139ffDD962A2d8D498a92aB33b31ed78397cbae2
      // twap oracle: 0xc9ca91fe0667bafd4289e082088e41ed86471d79
      MERKLE_DISTRIBUTOR: "0x3418a0561F8c490CCA938efc974eEFb88eaa3445",
      PASS_NFT_ADDRESS: "0x9Da418B0c5B41C1a2a3Bea87187deA99d768BCc6",
    },
    USDB_LENDING_ADDRESSES: [
      "0x388753E39938De4dc37594B2d77Ed2DeB9E36208",
      "0xB9b3865eB9a584B64b85e401A0465b2a851C5F33",
      "0xE55AeCF7A6bD94bdD49C334B8f78Cef31deAF1D4",
    ],
  },
  [NetworkIds.Goerli]: {
    name: "Goerli Testnet",
    logo: RinkebyIcon,
    isEnabled: DebugHelper.isActive("enable-testnet"),
    isTestNet: true,
    blocktime: 15.01,
    epochBlock: 0,
    epochInterval: 0,
    blockCountdownUrl: (block) => `https://goerli.etherscan.io/block/countdown/${block}`,
    getEtherscanUrl: (txnHash) => "https://goerli.etherscan.io/tx/" + txnHash,
    getEtherscanAddress: (contractAddress) =>
      "https://goerli.etherscan.io/address/" + contractAddress,
    getPoolTogetherUrls: () => [],
    poolGraphUrl: "",
    liquidityPoolReserveDecimals: {
      token0Decimals: 9,
      token1Decimals: 18,
    },
    addresses: {
      OHM_ADDRESS: "0x0000000000000000000000000000000000000000",
      STAKING_ADDRESS: "0x0000000000000000000000000000000000000000",
      STAKING_HELPER_ADDRESS: "0x0000000000000000000000000000000000000000",
      SOHM_ADDRESS: "0x0000000000000000000000000000000000000000",
      DISTRIBUTOR_ADDRESS: "0x0000000000000000000000000000000000000000",
      BONDINGCALC_ADDRESS: "0x0000000000000000000000000000000000000000",
      CIRCULATING_SUPPLY_ADDRESS: "0x0000000000000000000000000000000000000000",
      TREASURY_ADDRESS: "0x0000000000000000000000000000000000000000",
      DAO_ADDRESS: "0x3381e86306145b062cEd14790b01AC5384D23D82",
      REDEEM_HELPER_ADDRESS: "0x0000000000000000000000000000000000000000",
      MARKET_PRICE_LP_ADDRESS: "0x0000000000000000000000000000000000000000",
      WSOHM_ADDRESS: "0x0000000000000000000000000000000000000000",
      USDB_ADDRESS: "0x0000000000000000000000000000000000000000", //old: 0xE827c1D2da22496A09055140c2454c953710751C
      DAI_ADDRESS: "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",
      XFHM_ADDRESS: "0x0000000000000000000000000000000000000000",
      LQDR_ADDRESS: "0x0000000000000000000000000000000000000000",
      LQDR_USDB_POL_BOND_DEPOSITORY_ADDRESS: "0x0000000000000000000000000000000000000000",
      LQDR_USDB_LP_ADDRESS: "0x0000000000000000000000000000000000000000",
      MASTERCHEF_ADDRESS: "0x0000000000000000000000000000000000000000",
      USDB_DAI_LP_ADDRESS: "0x0000000000000000000000000000000000000000",
      WETH_ADDRESS: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
      WBTC_ADDRESS: "0xC04B0d3107736C32e19F1c62b2aF67BE61d63a05",
      USDC_ADDRESS: "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C",
      USDT_ADDRESS: "0x0265e9fEA16431C84BF3916276cA64102e19b356", //old: 0xD9BA894E0097f8cC2BBc9D24D308b98e36dc6D02
      CRYPTOPUNKS_ADDRESS: "0x0000000000000000000000000000000000000000",
      MERKLE_DISTRIBUTOR: "0x187Ec6F51CC8EAdb090127505fDC401Ef307408b",
    },
    USDB_LENDING_ADDRESSES: [
      "0x1888BB30f9EdD63b265942F3E3D061F186f38079",
      "0x71828E1A0b634c7A661dFC2B4Ae8486d3a88B15d",
      "0x74f9f75747550fbca6510610450fe91b5ed765fe",
    ],
  },
  [NetworkIds.Ethereum]: {
    name: "Ethereum",
    logo: EthereumIcon,
    isEnabled: true,
    isTestNet: false,
    blocktime: 14,
    epochBlock: 10112184,
    epochInterval: 687,
    blockCountdownUrl: (block) => `https://etherscan.io/block/countdown/${block}`,
    getEtherscanUrl: (txnHash) => "https://etherscan.io/tx/" + txnHash,
    getEtherscanAddress: (contractAddress) =>
      "https://etherscan.io/address/" + contractAddress,
    getPoolTogetherUrls: () => [],
    poolGraphUrl: "https://api.thegraph.com/subgraphs/name/pooltogether/ethereum-v3_4_3",
    liquidityPoolReserveDecimals: {
      token0Decimals: 9,
      token1Decimals: 18,
    },
    addresses: {
      OHM_ADDRESS: "0xCf382C202F0FEe5Aee5d7380de45f4a426e38721",
      STAKING_ADDRESS: "0x0000000000000000000000000000000000000000",
      STAKING_HELPER_ADDRESS: "0x0000000000000000000000000000000000000000",
      SOHM_ADDRESS: "0x0000000000000000000000000000000000000000",
      DISTRIBUTOR_ADDRESS: "0x0000000000000000000000000000000000000000",
      BONDINGCALC_ADDRESS: "0x0000000000000000000000000000000000000000",
      CIRCULATING_SUPPLY_ADDRESS: "0x0000000000000000000000000000000000000000",
      TREASURY_ADDRESS: "0x9042E869BedCD2BB3EEa241aC0032cadAE8DF006",
      DAO_ADDRESS: "0x0000000000000000000000000000000000000000",
      REDEEM_HELPER_ADDRESS: "0x0000000000000000000000000000000000000000",
      PT_TOKEN_ADDRESS: "0x0000000000000000000000000000000000000000",
      PT_PRIZE_POOL_ADDRESS: "0x0000000000000000000000000000000000000000",
      PT_PRIZE_STRATEGY_ADDRESS: "0x0000000000000000000000000000000000000000",
      MARKET_PRICE_LP_ADDRESS: "0x0000000000000000000000000000000000000000",
      WSOHM_ADDRESS: "0x0000000000000000000000000000000000000000",
      USDT_ADDRESS: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      USDB_ADDRESS: "0x02B5453D92B730F29a86A0D5ef6e930c4Cf8860B",
      DAI_ADDRESS: "0x6b175474e89094c44da98b954eedeac495271d0f",
      WETH_ADDRESS: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      WBTC_ADDRESS: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
      USDC_ADDRESS: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      CRYPTOPUNKS_ADDRESS: "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb",
      USDB_LENDING_ADDRESS: "0x6685691e0370d9b6FC70421D7a64071Ed1E2fb2f",
      USDB_LENDING_ADDRESS_V2: "0x9e05F7408AE8132D9CA2bab641423ffEfAAA43f9",
      XFHM_ADDRESS: "",
      MASTERCHEF_ADDRESS: "",
      MERKLE_DISTRIBUTOR: "",
      PASS_NFT_ADDRESS: "0x3707CFddaE348F05bAEFD42406ffBa4B74Ec8D91",
    },
    USDB_LENDING_ADDRESSES: [
      "0x6685691e0370d9b6FC70421D7a64071Ed1E2fb2f",
      "0x9e05F7408AE8132D9CA2bab641423ffEfAAA43f9",
      "0xc001160D7e90e8534Aa6d719d20F0E5425c25B40",
      "0x3b566779ad1D85928DD8af235bDE0c00049CFB9A",
    ],
  },
  [NetworkIds.Bsc]: {
    name: "BSC",
    logo: BscIcon,
    isEnabled: false,
    isTestNet: false,
    blocktime: 3,
    epochBlock: 10112184,
    epochInterval: 687,
    blockCountdownUrl: (block) => `https://bscscan.io/block/countdown/${block}`,
    getEtherscanUrl: (txnHash) => "https://bscscan.io/tx/" + txnHash,
    getEtherscanAddress: (contractAddress) =>
      "https://bscscan.io/address/" + contractAddress,
    getPoolTogetherUrls: () => [],
    poolGraphUrl: "https://api.thegraph.com/subgraphs/name/pooltogether/bsc-v3_4_3",
    liquidityPoolReserveDecimals: {
      token0Decimals: 9,
      token1Decimals: 18,
    },
    addresses: {
      OHM_ADDRESS: "0x0000000000000000000000000000000000000000",
      STAKING_ADDRESS: "0x0000000000000000000000000000000000000000",
      STAKING_HELPER_ADDRESS: "0x0000000000000000000000000000000000000000",
      SOHM_ADDRESS: "0x0000000000000000000000000000000000000000",
      DISTRIBUTOR_ADDRESS: "0x0000000000000000000000000000000000000000",
      BONDINGCALC_ADDRESS: "0x0000000000000000000000000000000000000000",
      CIRCULATING_SUPPLY_ADDRESS: "0x0000000000000000000000000000000000000000",
      TREASURY_ADDRESS: "0x0000000000000000000000000000000000000000",
      DAO_ADDRESS: "0x0000000000000000000000000000000000000000",
      REDEEM_HELPER_ADDRESS: "0x0000000000000000000000000000000000000000",
      PT_TOKEN_ADDRESS: "0x0000000000000000000000000000000000000000",
      PT_PRIZE_POOL_ADDRESS: "0x0000000000000000000000000000000000000000",
      PT_PRIZE_STRATEGY_ADDRESS: "0x0000000000000000000000000000000000000000",
      MARKET_PRICE_LP_ADDRESS: "0x0000000000000000000000000000000000000000",
      WSOHM_ADDRESS: "0x0000000000000000000000000000000000000000",
      FHUD_ADDRESS: "0x0000000000000000000000000000000000000000",
      USDT_ADDRESS: "0x55d398326f99059ff775485246999027b3197955",
      DAI_ADDRESS: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
      MERKLE_DISTRIBUTOR: "",
    },
  },
};

export const enabledNetworkIds: NetworkId[] = Object.keys(networks)
  .map((networkID) => parseInt(networkID))
  .filter((networkID) => networks[networkID].isEnabled);
export const enabledNetworkIdsExceptBscAndEth: NetworkId[] = Object.keys(networks)
  .map((networkID) => parseInt(networkID))
  .filter(
    (networkID) =>
      networks[networkID].isEnabled &&
      networkID !== NetworkIds.Bsc &&
      networkID !== NetworkIds.Ethereum
  );
export const enabledMainNetworkIds: NetworkId[] = enabledNetworkIds.filter(
  (networkID) => !networks[networkID].isTestNet
);
