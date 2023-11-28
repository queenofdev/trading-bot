import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { Box, Button, Grid, Skeleton } from "@mui/material";
import style from "../mint-nft.module.scss";
import { USDBToken } from "@fantohm/shared/images";
import {
  defaultNetworkId,
  getNftInfo,
  INftItemDetails,
  prettifySeconds,
  useWeb3Context,
  trim,
  getTokenPrice,
  redeemNft,
  getNftTokenUri,
  IUsdbNftRedeemAsyncThunk,
  getNftImageUri,
} from "@fantohm/shared-web3";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useNavigate } from "react-router-dom";
import { NftMetadata } from "../mint-nft";

interface INftItemParams {
  nftId: number;
}

export const NftItem = (props: INftItemParams): JSX.Element => {
  const { provider, address, chainId, connect, disconnect, connected } = useWeb3Context();
  const { nftId } = props;
  const dispatch = useDispatch();
  const [fhmPrice, setFhmPrice] = useState(0);
  const [nftDetails, setNftDetails] = useState<INftItemDetails | null>(null);
  const [nftMetadata, setNftMetadata] = useState<null | NftMetadata>(null);
  const [nftImageUri, setNftImageUri] = useState<null | string>(null);

  useEffect(() => {
    dispatch(
      getNftInfo({
        id: nftId,
        networkId: chainId || defaultNetworkId,
        callback: async (nft: INftItemDetails) => {
          setNftDetails(nft);
        },
      })
    );
    dispatch(
      getNftTokenUri({
        id: nftId,
        networkId: chainId ?? defaultNetworkId,
        callback: async (metadata: NftMetadata) => {
          setNftMetadata(metadata);
          const nftImageUri = await getNftImageUri(metadata.tokenId);
          setNftImageUri(nftImageUri);
        },
      })
    );
  }, [connected, address, dispatch]);

  useEffect(() => {
    async function fetchPrice() {
      setFhmPrice(await getTokenPrice("fantohm"));
    }

    fetchPrice().then();
  }, []);

  if (nftDetails === null)
    return (
      <Grid container spacing={0} flex={1}>
        <Grid item xs={12} md={5} flex={1}>
          <Box className={style["nftImageBox"]}>
            <Skeleton />
          </Box>
        </Grid>
        <Grid item xs={12} md={7} flex={1} sx={{ padding: "1em" }}>
          <Box className={style["vestingDescription"]}>
            <span style={{ flex: 1 }}>Vesting period</span>
            <Skeleton />
          </Box>
          <Box className={style["vestingDescription"]}>
            <span style={{ flex: 1 }}>Invested</span>
            <Skeleton />
          </Box>
          <Box className={style["vestingDescription"]}>
            <span style={{ flex: 1 }}>Current value</span>
            <Skeleton />
          </Box>
          <Box className={style["vestingDescription"]}>
            <span style={{ flex: 1 }}>Time remaining</span>
            <Skeleton />
          </Box>
        </Grid>
      </Grid>
    );

  const getCurrentValue = () => {
    if (!nftDetails) return 0;
    const fhmPayout = ethers.utils.formatUnits(nftDetails?.fhmPayout, 9);
    return trim(nftDetails?.pricePaid * Number(fhmPayout), 2);
  };

  const getUsdValue = () => {
    return fhmPrice * nftDetails.sFhmBalance + Number(getCurrentValue());
  };

  const onRedeem = async () => {
    if (provider) {
      await dispatch(
        redeemNft({
          nftId,
          address,
          networkId: chainId ?? defaultNetworkId,
          provider,
        } as IUsdbNftRedeemAsyncThunk)
      );
    }
  };

  const onTrade = () => {
    const url = `https://opensea.io/`;
    window.open(url);
  };

  return (
    <Grid container spacing={0} flex={1} sx={{ mb: "2em" }}>
      <Grid item xs={12} md={6} flex={1}>
        <Box className={style["nftItemImageBox"]}>
          {nftImageUri ? <img src={nftImageUri} /> : <Skeleton />}
        </Box>
      </Grid>
      <Grid item xs={12} md={6} flex={1} sx={{ padding: "1em" }}>
        {nftDetails.secondsToVest > 0 ? (
          <>
            <Box className={style["vestingDescription"]}>
              <span style={{ flex: 1 }}>Vesting period</span>
              <span>{Math.floor(nftDetails.vestingSeconds / (3600 * 24))} days</span>
            </Box>
            <Box className={style["vestingDescription"]}>
              <span style={{ flex: 1 }}>Invested</span>
              <span>{trim(nftDetails.usdbAmount, 2)} USDB</span>
            </Box>
          </>
        ) : null}
        <Box className={style["vestingDescription"]}>
          <span style={{ flex: 1 }}>Current value</span>
          <div>
            <span>
              {getCurrentValue()} USDB
              <br />
              {trim(nftDetails.sFhmBalance, 2)} sFHM
            </span>
            <br />
            <span>~$ {trim(getUsdValue(), 2)}</span>
          </div>
        </Box>
        <Box className={style["vestingDescription"]}>
          <span style={{ flex: 1 }}>Time remaining</span>
          <span>
            {nftDetails.secondsToVest > 0
              ? prettifySeconds(nftDetails.secondsToVest)
              : "Fully vested"}
          </span>
        </Box>
        {nftDetails.secondsToVest < 0 ? (
          <Box sx={{ display: "flex", mt: "3em" }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ flex: 1, margin: "10px", padding: "5px" }}
              className={`${style["nft-item-prop"]} border`}
              onClick={() => onRedeem()}
            >
              Redeem
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={`${style["nft-item-prop"]} border`}
              sx={{ flex: 1, margin: "10px", padding: "5px" }}
              onClick={() => onTrade()}
            >
              Trade
            </Button>
          </Box>
        ) : null}
      </Grid>
    </Grid>
  );
};
