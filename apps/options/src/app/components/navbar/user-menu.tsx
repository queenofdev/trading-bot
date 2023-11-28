import { useWeb3Context } from "@fantohm/shared-web3";
import { useMemo } from "react";

import ConnectWallet from "./connect-wallet";
import NotificationMenu from "./notification-menu";
import WalletBalance from "./wallet-balance";
import { desiredNetworkId } from "../../core/constants/network";

export const UserMenu = (): JSX.Element => {
  const { connected, address, chainId } = useWeb3Context();
  const isWalletConnected = useMemo(() => {
    return address && connected && chainId === desiredNetworkId;
  }, [address, connected, chainId]);
  return (
    <div
      className={`flex justify-end items-center p-5 
        ${isWalletConnected && "border border-lightbunker rounded-2xl"} 
      `}
    >
      {isWalletConnected && (
        <>
          <WalletBalance />
          <NotificationMenu />
        </>
      )}
      <ConnectWallet />
    </div>
  );
};

export default UserMenu;
