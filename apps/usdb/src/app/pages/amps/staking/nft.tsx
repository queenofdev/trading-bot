import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { Box, Button, Grid, Icon, Skeleton, Typography } from "@mui/material";
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
} from "@fantohm/shared-web3";
import { useDispatch, useSelector } from "react-redux";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import { NftMetadata } from "../../backed-nft/mint-nft";
import style from "../amps.module.scss";

interface INftItemParams {
  nftId: number;
  onClick: any;
  selected: boolean;
}

export const NftItem = (props: INftItemParams): JSX.Element => {
  const { provider, address, chainId, connect, disconnect, connected } = useWeb3Context();
  const { nftId, onClick, selected } = props;
  const dispatch = useDispatch();
  const [nftMetadata, setNftMetadata] = useState<null | NftMetadata>(null);

  useEffect(() => {
    dispatch(
      getNftTokenUri({
        id: nftId,
        networkId: chainId ?? defaultNetworkId,
        callback: (metadata: NftMetadata) => {
          setNftMetadata(metadata);
        },
      })
    );
  }, [connected, address, dispatch]);

  return (
    <Grid item xs={4} className={style["nftItem"]} key={`${nftId}`}>
      <Box className={style["nftImage"]} onClick={onClick}>
        {nftMetadata ? <img src={nftMetadata?.image} /> : <Skeleton />}
        {selected && (
          <Icon className={style["selectedIcon"]}>
            <CheckCircleOutline />
          </Icon>
        )}
      </Box>
      <Typography variant="subtitle1" color="primary" className={style["nftTitle"]}>
        NFT #{nftId}
      </Typography>
    </Grid>
  );
};
