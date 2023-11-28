import { StableBond, BondType, PaymentToken } from "../lib/bond";
import { NetworkIds } from "../networks";

import {
  singleSidedLPBondDepositoryAbi,
  tradFiBondDepositoryAbi,
  lqdrUsdbPolBondDepositoryAbi,
  usdbABondDepositoryAbi,
  usdbFhmBurnBondDepositoryAbi,
  usdbNftBondDepositoryAbi,
  stakingBackedNFTPool,
  passNFTAbi,
} from "../abi";

// // TODO(zx): Further modularize by splitting up reserveAssets into vendor token definitions
// //   and include that in the definition of a bond

export const TRADFI_3M = "tradfi3month";

export const tradfi3month = new StableBond({
  name: TRADFI_3M,
  type: BondType.TRADFI,
  displayName: "TradFi 3 Month",
  bondToken: "tradfi3month",
  decimals: 18,
  apr: 20,
  apy: 21.55,
  roi: 5,
  days: 90,
  isAvailable: {
    [NetworkIds.Ethereum]: true,
    [NetworkIds.FantomOpera]: true,
    [NetworkIds.Rinkeby]: true,
  },
  isPurchasable: true,
  bondIconSvg: null,
  bondContractABI: tradFiBondDepositoryAbi,
  paymentToken: PaymentToken.USDB,
  networkAddrs: {
    [NetworkIds.Ethereum]: {
      bondAddress: "0xCD8A46dC7EE4488b441Ae1CD3b5BCa48d5389C12",
      reserveAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    [NetworkIds.FantomOpera]: {
      bondAddress: "0xEFbe7fe9E8b407a3F0C0451E7669E70cDD0C4C77",
      reserveAddress: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
    },
    [NetworkIds.Rinkeby]: {
      bondAddress: "0xd7686f04D8c72054Bbc934ED951C919A87833C49",
      reserveAddress: "0xfa1FBb8Ef55A4855E5688C0eE13aC3f202486286",
    },
  },
});

export const tradfi6month = new StableBond({
  name: "tradfi6month",
  type: BondType.TRADFI,
  displayName: "TradFi 6 Month",
  bondToken: "tradfi6month",
  decimals: 18,
  apr: 30,
  apy: 32.25,
  roi: 15,
  days: 180,
  isAvailable: {
    [NetworkIds.Ethereum]: true,
    [NetworkIds.FantomOpera]: true,
    [NetworkIds.Rinkeby]: true,
  },
  isPurchasable: true,
  bondIconSvg: null,
  bondContractABI: tradFiBondDepositoryAbi,
  paymentToken: PaymentToken.USDB,
  networkAddrs: {
    [NetworkIds.Ethereum]: {
      bondAddress: "0xD9fDd86ecc03e34DAf9c645C40DF670406836816",
      reserveAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    [NetworkIds.FantomOpera]: {
      bondAddress: "0xB1c77436BC180009709Be00C9e852246476321A3",
      reserveAddress: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
    },
    [NetworkIds.Rinkeby]: {
      bondAddress: "0xD3e73Cc8C42dAfAB204d1F2ef3C7b853AaF0B094",
      reserveAddress: "0xfa1FBb8Ef55A4855E5688C0eE13aC3f202486286",
    },
  },
});

export const singleSidedV1 = new StableBond({
  name: "singleSidedV1",
  type: BondType.SINGLE_SIDED_V1,
  displayName: "Staking v1",
  bondToken: "singleSided",
  decimals: 18,
  apr: 0,
  roi: 20,
  days: 0,
  isAvailable: { [NetworkIds.FantomOpera]: true, [NetworkIds.Rinkeby]: true },
  isPurchasable: true,
  bondIconSvg: null,
  bondContractABI: singleSidedLPBondDepositoryAbi,
  paymentToken: PaymentToken.FHM,
  networkAddrs: {
    [NetworkIds.FantomOpera]: {
      bondAddress: "0x9D2141a3BfDbe0f9a948B993f9a70B5f9C9D17f9",
      reserveAddress: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
    },
    [NetworkIds.Rinkeby]: {
      bondAddress: "0xC2B356342D191E2E068B3c9876Fc0440b4d5Ed25", // special version if activate IL redeem
      reserveAddress: "0xfa1FBb8Ef55A4855E5688C0eE13aC3f202486286",
    },
  },
});

export const singleSided = new StableBond({
  name: "singleSided",
  type: BondType.SINGLE_SIDED,
  displayName: "Staking",
  bondToken: "singleSided",
  decimals: 18,
  apr: 0,
  roi: 20,
  days: 0,
  isAvailable: { [NetworkIds.FantomOpera]: true, [NetworkIds.Rinkeby]: true },
  isPurchasable: true,
  bondIconSvg: null,
  bondContractABI: singleSidedLPBondDepositoryAbi,
  paymentToken: PaymentToken.FHM,
  networkAddrs: {
    [NetworkIds.FantomOpera]: {
      bondAddress: "0x78b0d7B61EBB1f6073cD66ED3A347a7E9debD836",
      reserveAddress: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
      // bondAddress: "0x6F3D5858BBC95553DfEeFda4886Ea20E933535fA",
      // bondAddress: "0xbA28476fc4EdAd909fA13A7048Ef432311B4680c",
    },
    [NetworkIds.Rinkeby]: {
      bondAddress: "0x55b6f354416cc599C01E1c928BE8086497C4D999", // special version if activate IL redeem
      reserveAddress: "0xfa1FBb8Ef55A4855E5688C0eE13aC3f202486286",
      // bondAddress: "0xC2B356342D191E2E068B3c9876Fc0440b4d5Ed25",
      // bondAddress: "0xc7330002761E52034efDC0cAe69B5Bd20D69aD38",
      // bondAddress: "0xf801D0dF7fe678aa6C69b3D3d787e84C02A3BD31",
      // bondAddress: "0x6343A974Aa8d979ce1BA0a3eBC9B094Fe69dD639",
      // bondAddress: "0x8D36B8484459753a346e4274821EdBC6DeA39F3f",
      // bondAddress: "0x98B853A6310EB136532E2B99f327b16F8730a978",
      // bondAddress: "0x49a14bDD5b232F727C147d94976680671D9c5B53",
    },
  },
});

export const lqdrUsdbPol = new StableBond({
  name: "lqdrUsdbPol",
  type: BondType.LQDR_USDB_POL,
  displayName: "LQDR USDB Pol",
  bondToken: "lqdrUsdbPol",
  decimals: 18,
  apr: 0,
  roi: 0,
  days: 0,
  isAvailable: { [NetworkIds.Rinkeby]: true },
  isPurchasable: true,
  bondIconSvg: null,
  bondContractABI: lqdrUsdbPolBondDepositoryAbi,
  networkAddrs: {
    [NetworkIds.Rinkeby]: {
      bondAddress: "0x4f06EC6079BB6F6B39aF11010d764f1B4747E3eC",
      reserveAddress: "0xf03b216dfc70008442e6f56ac085c18210b740f5",
    },
  },
});

export const usdbFhmBurn = new StableBond({
  apr: 0,
  days: 0,
  name: "usdbFhmBurn",
  type: BondType.BOND_USDB,
  displayName: "FHM ➜ USDB",
  bondToken: "FHM",
  decimals: 9,
  bondIconSvg: undefined,
  roi: 0,
  isAvailable: { [NetworkIds.FantomOpera]: true, [NetworkIds.FantomTestnet]: true },
  isPurchasable: true,
  bondContractABI: usdbFhmBurnBondDepositoryAbi,
  paymentToken: PaymentToken.USDB,
  networkAddrs: {
    [NetworkIds.FantomOpera]: {
      bondAddress: "0x5ba97cAD8Eb46EFeEd70FD4f9463fBB5E68A4Bf3",
      reserveAddress: "0xfa1FBb8Ef55A4855E5688C0eE13aC3f202486286",
    },
    [NetworkIds.FantomTestnet]: {
      bondAddress: "0xA1DFDc1d9dA00aaE194871C3fb2bF572EB1cC53e",
      reserveAddress: "0x4B209fd2826e6880e9605DCAF5F8dB0C2296D6d2",
    },
  },
});

export const usdbBuy = new StableBond({
  apr: 0,
  days: 0,
  name: "usdbBuy",
  type: BondType.BOND_USDB,
  displayName: "DAI ➜ USDB",
  bondToken: "DAI",
  decimals: 18,
  isAvailable: {
    [NetworkIds.FantomOpera]: true,
    [NetworkIds.FantomTestnet]: true,
    [NetworkIds.Rinkeby]: true,
  },
  isPurchasable: true,
  bondIconSvg: undefined,
  bondContractABI: usdbABondDepositoryAbi,
  paymentToken: PaymentToken.USDB,
  roi: 0,
  networkAddrs: {
    [NetworkIds.FantomOpera]: {
      bondAddress: "0x299f15b527fdBf76A7CA6087a521e60c18F80529",
      reserveAddress: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
    },
    [NetworkIds.FantomTestnet]: {
      bondAddress: "0xA73e67e87a0479e9bB75e6d2451aE904DA135Cbd",
      reserveAddress: "0x05db87C4Cbb198717F590AabA613cdD2180483Ce",
    },
    [NetworkIds.Rinkeby]: {
      bondAddress: "0x3C37c5195839cEf16262f2Ed57d4c1F54c630d16",
      reserveAddress: "0xfa1FBb8Ef55A4855E5688C0eE13aC3f202486286",
    },
  },
});

export const usdbNft180 = new StableBond({
  apr: 0,
  days: 180,
  name: "usdbNft",
  type: BondType.USDB_NFT,
  displayName: "USDB ➜ NFT 180d",
  bondToken: "USDB",
  decimals: 18,
  isAvailable: {
    [NetworkIds.FantomOpera]: true,
    [NetworkIds.FantomTestnet]: true,
    [NetworkIds.Rinkeby]: true,
  },
  isPurchasable: true,
  bondIconSvg: undefined,
  bondContractABI: usdbNftBondDepositoryAbi,
  paymentToken: PaymentToken.USDB,
  roi: 0,
  networkAddrs: {
    [NetworkIds.FantomOpera]: {
      bondAddress: "",
      reserveAddress: "0x6Fc9383486c163fA48becdEC79d6058f984f62cA",
    },
    [NetworkIds.FantomTestnet]: {
      bondAddress: "",
      reserveAddress: "0xD40f6eDc014b42cF678D7eeF4A1310EEe229C50f",
    },
    [NetworkIds.Rinkeby]: {
      bondAddress: "0x46B00259869f47809340BBba01d42F44162A8742",
      reserveAddress: "0xE827c1D2da22496A09055140c2454c953710751C",
    },
  },
});

export const passNFTMint = new StableBond({
  apr: 0,
  days: 0,
  name: "passNFTmint",
  type: BondType.PASS_NFT,
  displayName: "PASSNFT",
  bondToken: "DAI",
  decimals: 18,
  isAvailable: {
    [NetworkIds.Ethereum]: true,
    [NetworkIds.Rinkeby]: true,
    [NetworkIds.FantomOpera]: true,
  },
  isPurchasable: true,
  bondIconSvg: undefined,
  bondContractABI: passNFTAbi,
  paymentToken: PaymentToken.USDB,
  roi: 0,
  networkAddrs: {
    [NetworkIds.Ethereum]: {
      bondAddress: "0x2fd0ff45263143dcd616ecada45c0d22e49adbb7",
      reserveAddress: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
    },
    [NetworkIds.Rinkeby]: {
      bondAddress: "0x607e2D68bc2664BF9Ab2c065ae9F65Da4bf55905",
      reserveAddress: "0xfa1FBb8Ef55A4855E5688C0eE13aC3f202486286",
    },
    [NetworkIds.FantomOpera]: {
      bondAddress: "0x2fd0ff45263143dcd616ecada45c0d22e49adbb7",
      reserveAddress: "0xfa1FBb8Ef55A4855E5688C0eE13aC3f202486286",
    },
  },
});
export const usdbNft360 = new StableBond({
  apr: 0,
  days: 360,
  name: "usdbNft",
  type: BondType.USDB_NFT,
  displayName: "USDB ➜ NFT 360d",
  bondToken: "USDB",
  decimals: 18,
  isAvailable: {
    [NetworkIds.FantomOpera]: true,
    [NetworkIds.FantomTestnet]: true,
    [NetworkIds.Rinkeby]: true,
  },
  isPurchasable: true,
  bondIconSvg: undefined,
  bondContractABI: usdbNftBondDepositoryAbi,
  paymentToken: PaymentToken.USDB,
  roi: 0,
  networkAddrs: {
    [NetworkIds.FantomOpera]: {
      bondAddress: "",
      reserveAddress: "0x6Fc9383486c163fA48becdEC79d6058f984f62cA",
    },
    [NetworkIds.FantomTestnet]: {
      bondAddress: "",
      reserveAddress: "0xD40f6eDc014b42cF678D7eeF4A1310EEe229C50f",
    },
    [NetworkIds.Rinkeby]: {
      bondAddress: "0x46B00259869f47809340BBba01d42F44162A8742",
      reserveAddress: "0xE827c1D2da22496A09055140c2454c953710751C",
    },
  },
});

export const usdbNft720 = new StableBond({
  apr: 0,
  days: 720,
  name: "usdbNft",
  type: BondType.USDB_NFT,
  displayName: "USDB ➜ NFT 720d",
  bondToken: "USDB",
  decimals: 18,
  isAvailable: {
    [NetworkIds.FantomOpera]: true,
    [NetworkIds.FantomTestnet]: true,
    [NetworkIds.Rinkeby]: true,
  },
  isPurchasable: true,
  bondIconSvg: undefined,
  bondContractABI: usdbNftBondDepositoryAbi,
  paymentToken: PaymentToken.USDB,
  roi: 0,
  networkAddrs: {
    [NetworkIds.FantomOpera]: {
      bondAddress: "",
      reserveAddress: "0x6Fc9383486c163fA48becdEC79d6058f984f62cA",
    },
    [NetworkIds.FantomTestnet]: {
      bondAddress: "",
      reserveAddress: "0xD40f6eDc014b42cF678D7eeF4A1310EEe229C50f",
    },
    [NetworkIds.Rinkeby]: {
      bondAddress: "0x46B00259869f47809340BBba01d42F44162A8742",
      reserveAddress: "0xE827c1D2da22496A09055140c2454c953710751C",
    },
  },
});

export const stakeNftPool1 = new StableBond({
  apr: 0,
  days: 1,
  name: "stakeNft",
  type: BondType.STAKE_NFT,
  displayName: "STAKE ➜ NFT 1",
  bondToken: "NFT",
  decimals: 18,
  isAvailable: {
    [NetworkIds.FantomOpera]: true,
    [NetworkIds.FantomTestnet]: true,
    [NetworkIds.Rinkeby]: true,
  },
  isPurchasable: true,
  bondIconSvg: undefined,
  bondContractABI: stakingBackedNFTPool,
  paymentToken: PaymentToken.USDB,
  roi: 0,
  networkAddrs: {
    [NetworkIds.FantomOpera]: {
      bondAddress: "",
      reserveAddress: "0x6Fc9383486c163fA48becdEC79d6058f984f62cA",
    },
    [NetworkIds.FantomTestnet]: {
      bondAddress: "",
      reserveAddress: "0xD40f6eDc014b42cF678D7eeF4A1310EEe229C50f",
    },
    [NetworkIds.Rinkeby]: {
      bondAddress: "0xD5e510680710242fbdD6EE9eD680f306eE8305C7",
      reserveAddress: "0x23fdfF8f22fCb7CC3Aee6cEab41070e973371ccc",
    },
  },
});

export const stakeNftPool2 = new StableBond({
  apr: 0,
  days: 2,
  name: "stakeNft",
  type: BondType.STAKE_NFT,
  displayName: "STAKE ➜ NFT 2",
  bondToken: "NFT",
  decimals: 18,
  isAvailable: {
    [NetworkIds.FantomOpera]: true,
    [NetworkIds.FantomTestnet]: true,
    [NetworkIds.Rinkeby]: true,
  },
  isPurchasable: true,
  bondIconSvg: undefined,
  bondContractABI: stakingBackedNFTPool,
  paymentToken: PaymentToken.USDB,
  roi: 0,
  networkAddrs: {
    [NetworkIds.FantomOpera]: {
      bondAddress: "",
      reserveAddress: "0x6Fc9383486c163fA48becdEC79d6058f984f62cA",
    },
    [NetworkIds.FantomTestnet]: {
      bondAddress: "",
      reserveAddress: "0xD40f6eDc014b42cF678D7eeF4A1310EEe229C50f",
    },
    [NetworkIds.Rinkeby]: {
      bondAddress: "0x812BF917981CFCe295965A405cdce7DA522c4a25",
      reserveAddress: "0x23fdfF8f22fCb7CC3Aee6cEab41070e973371ccc",
    },
  },
});

export const stakeNftPool3 = new StableBond({
  apr: 0,
  days: 3,
  name: "stakeNft",
  type: BondType.STAKE_NFT,
  displayName: "STAKE ➜ NFT 3",
  bondToken: "NFT",
  decimals: 18,
  isAvailable: {
    [NetworkIds.FantomOpera]: true,
    [NetworkIds.FantomTestnet]: true,
    [NetworkIds.Rinkeby]: true,
  },
  isPurchasable: true,
  bondIconSvg: undefined,
  bondContractABI: stakingBackedNFTPool,
  paymentToken: PaymentToken.USDB,
  roi: 0,
  networkAddrs: {
    [NetworkIds.FantomOpera]: {
      bondAddress: "",
      reserveAddress: "0x6Fc9383486c163fA48becdEC79d6058f984f62cA",
    },
    [NetworkIds.FantomTestnet]: {
      bondAddress: "",
      reserveAddress: "0xD40f6eDc014b42cF678D7eeF4A1310EEe229C50f",
    },
    [NetworkIds.Rinkeby]: {
      bondAddress: "0xc8bb850404460725A27619029e2DCa475188D748",
      reserveAddress: "0x23fdfF8f22fCb7CC3Aee6cEab41070e973371ccc",
    },
  },
});

// HOW TO ADD A NEW BOND:
// Is it a stableCoin bond? use `new StableBond`
// Is it an LP Bond? use `new LPBond`
// Add new bonds to this array!!
export const allBonds = [
  /// 1,1 stablecoin bonds
  // FTM
  tradfi3month,
  tradfi6month,
  singleSided,
  singleSidedV1,
  lqdrUsdbPol,
  usdbFhmBurn,
  usdbBuy,
  usdbNft180,
  usdbNft360,
  usdbNft720,
  stakeNftPool1,
  stakeNftPool2,
  stakeNftPool3,
  passNFTMint,
];
export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond };
}, {});

// Debug Log
// console.log(allBondsMap);
export default allBonds;
