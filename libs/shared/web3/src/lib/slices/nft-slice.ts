import { createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { ampsToken, stakingBackedNFTPool, usdbNftAbi } from "../abi";
import { addresses } from "../constants";
import { getBalances } from "./account-slice";
import {
  IAmpsRedeemNftAsyncThunk,
  IApprovePoolAsyncThunk,
  IStakingBackedNftAsyncThunk,
} from "./interfaces";
import { error, info } from "./messages-slice";
import { clearPendingTxn, fetchPendingTxns } from "./pending-txns-slice";

export const getStakedInfo = createAsyncThunk(
  "account/getStakedInfo",
  async (
    { type, address, networkId, provider, callback }: IStakingBackedNftAsyncThunk,
    { dispatch }
  ) => {
    if (!networkId) {
      return null;
    }
    const stakingNftPoolContract = new ethers.Contract(
      addresses[networkId][`STAKING_BACKED_NFT_ADDRESS_${type}`] as string,
      stakingBackedNFTPool,
      provider
    );
    try {
      const isStaked = await stakingNftPoolContract["_stakedInfo"](address);
      callback && callback(isStaked);
    } catch (e) {
      //
    }

    return null;
  }
);

export const getStakingInfo = createAsyncThunk(
  "account/getStakingInfo",
  async (
    { type, address, networkId, provider, callback }: IStakingBackedNftAsyncThunk,
    { dispatch }
  ) => {
    if (!networkId) {
      return null;
    }
    const stakingNftPoolContract = new ethers.Contract(
      addresses[networkId][`STAKING_BACKED_NFT_ADDRESS_${type}`] as string,
      stakingBackedNFTPool,
      provider
    );
    try {
      const stakingInfo = await stakingNftPoolContract["_stakingInfo"](address);
      let { tokenId, vestingSeconds, lastTimestamp } = stakingInfo;

      const latestBlockNumber = await provider.getBlockNumber();
      const getLatestBlock = async (): Promise<ethers.providers.Block> => {
        let block = undefined;
        block = await provider.getBlock(latestBlockNumber);
        if (block) {
          return block;
        } else {
          //console.log("~~~~~RETRYING GETLATESTBLOCK~~~~~");
          await new Promise((r) => setTimeout(r, 500));
          return getLatestBlock();
        }
      };
      const latestBlock = await getLatestBlock();
      const latestBlockTimestamp = latestBlock.timestamp;

      tokenId = Number(tokenId);
      vestingSeconds = Number(vestingSeconds);
      lastTimestamp = Number(lastTimestamp);
      const remainPercent = (latestBlockTimestamp - lastTimestamp) / vestingSeconds;

      callback && callback({ tokenId, remainPercent });
    } catch (e) {
      callback && callback(Number(-1));
    }

    return null;
  }
);

export const stakeNft = createAsyncThunk(
  "account/stakeNft",
  async (
    {
      nftId,
      type,
      address,
      networkId,
      bond,
      provider,
      callback,
    }: IStakingBackedNftAsyncThunk,
    { dispatch }
  ) => {
    if (!networkId || !bond) {
      return null;
    }
    let stakeTx;
    try {
      const signer = provider.getSigner(address);
      const stakingNftPoolContract = new ethers.Contract(
        addresses[networkId][`STAKING_BACKED_NFT_ADDRESS_${type}`] as string,
        stakingBackedNFTPool,
        signer
      );
      stakeTx = await stakingNftPoolContract["stake"](nftId, address);
      dispatch(
        fetchPendingTxns({
          txnHash: stakeTx.hash,
          text: "Staking " + bond.displayName,
          type: "stake_" + bond.name,
        })
      );
      await stakeTx.wait();
    } catch (e: any) {
      console.log(e);
      if (e.error === undefined) {
        let message;
        if (e.message === "Internal JSON-RPC error.") {
          message = e.data.message;
        } else {
          message = e.message;
        }
        if (typeof message === "string") {
          dispatch(error(`Unknown error: ${message}`));
        }
      } else {
        dispatch(error(`Unknown error: ${e.error.message}`));
      }
    } finally {
      if (stakeTx) {
        dispatch(clearPendingTxn(stakeTx.hash));
        await dispatch(info("Stake completed."));
        dispatch(getBalances({ address, networkId }));
        callback && callback();
      }
    }

    return null;
  }
);

export const unstakeNft = createAsyncThunk(
  "account/unstakeNft",
  async (
    {
      nftId,
      type,
      address,
      bond,
      networkId,
      provider,
      callback,
    }: IStakingBackedNftAsyncThunk,
    { dispatch }
  ) => {
    if (!networkId) {
      return null;
    }
    let stakeTx;
    try {
      const signer = provider.getSigner(address);
      const stakingNftPoolContract = new ethers.Contract(
        addresses[networkId][`STAKING_BACKED_NFT_ADDRESS_${type}`] as string,
        stakingBackedNFTPool,
        signer
      );
      stakeTx = await stakingNftPoolContract["unstake"](address);
      dispatch(
        fetchPendingTxns({
          txnHash: stakeTx.hash,
          text: "Unstaking " + bond.displayName,
          type: "unstake_" + bond.name,
        })
      );
      await stakeTx.wait();
    } catch (e: any) {
      console.log(e);
      if (e.error === undefined) {
        let message;
        if (e.message === "Internal JSON-RPC error.") {
          message = e.data.message;
        } else {
          message = e.message;
        }
        if (typeof message === "string") {
          dispatch(error(`Unknown error: ${message}`));
        }
      } else {
        dispatch(error(`Unknown error: ${e.error.message}`));
      }
    } finally {
      if (stakeTx) {
        dispatch(clearPendingTxn(stakeTx.hash));
        dispatch(info("Unstake completed."));
        dispatch(getBalances({ address, networkId }));
        callback && callback();
      }
    }

    return null;
  }
);

export const changeStakePoolApproval = createAsyncThunk(
  "bonding/changeStakePoolApproval",
  async (
    { nftId, address, bond, provider, networkId }: IApprovePoolAsyncThunk,
    { dispatch }
  ) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const reserveContract = bond.getContractForReserveForWrite(networkId, signer);
    const bondAddr = bond.getAddressForBond(networkId);

    let approveTx;

    try {
      approveTx = await reserveContract["approve"](bondAddr, nftId.toString());
      dispatch(
        fetchPendingTxns({
          txnHash: approveTx.hash,
          text: "Approving " + bond.displayName,
          type: "approve_" + bond.name,
        })
      );
      await approveTx.wait();
    } catch (e: any) {
      if (e.error === undefined) {
        let message;
        if (e.message === "Internal JSON-RPC error.") {
          message = e.data.message;
        } else {
          message = e.message;
        }
        if (typeof message === "string") {
          dispatch(error(`Unknown error: ${message}`));
        }
      } else {
        dispatch(error(`Unknown error: ${e.error.message}`));
      }
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
        dispatch(info("Approve completed."));
      }
    }
  }
);

export const getUsdbAmount = createAsyncThunk(
  "account/getUsdbAmount",
  async (
    { nftId, address, networkId, provider, callback }: IApprovePoolAsyncThunk,
    { dispatch }
  ) => {
    if (!networkId) {
      return null;
    }
    const usdbNftContract = new ethers.Contract(
      addresses[networkId]["USDB_NFT_ADDRESS"] as string,
      usdbNftAbi,
      provider
    );
    try {
      let amount = await usdbNftContract["getUsdbAmount"](nftId);
      amount = ethers.utils.formatUnits(amount, 18);
      callback && callback(amount);
    } catch (e) {
      //
    }

    return null;
  }
);

export const getCalcAmount = createAsyncThunk(
  "account/getCalcAmount",
  async (
    { nftId, type, address, networkId, provider, callback }: IStakingBackedNftAsyncThunk,
    { dispatch }
  ) => {
    if (!networkId) {
      return null;
    }
    const stakingNftPoolContract = new ethers.Contract(
      addresses[networkId][`STAKING_BACKED_NFT_ADDRESS_${type}`] as string,
      stakingBackedNFTPool,
      provider
    );
    try {
      let amount = await stakingNftPoolContract["_calcAmount"](address, nftId);
      amount = ethers.utils.formatUnits(amount, 18);
      callback && callback(Number(amount));
    } catch (e) {
      //
    }

    return null;
  }
);

export const getTotalRewards = createAsyncThunk(
  "account/getTotalRewards",
  async (
    { address, networkId, provider, callback }: IStakingBackedNftAsyncThunk,
    { dispatch }
  ) => {
    if (!networkId) {
      return null;
    }
    const ampsContract = new ethers.Contract(
      addresses[networkId]["AMPS_ADDRESS"] as string,
      ampsToken,
      provider
    );
    try {
      let amount = await ampsContract["balanceOf"](address);
      amount = ethers.utils.formatUnits(amount, 18);
      callback && callback(Number(amount));
    } catch (e) {
      //
    }

    return null;
  }
);

export const amptRedeemNft = createAsyncThunk(
  "account/amptRedeemNft",
  async (
    {
      type,
      address,
      method,
      bond,
      networkId,
      provider,
      callback,
    }: IAmpsRedeemNftAsyncThunk,
    { dispatch }
  ) => {
    if (!networkId) {
      return null;
    }
    const signer = provider.getSigner(address);
    const stakingNftPoolContract = new ethers.Contract(
      addresses[networkId][`STAKING_BACKED_NFT_ADDRESS_${type}`] as string,
      stakingBackedNFTPool,
      signer
    );

    let redeemTx;
    try {
      redeemTx = await stakingNftPoolContract[method](address);
      dispatch(
        fetchPendingTxns({
          txnHash: redeemTx.hash,
          text: "Redeeming " + bond.displayName,
          type: "redeem_" + method + bond.name,
        })
      );
      await redeemTx.wait();
    } catch (e: any) {
      if (e.error === undefined) {
        let message;
        if (e.message === "Internal JSON-RPC error.") {
          message = e.data.message;
        } else {
          message = e.message;
        }
        if (typeof message === "string") {
          dispatch(error(`Unknown error: ${message}`));
        }
      } else {
        dispatch(error(`Unknown error: ${e.error.message}`));
      }
    } finally {
      if (redeemTx) {
        dispatch(clearPendingTxn(redeemTx.hash));
        dispatch(info("Redeem completed."));
      }
    }

    return null;
  }
);