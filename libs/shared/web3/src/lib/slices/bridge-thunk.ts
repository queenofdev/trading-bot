import { ethers, BigNumber } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as BridgeConverter } from "../abi/BridgeConverter.json";
import { clearPendingTxn, fetchPendingTxns } from "./pending-txns-slice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./account-slice";
import { error, info } from "./messages-slice";
import { IActionValueAsyncThunk, IChangeApprovalAsyncThunk } from "./interfaces";
import { segmentUA } from "../helpers/user-analytic-helpers";
import { NetworkId } from "../networks";
import { chains } from "../providers";

interface IUAData {
  address: string;
  value: string;
  approved: boolean;
  txHash: string | null;
  type: string | null;
}

function alreadyApprovedToken(
  token: string,
  bridgeDownstreamAllowance: BigNumber,
  bridgeUpstreamAllowance: BigNumber
) {
  // set defaults
  const bigZero = BigNumber.from("0");
  let applicableAllowance = bigZero;

  // determine which allowance to check
  if (token === "fhm") {
    applicableAllowance = bridgeUpstreamAllowance;
  } else if (token === "fhm.m") {
    applicableAllowance = bridgeDownstreamAllowance;
  }

  // check if allowance exists
  if (applicableAllowance.gt(bigZero)) return true;

  return false;
}

export const getBridgeBalances = async (networkId: NetworkId) => {
  const provider = await chains[networkId].provider;
  const ohmContract = new ethers.Contract(
    addresses[networkId]["OHM_ADDRESS"] as string,
    ierc20Abi,
    provider
  );
  const bridgeContract = new ethers.Contract(
    addresses[networkId]["BRIDGE_TOKEN_ADDRESS"] as string,
    ierc20Abi,
    provider
  );
  const [ohmAmount, bridgeAmount] = await Promise.all([
    ohmContract["balanceOf"](addresses[networkId]["BRIDGE_ADDRESS"]),
    bridgeContract["balanceOf"](addresses[networkId]["BRIDGE_ADDRESS"]),
  ]);
  return { ohm: ohmAmount, bridge: bridgeAmount };
};

export const getBridgeFee = async (networkId: number) => {
  const provider = await chains[networkId].provider;
  const bridge = new ethers.Contract(
    addresses[networkId]["BRIDGE_ADDRESS"] as string,
    BridgeConverter,
    provider
  );
  return await bridge["fee"]();
};

export const changeApproval = createAsyncThunk(
  "bridge/changeApproval",
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
    const bridgeContract = new ethers.Contract(
      addresses[networkId]["BRIDGE_TOKEN_ADDRESS"] as string,
      ierc20Abi,
      signer
    );
    const convertContract = new ethers.Contract(
      addresses[networkId]["BRIDGE_ADDRESS"] as string,
      BridgeConverter,
      signer
    );
    let approveTx;
    let bridgeUpstreamAllowance = await ohmContract["allowance"](
      address,
      addresses[networkId]["BRIDGE_ADDRESS"]
    );
    let bridgeDownstreamAllowance = await bridgeContract["allowance"](
      address,
      addresses[networkId]["BRIDGE_ADDRESS"]
    );

    // return early if approval has already happened
    if (alreadyApprovedToken(token, bridgeDownstreamAllowance, bridgeUpstreamAllowance)) {
      dispatch(info("Approval completed."));
      return dispatch(
        fetchAccountSuccess({
          bridging: {
            bridgeUpstreamAllowance: +bridgeUpstreamAllowance,
            bridgeDownstreamAllowance: +bridgeDownstreamAllowance,
          },
        })
      );
    }

    try {
      if (token === "fhm") {
        // won't run if bridgeUpstreamAllowance > 0
        approveTx = await ohmContract["approve"](
          addresses[networkId]["BRIDGE_ADDRESS"],
          ethers.utils.parseUnits("1000000000", "gwei").toString()
        );
      } else if (token === "fhm.m") {
        approveTx = await bridgeContract["approve"](
          addresses[networkId]["BRIDGE_ADDRESS"],
          ethers.utils.parseUnits("1000000000", "gwei").toString()
        );
      }

      const text = "Approve " + (token === "fhm" ? "Outgoing" : "Incoming");
      const pendingTxnType = token === "fhm" ? "approve_upstream" : "approve_downstream";
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
    bridgeUpstreamAllowance = await ohmContract["allowance"](
      address,
      addresses[networkId]["BRIDGE_ADDRESS"]
    );
    bridgeDownstreamAllowance = await bridgeContract["allowance"](
      address,
      addresses[networkId]["BRIDGE_ADDRESS"]
    );

    return dispatch(
      fetchAccountSuccess({
        bridging: {
          bridgeUpstreamAllowance: +bridgeUpstreamAllowance,
          bridgeDownstreamAllowance: +bridgeDownstreamAllowance,
        },
      })
    );
  }
);

export const convert = createAsyncThunk(
  "bridge/convert",
  async (
    { action, value, provider, address, networkId }: IActionValueAsyncThunk,
    { dispatch }
  ) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const bridge = new ethers.Contract(
      addresses[networkId]["BRIDGE_ADDRESS"] as string,
      BridgeConverter,
      signer
    );

    let bridgeTx;
    const uaData: IUAData = {
      address: address,
      value: value,
      approved: true,
      txHash: null,
      type: null,
    };
    try {
      if (action === "downstream") {
        uaData.type = "downstream";
        bridgeTx = await bridge["downstream"](
          ethers.utils.getAddress(addresses[networkId]["BRIDGE_TOKEN_ADDRESS"]),
          ethers.utils.parseUnits(value, "gwei")
        );
      } else {
        uaData.type = "upstream";
        bridgeTx = await bridge["upstream"](
          ethers.utils.getAddress(addresses[networkId]["BRIDGE_TOKEN_ADDRESS"]),
          ethers.utils.parseUnits(value, "gwei")
        );
      }
      const pendingTxnType = action === "downstream" ? "downstream" : "upstream";
      uaData.txHash = bridgeTx.hash;
      dispatch(
        fetchPendingTxns({
          txnHash: bridgeTx.hash,
          text: "Bridging FHM",
          type: pendingTxnType,
        })
      );
      await bridgeTx.wait();
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
      if (bridgeTx) {
        segmentUA(uaData);

        dispatch(clearPendingTxn(bridgeTx.hash));
      }
    }
    dispatch(getBalances({ address, networkId }));
  }
);
