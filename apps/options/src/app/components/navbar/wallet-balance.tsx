import { currencyInfo, loadErc20Balance, useWeb3Context } from "@fantohm/shared-web3";
import Skeleton from "@mui/material/Skeleton";
import { ethers } from "ethers";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { desiredNetworkId, BINARY_ADDRESSES } from "../../core/constants/network";

import { RootState } from "../../store";

const WalletBalance = () => {
  const dispatch = useDispatch();
  const { address } = useWeb3Context();
  const { erc20Balance } = useSelector((state: RootState) => state.wallet);
  const DAIAddress = BINARY_ADDRESSES[desiredNetworkId].DAI_ADDRESS;

  useEffect(() => {
    if (!address) return;
    dispatch(
      loadErc20Balance({
        networkId: desiredNetworkId,
        address,
        currencyAddress: DAIAddress,
      })
    );
  }, [address]);

  return (
    <div className="xs:hidden xl:block mx-15">
      {erc20Balance[DAIAddress] ? (
        <p className="xs:text-10 sm:text-16 text-primary">
          {ethers.utils.formatUnits(
            erc20Balance[DAIAddress],
            currencyInfo["DAI_ADDRESS"].decimals || 18
          )}{" "}
          &nbsp;{currencyInfo["DAI_ADDRESS"].symbol}
        </p>
      ) : (
        <Skeleton width={100} height={50} sx={{ backgroundColor: "#48565d" }} />
      )}
    </div>
  );
};

export default WalletBalance;
