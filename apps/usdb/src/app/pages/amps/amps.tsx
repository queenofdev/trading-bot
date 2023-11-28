import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { noBorderOutlinedInputStyles } from "@fantohm/shared-ui-themes";
import { Box, Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import style from "./amps.module.scss";
import { RootState } from "../../store";
import StakingCard from "./staking/card";
import RedeemCard from "./redeem/card";
import StakeModal from "./staking/stake-modal";

import imgBondDiscount from "../../../assets/images/amps/bond-discount.png";
import imgFhmStaking from "../../../assets/images/amps/fhm-staking.png";
import imgGetJail from "../../../assets/images/amps/get-jail.png";
import imgLending from "../../../assets/images/amps/lending.png";
import imgBackedNft from "../../../assets/images/amps/backed-nft.png";
import imgNftFees from "../../../assets/images/amps/nft-fees.png";
import imgMonopoly from "../../../assets/images/amps/monopoly.png";
import imgNftFeature from "../../../assets/images/amps/nft-feature.png";
import {
  allBonds,
  amptRedeemNft,
  BondType,
  defaultNetworkId,
  getStakedInfo,
  IAllBondData,
  unstakeNft,
  useWeb3Context,
} from "@fantohm/shared-web3";

export default function Amps() {
  const { provider, address, chainId, connect, disconnect, connected } = useWeb3Context();
  const balance = useSelector((state: RootState) => {
    return state.account.balances;
  });

  const themeType = useSelector((state: RootState) => state.app.theme);

  const [tabIndex, setTabIndex] = useState(0);
  const [stakingType, setStakingType] = useState(1);

  const [stakedStatus, setStakedStatus] = useState([false, false, false]);
  const [stakedType, setStakedType] = useState(-1);
  const [isShowStakingModal, setShowStakingModal] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!connected || !address || !provider) return;
    [1, 2, 3].forEach((index) => {
      const bondData = allBonds.filter(
        (pool) => pool.type === BondType.STAKE_NFT && pool.days === index
      )[0] as IAllBondData;
      dispatch(
        getStakedInfo({
          type: index,
          address,
          networkId: chainId ?? defaultNetworkId,
          provider,
          bond: bondData,
          callback: (result: boolean) => {
            if (stakedStatus[index - 1] === result) return;
            const temp = JSON.parse(JSON.stringify(stakedStatus));
            temp[index - 1] = result;
            setStakedStatus(temp);
          },
        })
      );
    });
  }, [connected, address, balance]);

  useEffect(() => {
    const activeIndex = stakedStatus.indexOf(true);
    if (activeIndex === -1) setStakedType(-1);
    else setStakedType(activeIndex + 1);
  }, [stakedStatus]);

  const onStake = (type: number) => {
    if (!connected || !address || !provider) return;

    if (stakedType === type) {
      const bondData = allBonds.filter(
        (pool) => pool.type === BondType.STAKE_NFT && pool.days === type
      )[0] as IAllBondData;
      // Unstake
      dispatch(
        unstakeNft({
          type,
          address,
          bond: bondData,
          networkId: chainId ?? defaultNetworkId,
          provider,
        })
      );
      return;
    }
    setStakingType(type);
    setShowStakingModal(true);
  };

  const onRedeem = ({ method }: { method: string }) => {
    if (stakedType === -1) return;
    if (!connected || !address || !provider) return;

    const bondData = allBonds.filter(
      (pool) => pool.type === BondType.STAKE_NFT && pool.days === stakedType
    )[0] as IAllBondData;
    dispatch(
      amptRedeemNft({
        type: stakedType,
        address,
        method,
        bond: bondData,
        networkId: chainId ?? defaultNetworkId,
        provider,
      })
    );
  };

  const redeems = [
    {
      use: 1,
      title: "Bond Discount",
      image: imgBondDiscount,
      cost: 100,
      description: "1% discount (capped at 10%)",
      method: "redeemBondDiscount",
    },
    {
      use: 1,
      title: "FHM Staking APY Boost",
      image: imgFhmStaking,
      cost: 500,
      description: "Get a 50% APY boost <br />when staking FHM",
      method: "redeemFhmStakingApy",
    },
    {
      use: 0,
      title: "Get Out of Jail NFT",
      image: imgGetJail,
      cost: 500,
      description: "Get a 50% APY boost <br />when staking FHM",
      method: "redeemGetoutOfJailNft",
    },
    {
      use: 0,
      title: "Lending & Borrowing",
      image: imgLending,
      cost: 750,
      description: "50% rate delta",
      method: "redeemLendingAndBorrowing",
    },
    {
      use: 0,
      title: "Backed NFT Rewards",
      image: imgBackedNft,
      cost: 750,
      description: "50% discount on NFTs",
      method: "redeemBackedNftRewards",
    },
    {
      use: 0,
      title: "NFT Marketplace Fees",
      image: imgNftFees,
      cost: 750,
      description: "Get a 50% discount at <br />the USDB NFT marketplace",
      method: "redeemNftMarketplaceFees",
    },
    {
      use: 0,
      title: "Monopoly Man NFT",
      image: imgMonopoly,
      cost: 1000,
      description: "10% USDB boost in staked NFT",
      method: "redeemMonopolyManNft",
    },
    {
      use: 0,
      title: "NFT Marketplace Feature Page",
      image: imgNftFeature,
      cost: -1,
      description: "Landing page placement",
      method: "redeemNftMarketplaceFeaturePage",
    },
  ];

  return (
    <Box className={style["hero"]}>
      <div className={style["tabContent"]}>
        <Button
          className={style["tapButton"]}
          variant="text"
          onClick={() => setTabIndex(0)}
          style={{
            borderBottom: `${
              tabIndex === 0
                ? `solid 4px ${themeType === "light" ? "black" : "white"}`
                : "none"
            }`,
          }}
        >
          Staking
        </Button>
        <Button
          variant="text"
          className={style["tapButton"]}
          onClick={() => setTabIndex(1)}
          style={{
            borderBottom: `${
              tabIndex === 0
                ? "none"
                : `solid 4px ${themeType === "light" ? "black" : "white"}`
            }`,
          }}
        >
          Redeem
        </Button>
      </div>
      {tabIndex === 0 && (
        <Grid container spacing={8} className={style["cardGrid"]}>
          <StakingCard
            title="No lock up"
            index={1}
            onStake={() => onStake(1)}
            stakedType={stakedType}
          />
          <StakingCard
            title="360 day lock up"
            index={2}
            onStake={() => onStake(2)}
            stakedType={stakedType}
          />
          <StakingCard
            title="720 day lock up"
            index={3}
            onStake={() => onStake(3)}
            stakedType={stakedType}
          />
        </Grid>
      )}

      {tabIndex === 1 && (
        <Grid container spacing={8} className={style["cardGrid"]}>
          {redeems.map((item) => (
            <RedeemCard
              {...item}
              stakedType={stakedType}
              onRedeem={() => onRedeem({ method: item.method! })}
            />
          ))}
        </Grid>
      )}

      <StakeModal
        type={stakingType}
        open={isShowStakingModal}
        closeModal={() => setShowStakingModal(false)}
      />
    </Box>
  );
}
