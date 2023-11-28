import {
  defaultNetworkId,
  useBonds,
  useWeb3Context,
  getNftList,
  stakeNft,
  allBonds,
  BondType,
  IAllBondData,
  txnButtonText,
  isPendingTxn,
  changeApproval,
  changeStakePoolApproval,
  getUserBondApproval,
} from "@fantohm/shared-web3";
import { Modal, Box, Typography, Fade, Paper, Grid, Button } from "@mui/material";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import style from "../amps.module.scss";
import { NftItem } from "./nft";

export const StakeModal = ({
  open,
  type,
  closeModal,
}: {
  open: boolean;
  type: number;
  closeModal: () => void;
}): JSX.Element => {
  const { provider, address, chainId, connect, disconnect, connected } = useWeb3Context();
  const { bonds } = useBonds(chainId || defaultNetworkId);
  const [nftIds, setNftIds] = useState<Array<number>>([]);
  const [selectedId, setSelectedId] = useState<number>(-1);
  const [allowance, setAllowance] = useState<boolean>(false);
  const dispatch = useDispatch();

  const [stdButtonColor, setStdButtonColor] = useState<"primary" | "error">("primary");

  const accountBonds = useSelector((state: RootState) => {
    return state.account.bonds;
  });

  const stakeNftPoolData = useMemo(() => {
    return allBonds.filter(
      (pool) => pool.type === BondType.STAKE_NFT && pool.days === type
    )[0] as IAllBondData;
  }, [type]);
  const stakeNftPool = accountBonds[stakeNftPoolData?.name];

  const pendingTransactions = useSelector((state: RootState) => {
    return state?.pendingTransactions;
  });

  useEffect(() => {
    if (!connected || !address) return;
    dispatch(
      getNftList({
        address,
        networkId: chainId ?? defaultNetworkId,
        callback: (list: Array<number>) => {
          setNftIds(list);
        },
      })
    );
  }, [connected, address, stakeNftPoolData, stakeNftPool, pendingTransactions]);

  useEffect(() => {
    if (selectedId === -1 || !provider) return;
    dispatch(
      getUserBondApproval({
        nftId: selectedId,
        address,
        bond: stakeNftPoolData,
        networkId: chainId ?? defaultNetworkId,
        provider,
        callback: (value: boolean) => setAllowance(value),
      })
    );
  }, [selectedId, stakeNftPoolData, connected, stakeNftPool, pendingTransactions]);

  const onSelect = (id: number) => {
    setSelectedId(id);
  };

  const onSeekApproval = () => {
    if (provider) {
      dispatch(
        changeStakePoolApproval({
          nftId: selectedId,
          address,
          bond: stakeNftPoolData,
          provider,
          networkId: chainId ?? defaultNetworkId,
        })
      );
    }
  };

  const onStake = () => {
    if (!provider) return;
    dispatch(
      stakeNft({
        nftId: selectedId,
        type,
        address,
        networkId: chainId ?? defaultNetworkId,
        bond: stakeNftPoolData,
        provider,
        callback: closeModal,
      })
    );
  };

  return (
    <Modal open={open}>
      <Fade in={open}>
        <Paper
          className={style["modal"]}
          sx={{ py: "2rem", px: "3rem", borderRadius: "0.5rem" }}
        >
          <Box display="flex" alignItems="center">
            <Typography variant="h6" color="primary" className="font-weight-bold">
              {nftIds.length === 0
                ? "You don't have any NFTs."
                : "Choose NFT(s) to stake"}
            </Typography>
          </Box>

          <Grid container marginTop={3} className={style["nftItemContainer"]}>
            {nftIds.map((id: number) => (
              <NftItem
                nftId={id}
                onClick={() => onSelect(id)}
                selected={selectedId === id}
                key={`${id}`}
              />
            ))}
          </Grid>
          <Box display="flex" mt="20px" width="80%" marginLeft="10%">
            {nftIds.length !== 0 &&
              (allowance ? (
                <Button
                  variant="contained"
                  color={stdButtonColor}
                  className="paperButton cardActionButton"
                  disabled={
                    selectedId == -1 ||
                    isPendingTxn(pendingTransactions, "stake_" + stakeNftPoolData.name)
                  }
                  onClick={onStake}
                  sx={{ marginRight: 2 }}
                >
                  {txnButtonText(
                    pendingTransactions,
                    "stake_" + stakeNftPoolData.name,
                    "Stake"
                  )}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  className="paperButton cardActionButton"
                  disabled={
                    selectedId == -1 ||
                    isPendingTxn(pendingTransactions, "approve_" + stakeNftPoolData.name)
                  }
                  onClick={onSeekApproval}
                  sx={{ marginRight: 2 }}
                >
                  {txnButtonText(
                    pendingTransactions,
                    "approve_" + stakeNftPoolData.name,
                    "Approve"
                  )}
                </Button>
              ))}

            <Button
              variant="contained"
              color="primary"
              id="bond-btn"
              className="paperButton transaction-button"
              onClick={closeModal}
            >
              Cancel
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Modal>
  );
};

export default memo(StakeModal);
