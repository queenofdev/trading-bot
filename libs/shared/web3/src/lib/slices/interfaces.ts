import { JsonRpcProvider } from "@ethersproject/providers";
import { NetworkId } from "../networks";
import { Investment } from "../lib/investment";
import { Bond } from "../lib/bond";
import { AssetToken } from "../helpers/asset-tokens";
import { BigNumber } from "ethers";

export interface IJsonRPCError {
  readonly message: string;
  readonly code: number;
}

export interface IBaseAsyncThunk {
  readonly networkId: NetworkId;
}

export interface IInteractiveAsyncThunk {
  readonly provider: JsonRpcProvider;
}

export interface IChangeApprovalAsyncThunk
  extends IBaseAsyncThunk,
  IInteractiveAsyncThunk {
  readonly token: string;
  readonly address: string;
}

export interface IActionAsyncThunk extends IBaseAsyncThunk, IInteractiveAsyncThunk {
  readonly action: string;
  readonly address: string;
}

export interface IValueAsyncThunk extends IBaseAsyncThunk {
  readonly value: string;
  readonly address: string;
}

export interface IActionValueAsyncThunk extends IValueAsyncThunk, IInteractiveAsyncThunk {
  readonly action: string;
}

export interface IBaseAddressAsyncThunk extends IBaseAsyncThunk {
  readonly address: string;
}

// Account Slice

export interface ICalcUserBondDetailsAsyncThunk
  extends IBaseAddressAsyncThunk,
  IBaseBondAsyncThunk { }
export interface ICalcAllUserBondDetailsAsyncThunk
  extends IBaseAddressAsyncThunk,
  IBaseAllBondsAsyncThunk { }

// Bond Slice

export interface IBaseBondAsyncThunk extends IBaseAsyncThunk {
  readonly bond: Bond;
}

// Xfhm Slice

export interface IXfhmChangeApprovalAsyncThunk
  extends IBaseAddressAsyncThunk,
  IInteractiveAsyncThunk {
  readonly address: string;
  readonly token: string;
}

export interface IXfhmClaimAsyncThunk
  extends IBaseAddressAsyncThunk,
  IInteractiveAsyncThunk {
  readonly address: string;
}

export interface IXfhmActionValueAsyncThunk
  extends IBaseAddressAsyncThunk,
  IInteractiveAsyncThunk {
  readonly value: string;
  readonly action: string;
}

export interface IXfhmValueAsyncThunk
  extends IBaseAddressAsyncThunk,
  IInteractiveAsyncThunk {
  readonly value: string;
}

export interface IXfhmAddLiquidityAsyncThunk
  extends IBaseAddressAsyncThunk,
  IInteractiveAsyncThunk {
  readonly value: string;
  readonly token: AssetToken;
}

export interface IApproveBondAsyncThunk
  extends IBaseBondAsyncThunk,
  IInteractiveAsyncThunk {
  readonly address: string;
}

export interface IVaultDepositAsyncThunk extends IBaseAsyncThunk, IInteractiveAsyncThunk {
  readonly address: string;
  readonly vaultId: string;
  readonly amount: BigNumber;
  readonly token: string;
}

export interface IVaultWithdrawAsyncThunk
  extends IBaseAsyncThunk,
  IInteractiveAsyncThunk {
  readonly address: string;
  readonly vaultId: string;
}

export interface IVaultRoiAsyncThunk extends IInteractiveAsyncThunk {
  readonly vaultId: string;
  readonly amount: BigNumber;
}

export interface IVaultRedeemAsyncThunk extends IInteractiveAsyncThunk {
  readonly vaultId: string;
  readonly address: string;
}

export interface IVaultMaxDepositAsyncThunk extends IInteractiveAsyncThunk {
  readonly vaultId: string;
}

export interface IVaultGetRedeemStatusAsyncThunk extends IInteractiveAsyncThunk {
  readonly nftAddress: string;
}

export interface ICalcBondDetailsAsyncThunk extends IBaseBondAsyncThunk {
  readonly value: string;
}

export interface ICalcInvestmentDetailsAsyncThunk {
  readonly investment: Investment;
}

export interface ICalcTokenPriceAsyncThunk {
  readonly investment: Investment;
}

export interface IBaseAllBondsAsyncThunk {
  readonly allBonds: Bond[];
}

export interface IBondAssetAsyncThunk
  extends IBaseBondAsyncThunk,
  IValueAsyncThunk,
  IInteractiveAsyncThunk {
  readonly slippage: number;
}

export interface IRedeemBondAsyncThunk
  extends IBaseBondAsyncThunk,
  IInteractiveAsyncThunk {
  readonly address: string;
  readonly autostake: boolean;
}

export interface IRedeemSingleSidedBondAsyncThunk
  extends IBaseBondAsyncThunk,
  IInteractiveAsyncThunk {
  readonly address: string;
  readonly value: string;
}

export interface IRedeemAllBondsAsyncThunk
  extends IBaseAsyncThunk,
  IInteractiveAsyncThunk {
  readonly bonds: Bond[];
  readonly address: string;
  readonly autostake: boolean;
}

export interface ICancelBondAsyncThunk extends IBaseAsyncThunk, IInteractiveAsyncThunk {
  readonly bond: Bond;
  readonly index: number;
  readonly address: string;
}

export interface IWrapDetails extends IBaseAsyncThunk {
  isWrap: boolean;
  value: string;
}

export interface SignerAsyncThunk
  extends IBaseAddressAsyncThunk,
  IInteractiveAsyncThunk { }

export interface IInvestUsdbNftBondAsyncThunk
  extends IBaseBondAsyncThunk,
  IInteractiveAsyncThunk {
  readonly address: string;
  readonly value: string;
  readonly tokenId?: number;
  readonly navigate?: any;
}

export interface IUsdbNftListAsyncThunk extends IBaseAsyncThunk {
  readonly address: string;
  readonly networkId: NetworkId;
  readonly callback: any;
}
export interface IUsdbNftInfoAsyncThunk extends IBaseAsyncThunk {
  readonly id: number;
  readonly callback: any;
}

export interface IUsdbNftRedeemAsyncThunk extends IBaseAsyncThunk {
  readonly nftId: number;
  readonly address: string;
  readonly provider: JsonRpcProvider;
}

export interface IStakingBackedNftAsyncThunk extends IBaseAsyncThunk {
  readonly nftId?: number;
  readonly type: number;
  readonly address: string;
  readonly provider: JsonRpcProvider;
  readonly callback?: any;
  readonly bond: Bond;
}

export interface IApprovePoolAsyncThunk
  extends IBaseBondAsyncThunk,
  IInteractiveAsyncThunk {
  readonly nftId: number;
  readonly address: string;
  readonly callback?: any;
}

export interface IAmpsRedeemNftAsyncThunk
  extends IBaseBondAsyncThunk,
  IInteractiveAsyncThunk {
  readonly type: number;
  readonly bond: Bond;
  readonly method: string;
  readonly address: string;
  readonly callback?: any;
}

// wallet
export type AssetLocAsyncThunk = {
  networkId: number;
  provider: JsonRpcProvider;
  walletAddress: string;
  assetAddress: string;
  tokenId: string;
};

export type AssetAddressAsyncThunk = {
  assetAddress: string;
};

export type InteractiveErc20AsyncThunk = AssetAddressAsyncThunk &
  IBaseAsyncThunk &
  IInteractiveAsyncThunk;

export type InteractiveWalletErc20AsyncThunk = {
  walletAddress: string;
  lendingContractAddress?: string;
} & InteractiveErc20AsyncThunk;

export type Erc20AllowanceAsyncThunk = {
  amount: BigNumber;
  lendingContractAddress?: string;
} & InteractiveWalletErc20AsyncThunk;

export interface IMintNFTAsyncThunk extends IBaseAsyncThunk {
  readonly address: string;
  readonly provider: JsonRpcProvider;
  readonly bond: Bond;
  readonly proof1: string[];
  readonly proof2: string[];
}

export type BalanceVaultManagerAsyncThunk = {
  readonly networkId: number;
  readonly provider: JsonRpcProvider;
  readonly skip: string;
  readonly limit: string;
  readonly callback?: any;
};
export type BalanceVaultLengthAsyncThunk = {
  readonly networkId: number;
  readonly provider: JsonRpcProvider;
  readonly callback?: any;
};
