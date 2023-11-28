import { Box, Paper, Typography, useMediaQuery, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import style from "./my-account.module.scss";
import {
  BondType,
  cancelBond,
  claimSingleSidedBond,
  defaultNetworkId,
  getNftList,
  IAllBondData,
  info,
  IUserBond,
  redeemOneBond,
  trim,
  useBonds,
  useWeb3Context,
} from "@fantohm/shared-web3";
import { useEffect, useMemo, useState } from "react";
import { RootState } from "../../store";
import MyAccountActiveInvestmentsTable from "./my-account-active-investments-table";
import MyAccountDetailsTable from "./my-account-details-table";
import Investment from "./my-account-investments";
import AccountDetails from "./my-account-details";
import MyAccountActiveInvestmentsCards from "./my-account-active-investments-cards";
import { ConfirmationModal } from "./confirmation-modal";
import { NftItem } from "../backed-nft/nft/nft";

export const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

export function shorten(str: string) {
  if (str.length < 10) return str;
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export const isInvestment = (element: Investment | []): element is Investment => {
  return (element as Investment).type !== undefined;
};

export const MyAccount = (): JSX.Element => {
  const dispatch = useDispatch();
  const { provider, address, chainId, connected } = useWeb3Context();
  const { bonds } = useBonds(chainId ?? 250);
  const [openConfirmationModal, setOpenConfirmationModal] = useState<boolean>(false);
  const [cancellingBond, setCancellingBond] = useState<IAllBondData>();
  const [cancellingBondIndex, setCancellingBondIndex] = useState<number>(0);
  const [investmentsLoaded, setInvestmentsLoaded] = useState<boolean>(false);
  const isMediumScreen = useMediaQuery("(max-width: 1000px)");
  const [nftIds, setNftIds] = useState<Array<number>>([]);

  const usdbBalance = useSelector((state: RootState) => {
    return trim(Number(state.account.balances.usdb), 2);
  });

  useEffect(() => {
    if (!connected || !address) return;
    dispatch(
      getNftList({
        address,
        networkId: chainId ?? defaultNetworkId,
        callback: (list: Array<number>) => {
          setNftIds(list.reverse());
        },
      })
    );
  }, [connected, address, usdbBalance]);

  // is the wallet really disconnected or have we just not checked the cache?
  const hasCheckedConnection = useSelector(
    (state: RootState) => state.app.checkedConnection
  );

  const accountBonds = useSelector((state: RootState) => state.account.bonds);
  const accountBondsLoaded = useSelector(
    (state: RootState) => state.account.allBondsLoaded
  );

  const activeInvestments: Investment[] | null = useMemo(() => {
    if (accountBonds && accountBondsLoaded && chainId) {
      // set timeout on setting the readystate to avoid additional render
      return bonds.flatMap((bond) => {
        const bondName = bond.name;
        const accountBond = accountBonds[bondName];
        if (accountBond) {
          const userBonds = accountBond.userBonds;
          return userBonds.map((userBond: IUserBond, i: number) => {
            const investment: Investment = {
              id: `investment-${bond.name}-${i}`,
              type: bond.type,
              amount: Number(userBond.amount),
              rewards: Number(userBond.rewards),
              rewardToken: userBond.rewardToken,
              rewardsInUsd: Number(userBond.rewardsInUsd),
              bondName: bond.name,
              bondIndex: i,
              displayName: bond.displayName,
              roi: bond.roi + "",
              term: Number(bond.vestingTerm),
              termType: "months",
              secondsToVest: userBond.secondsToVest,
              percentVestedFor: userBond.percentVestedFor,
              vestDate: Number(userBonds[i].bondMaturationBlock),
            };
            return investment;
          });
        } else {
          return [];
        }
      });
    } else {
      return null;
    }
  }, [JSON.stringify(accountBonds), JSON.stringify(bonds), accountBondsLoaded]);

  useEffect(() => {
    if (activeInvestments && accountBondsLoaded) {
      setInvestmentsLoaded(true);
    } else {
      setInvestmentsLoaded(false);
    }
  }, [activeInvestments, accountBondsLoaded]);

  const accountDetails: AccountDetails | null = useMemo(() => {
    if (address && activeInvestments) {
      return {
        address,
        balance: activeInvestments.reduce(
          (balance, investment) => balance + investment.amount,
          0
        ),
        rewardsClaimed: 1247.31, // TODO
        claimableRewards: activeInvestments
          .filter((investment) => investment.secondsToVest <= 0)
          .reduce(
            (rewardsInUsd, investment) => rewardsInUsd + investment.rewardsInUsd,
            0
          ),
      };
    } else {
      return null;
    }
  }, [address, JSON.stringify(activeInvestments)]);

  const onConfirmCancelBond = (bond: IAllBondData, index: number) => {
    setCancellingBond(bond);
    setCancellingBondIndex(index);
    setOpenConfirmationModal(true);
  };

  const onCancelBond = async () => {
    setOpenConfirmationModal(false);
    if (provider && chainId && cancellingBond) {
      await dispatch(
        cancelBond({
          networkId: chainId,
          address,
          bond: cancellingBond,
          provider,
          index: cancellingBondIndex,
        })
      );
    }
  };

  const closeConfirmModal = () => {
    setOpenConfirmationModal(false);
  };

  const onRedeemBond = async (bond: IAllBondData, index: number) => {
    if (provider && chainId) {
      await dispatch(
        redeemOneBond({
          networkId: chainId,
          address,
          bond: bond,
          provider,
          autostake: false,
        })
      );
    }
  };

  const onRedeemAll = async () => {
    if (provider && chainId) {
      for (const bond of bonds) {
        if (activeInvestments === null) return;
        const currentInvests = activeInvestments.filter(
          (investment) =>
            investment.bondName === bond.name && investment.secondsToVest <= 0
        );
        if (currentInvests.length === 0) continue;

        if (bond.type === BondType.TRADFI) {
          await dispatch(
            redeemOneBond({
              networkId: chainId!,
              address,
              bond,
              provider: provider!,
              autostake: false,
            })
          );
        } else if (
          bond.type === BondType.SINGLE_SIDED ||
          bond.type === BondType.SINGLE_SIDED_V1
        ) {
          const { amount } = currentInvests[0];
          await dispatch(
            claimSingleSidedBond({
              value: String(amount),
              networkId: chainId!,
              address,
              bond,
              provider: provider!,
            })
          );
        }
      }
      dispatch(info("Claim all completed."));
    }
  };

  if (!address)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          px: "20px",
          minHeight: { xs: "150px", sm: "calc(100% - 470px)" },
        }}
      >
        <h1 style={{ textAlign: "center" }}>
          {hasCheckedConnection ? "Connect your wallet to view My Account" : "Loading..."}
        </h1>
      </Box>
    );
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <ConfirmationModal
        open={openConfirmationModal}
        closeConfirmModal={closeConfirmModal}
        onCancelBond={onCancelBond}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          paddingTop: "100px",
          paddingLeft: "50px",
          paddingRight: "50px",
          width: "100%",
          maxWidth: "1200px",
        }}
        className={style["hero"]}
      >
        <Box>
          <Typography variant="subtitle1">
            My Account{" "}
            <span style={{ color: "#858E93" }}>
              ({accountDetails && shorten(accountDetails.address)})
            </span>
          </Typography>
          {accountDetails && (
            <MyAccountDetailsTable
              accountDetails={accountDetails}
              onRedeemAll={onRedeemAll}
            />
          )}
        </Box>
        <Box my={4}>
          <Typography variant="subtitle1">
            Active Investments ({activeInvestments ? activeInvestments.length : "..."})
          </Typography>
          {activeInvestments && activeInvestments.length > 0 ? (
            <Box>
              {(isMediumScreen && (
                <MyAccountActiveInvestmentsCards
                  investments={activeInvestments}
                  onRedeemBond={onRedeemBond}
                  onConfirmCancelBond={onConfirmCancelBond}
                />
              )) || (
                <MyAccountActiveInvestmentsTable
                  investments={activeInvestments}
                  onRedeemBond={onRedeemBond}
                  onConfirmCancelBond={onConfirmCancelBond}
                />
              )}
            </Box>
          ) : (
            <Box>
              <Paper
                elevation={0}
                sx={{ marginTop: "10px" }}
                className={style["rowCard"]}
              >
                {investmentsLoaded ? (
                  <Typography variant="h6">You have no active investments</Typography>
                ) : (
                  <Typography variant="h6">Loading investments</Typography>
                )}
              </Paper>
            </Box>
          )}
        </Box>

        <Box my={4} id="nft-investments">
          <Typography variant="subtitle1">
            Nft Investments ({nftIds ? nftIds.length : "..."})
          </Typography>
          <Box className="w100" flex={1}>
            {nftIds.map((id: number) => (
              <Grid container flex={1} key={`${id}`}>
                <Grid item xs={12} md={3}></Grid>
                <Grid item xs={12} md={6}>
                  <NftItem nftId={id} />
                </Grid>
              </Grid>
            ))}
          </Box>
        </Box>
        {/* Hide previous investments until ready on the graph */}
        {/* <Box>
          <Typography variant="subtitle1">
            Previous Investments ({inactiveInvestments.length})
          </Typography>
          <MyAccountInactiveInvestmentsTable investments={inactiveInvestments} />
        </Box> */}
      </Box>
    </Box>
  );
};

export default MyAccount;
