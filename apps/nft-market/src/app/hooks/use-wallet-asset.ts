import { useWeb3Context } from "@fantohm/shared-web3";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Asset } from "../types/backend-types";
import { selectAssetByAddress } from "../store/selectors/asset-selectors";
import { useGetAssetsQuery, useGetNftAssetQuery } from "../api/backend-api";

export const useWalletAsset = (
  contractAddress: string,
  tokenId: string
): Asset | null => {
  const { authSignature } = useSelector((state: RootState) => state.backend);
  const asset = useSelector((state: RootState) =>
    selectAssetByAddress(state, { tokenId, contractAddress })
  );
  const { address } = useWeb3Context();
  // load asset data from nftport
  const { data: npResponse, isLoading: isAssetLoading } = useGetNftAssetQuery(
    {
      tokenId,
      contractAddress,
    },
    { skip: !!asset || !address }
  );

  useGetAssetsQuery(
    {
      skip: 0,
      take: 1,
      contractAddresses: contractAddress,
      tokenIds: tokenId,
    },
    { skip: !npResponse || isAssetLoading || !authSignature }
  );

  return asset || ({} as Asset);
};
