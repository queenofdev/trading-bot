import { ethers, BigNumber } from "ethers";
import { addresses } from "../constants";
import {
  stakingHelperAbi,
  fhudContractAbi,
  usdbMinterAbi,
  olympusStakingv2Abi,
  ierc20Abi,
} from "../abi";
import {
  clearPendingTxn,
  fetchPendingTxns,
  getStakingTypeText,
} from "./pending-txns-slice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances, loadAccountDetails } from "./account-slice";
import { error, info } from "./messages-slice";
import { IActionValueAsyncThunk, IChangeApprovalAsyncThunk } from "./interfaces";
import { segmentUA } from "../helpers/user-analytic-helpers";
import { sleep } from "../helpers/sleep";

interface IUAData {
  address: string;
  value: string;
  approved: boolean;
  txHash: string | null;
  type: string | null;
}

function alreadyApprovedToken(
  token: string,
  stakeAllowance: BigNumber,
  unstakeAllowance: BigNumber
) {
  // set defaults
  const bigZero = BigNumber.from("0");
  let applicableAllowance = bigZero;

  // determine which allowance to check
  if (token === "fhm") {
    applicableAllowance = stakeAllowance;
  } else if (token === "sfhm") {
    applicableAllowance = unstakeAllowance;
  }

  // check if allowance exists
  if (applicableAllowance.gt(bigZero)) return true;

  return false;
}

export const changeApproval = createAsyncThunk(
  "stake/changeApproval",
  async (
    { token, provider, address, networkId }: IChangeApprovalAsyncThunk,
    { dispatch }
  ) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const ohmContract = new ethers.Contract(
      addresses[networkId]["OHM_ADDRESS"] as string,
      ierc20Abi,
      signer
    );
    const sohmContract = new ethers.Contract(
      addresses[networkId]["SOHM_ADDRESS"] as string,
      ierc20Abi,
      signer
    );
    let approveTx;
    let stakeAllowance = await ohmContract["allowance"](
      address,
      addresses[networkId]["STAKING_HELPER_ADDRESS"]
    );
    let unstakeAllowance = await sohmContract["allowance"](
      address,
      addresses[networkId]["STAKING_ADDRESS"]
    );

    // return early if approval has already happened
    if (alreadyApprovedToken(token, stakeAllowance, unstakeAllowance)) {
      dispatch(info("Approval completed."));
      return dispatch(
        fetchAccountSuccess({
          staking: {
            ohmStake: +stakeAllowance,
            ohmUnstake: +unstakeAllowance,
          },
        })
      );
    }

    try {
      if (token === "fhm") {
        // won't run if stakeAllowance > 0
        approveTx = await ohmContract["approve"](
          addresses[networkId]["STAKING_HELPER_ADDRESS"],
          ethers.utils.parseUnits("1000000000", "gwei").toString()
        );
      } else if (token === "sfhm") {
        approveTx = await sohmContract["approve"](
          addresses[networkId]["STAKING_ADDRESS"],
          ethers.utils.parseUnits("1000000000", "gwei").toString()
        );
      }

      const text = "Approve " + (token === "fhm" ? "Staking" : "Unstaking");
      const pendingTxnType = token === "fhm" ? "approve_staking" : "approve_unstaking";
      dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));

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
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

    // go get fresh allowances
    stakeAllowance = await ohmContract["allowance"](
      address,
      addresses[networkId]["STAKING_HELPER_ADDRESS"]
    );
    unstakeAllowance = await sohmContract["allowance"](
      address,
      addresses[networkId]["STAKING_ADDRESS"]
    );

    return dispatch(
      fetchAccountSuccess({
        staking: {
          ohmStake: +stakeAllowance,
          ohmUnstake: +unstakeAllowance,
        },
      })
    );
  }
);

export const changeFHUDApproval = createAsyncThunk(
  "stake/changeApproval",
  async (
    { token, provider, address, networkId }: IChangeApprovalAsyncThunk,
    { dispatch }
  ) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    let approveTx;
    let fhudAllowance = 0;
    if (networkId === 250) {
      const fhudContract = new ethers.Contract(
        addresses[networkId]["FHUD_ADDRESS"] as string,
        fhudContractAbi,
        signer
      );
      fhudAllowance = await fhudContract["allowance"](
        address,
        addresses[networkId]["USDB_MINTER"]
      );
    }

    try {
      if (networkId === 250) {
        const fhudContract = new ethers.Contract(
          addresses[networkId]["FHUD_ADDRESS"] as string,
          fhudContractAbi,
          signer
        );

        approveTx = await fhudContract["approve"](
          addresses[networkId]["USDB_MINTER"],
          ethers.utils.parseUnits("100000000000000000000000000000000").toString()
        );
      }

      const text = "Approve Minting";
      const pendingTxnType = "approve_minting";
      dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));

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
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

    // go get fresh allowances

    if (networkId === 250) {
      const fhudContract = new ethers.Contract(
        addresses[networkId]["FHUD_ADDRESS"] as string,
        fhudContractAbi,
        signer
      );
      fhudAllowance = await fhudContract["allowance"](
        address,
        addresses[networkId]["USDB_MINTER"]
      );
    }
    return dispatch(
      fetchAccountSuccess({
        staking: {
          fhudAllowance: +fhudAllowance,
        },
      })
    );
  }
);

export const changeStake = createAsyncThunk(
  "stake/changeStake",
  async (
    { action, value, provider, address, networkId }: IActionValueAsyncThunk,
    { dispatch }
  ) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const staking = new ethers.Contract(
      addresses[networkId]["STAKING_ADDRESS"] as string,
      olympusStakingv2Abi,
      signer
    );
    const stakingHelper = new ethers.Contract(
      addresses[networkId]["STAKING_HELPER_ADDRESS"] as string,
      stakingHelperAbi,
      signer
    );

    let stakeTx;
    const uaData: IUAData = {
      address: address,
      value: value,
      approved: true,
      txHash: null,
      type: null,
    };
    try {
      if (action === "stake") {
        uaData.type = "stake";
        stakeTx = await stakingHelper["stake"](ethers.utils.parseUnits(value, "gwei"));
      } else {
        uaData.type = "unstake";
        stakeTx = await staking["unstake"](ethers.utils.parseUnits(value, "gwei"), true);
      }
      const pendingTxnType = action === "stake" ? "staking" : "unstaking";
      uaData.txHash = stakeTx.hash;
      dispatch(
        fetchPendingTxns({
          txnHash: stakeTx.hash,
          text: getStakingTypeText(action),
          type: pendingTxnType,
        })
      );
      await stakeTx.wait();
    } catch (e: any) {
      uaData.approved = false;
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
      } else if (
        e.error.code === -32603 &&
        e.error.message.indexOf("ds-math-sub-underflow") >= 0
      ) {
        dispatch(
          error(
            "You may be trying to bridge more than your balance! Error code: 32603. Message: ds-math-sub-underflow"
          )
        );
      } else {
        dispatch(error(`Unknown error: ${e.error.message}`));
      }
      return;
    } finally {
      if (stakeTx) {
        segmentUA(uaData);
        await sleep(2);
        await dispatch(loadAccountDetails({ address, networkId }));
        dispatch(clearPendingTxn(stakeTx.hash));
      }
    }
    dispatch(getBalances({ address, networkId }));
  }
);

export const changeMint = createAsyncThunk(
  "stake/changeMint",
  async (
    { action, value, provider, address, networkId }: IActionValueAsyncThunk,
    { dispatch }
  ) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }
    if (networkId !== 250) {
      dispatch(error("Please connect to Fantom Opera Chain!"));
      return;
    }

    const signer = provider.getSigner();
    const usdbMinter = new ethers.Contract(
      addresses[networkId]["USDB_MINTER"] as string,
      usdbMinterAbi,
      signer
    );

    let mintTx;
    const uaData: IUAData = {
      address: address,
      value: value,
      approved: true,
      txHash: null,
      type: null,
    };
    try {
      if (action === "mint") {
        uaData.type = "mint";
        mintTx = await usdbMinter["mintFromFHUD"](ethers.utils.parseUnits(value, 18));
      }
      const pendingTxnType = "minting";
      uaData.txHash = mintTx.hash;
      dispatch(
        fetchPendingTxns({
          txnHash: mintTx.hash,
          text: "Minting USDB",
          type: pendingTxnType,
        })
      );
      await mintTx.wait();
    } catch (e: any) {
      uaData.approved = false;
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
      } else if (
        e.error.code === -32603 &&
        e.error.message.indexOf("ds-math-sub-underflow") >= 0
      ) {
        dispatch(
          error(
            "You may be trying to bridge more than your balance! Error code: 32603. Message: ds-math-sub-underflow"
          )
        );
      } else {
        dispatch(error(`Unknown error: ${e.error.message}`));
      }
      return;
    } finally {
      if (mintTx) {
        segmentUA(uaData);
        await sleep(2);
        await dispatch(loadAccountDetails({ address, networkId }));
        dispatch(clearPendingTxn(mintTx.hash));
      }
    }
    dispatch(getBalances({ address, networkId }));
  }
);

export const changeForfeit = createAsyncThunk(
  "stake/forfeit",
  async ({ provider, address, networkId }: IActionValueAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const staking = new ethers.Contract(
      addresses[networkId]["STAKING_ADDRESS"] as string,
      olympusStakingv2Abi,
      signer
    );
    let forfeitTx;

    try {
      forfeitTx = await staking["forfeit"]();
      const text = "Forfeiting";
      const pendingTxnType = "forfeiting";
      dispatch(fetchPendingTxns({ txnHash: forfeitTx.hash, text, type: pendingTxnType }));
      await forfeitTx.wait();
      // dispatch(info('Your transaction was successful'));
      await sleep(10);
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
      return;
    } finally {
      if (forfeitTx) {
        // dispatch(info('Your balance will update soon'));
        await sleep(5);
        await dispatch(loadAccountDetails({ address, networkId }));
        dispatch(clearPendingTxn(forfeitTx.hash));
        // dispatch(info('Your balance was successfully updated'));
        // eslint-disable-next-line no-unsafe-finally
        return;
      }
    }
  }
);

export const changeClaim = createAsyncThunk(
  "stake/changeClaim",
  async ({ provider, address, networkId }: IActionValueAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const staking = new ethers.Contract(
      addresses[networkId]["STAKING_ADDRESS"] as string,
      olympusStakingv2Abi,
      signer
    );
    let claimTx;

    try {
      claimTx = await staking["claim"](address);
      const text = "Claiming";
      const pendingTxnType = "claiming";
      dispatch(fetchPendingTxns({ txnHash: claimTx.hash, text, type: pendingTxnType }));
      await claimTx.wait();
      // dispatch(info('Your transaction was successful'));
      await sleep(10);
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
      return;
    } finally {
      if (claimTx) {
        // dispatch(info('Your balance will update soon'));
        await sleep(5);
        await dispatch(loadAccountDetails({ address, networkId }));
        dispatch(clearPendingTxn(claimTx.hash));
        // dispatch(info('Your balance was successfully updated'));
        // eslint-disable-next-line no-unsafe-finally
        return;
      }
    }
  }
);
