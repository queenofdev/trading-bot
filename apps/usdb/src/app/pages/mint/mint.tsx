import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  bondAsset,
  changeApproval,
  error,
  IAllBondData,
  IBondAssetAsyncThunk,
  isPendingTxn,
  trim,
  txnButtonText,
  useBonds,
  useWeb3Context,
  getTokenPrice,
  allBonds,
  Bond,
  redeemBondUsdb,
  IRedeemBondAsyncThunk,
  defaultNetworkId,
} from "@fantohm/shared-web3";
import { noBorderOutlinedInputStyles } from "@fantohm/shared-ui-themes";
import {
  DaiToken,
  FHMToken,
  DarkCarouselDai0,
  DarkCarouselDai1,
  DarkCarouselDai2,
  LightCarouselDai0,
  LightCarouselDai1,
  LightCarouselDai2,
  DarkCarouselFhm0,
  DarkCarouselFhm1,
  DarkCarouselFhm2,
  LightCarouselFhm0,
  LightCarouselFhm1,
  LightCarouselFhm2,
} from "@fantohm/shared/images";
import {
  Box,
  Grid,
  Button,
  Paper,
  OutlinedInput,
  InputAdornment,
  Typography,
  Icon,
  useMediaQuery,
} from "@mui/material";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useNavigate } from "react-router-dom";
import Carousel from "react-material-ui-carousel";

import style from "./mint.module.scss";
import { RootState } from "../../store";

export default function Mint() {
  const outlinedInputClasses = noBorderOutlinedInputStyles();
  const navigate = useNavigate();

  const { provider, address, connected, connect, chainId, switchEthereumChain } =
    useWeb3Context();
  const dispatch = useDispatch();
  const [tabState, setTabState] = React.useState(true);
  const [daiPrice, setDaiPrice] = React.useState(0);
  const [fhmPrice, setFhmPrice] = React.useState(0);
  const { bonds } = useBonds(chainId || 250);
  const [bond, setBond] = useState(
    allBonds.filter((bond) => bond.name === "usdbBuy")[0] as Bond
  );
  const [usdbBondData, setUsdbBondData] = useState(
    bonds.filter((bond) => bond.name === "usdbBuy")[0] as IAllBondData
  );
  const [allowance, setAllowance] = React.useState(false);
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState(DaiToken);
  const themeType = useSelector((state: RootState) => state.app.theme);
  const tokenBalance = useSelector((state: any) => {
    return state.account.balances;
  });
  const accountBonds = useSelector((state: RootState) => {
    return state.account.bonds;
  });

  const ableToBond =
    bond.isAvailable[chainId ?? 250] && !bond?.isCircuitBroken && bond.isPurchasable;
  const selectedAccountBond = accountBonds[bond.name];

  const isTabletScreen = useMediaQuery("(max-width: 970px)");

  const token = [
    {
      title: "Mint with DAI",
      name: "DAI",
      total: tokenBalance.dai,
      price: daiPrice,
      darkBanner: [
        {
          text: "Mint USDB to unlock the full potential of DeFi.",
          location: "center",
          img: DarkCarouselDai0,
        },
        {
          text: "USDB is dependable for business solutions and stable for investor confidence.",
          img: DarkCarouselDai1,
        },
        {
          text: "USDB is an algorithmic stablecoin catered to the needs DeFi of savvy investors, produced by a team obsessed with adoption.",
          img: DarkCarouselDai2,
        },
      ],
      lightBanner: [
        {
          text: "Mint USDB to unlock the full potential of DeFi.",
          location: "center",
          img: LightCarouselDai0,
        },
        {
          text: "USDB is dependable for business solutions and stable for investor confidence.",
          img: LightCarouselDai1,
        },
        {
          text: "USDB is an algorithmic stablecoin catered to the needs DeFi of savvy investors, produced by a team obsessed with adoption.",
          img: LightCarouselDai2,
        },
      ],
    },
    {
      title: "Mint with FHM",
      name: "FHM",
      total: tokenBalance.fhm,
      price: fhmPrice,
      darkBanner: [
        {
          text: "Minting USDB with FHM helps the protocol in sustaining long term growth potential and its a long term investment strategy",
          img: DarkCarouselFhm0,
        },
        {
          text: "Using FHM to mint USDB helps utilize idle assets in the treasury for asset purchases without affecting market price",
          img: DarkCarouselFhm1,
        },
        {
          text: "Minted by burning FHM, an asset built to capture value during all market conditions.",
          img: DarkCarouselFhm2,
        },
      ],
      lightBanner: [
        {
          text: "Minting USDB with FHM helps the protocol in sustaining long term growth potential and its a long term investment strategy",
          img: LightCarouselFhm0,
        },
        {
          text: "Using FHM to mint USDB helps utilize idle assets in the treasury for asset purchases without affecting market price",
          img: LightCarouselFhm1,
        },
        {
          text: "Minted by burning FHM, an asset built to capture value during all market conditions.",
          img: LightCarouselFhm2,
        },
      ],
    },
  ];

  useEffect(() => {
    async function fetchPrice() {
      setDaiPrice(await getTokenPrice("dai"));
      setFhmPrice(await getTokenPrice("fantohm"));
      fetchPrice().then();
    }
  }, []);

  const changeNetworks = async (chainId: number) => {
    if (!switchEthereumChain) return;
    const result = await switchEthereumChain(chainId || defaultNetworkId);
    if (!result) {
      const errorMessage =
        "Unable to switch networks. Please change network using provider.";
      console.error(errorMessage);
      dispatch(error(errorMessage));
    }
  };

  const pendingTransactions = useSelector((state: RootState) => {
    return state?.pendingTransactions;
  });

  const onSeekApproval = async () => {
    if (provider) {
      dispatch(
        changeApproval({ address, bond: bond, provider, networkId: chainId ?? 250 })
      );
    }
  };

  useEffect(() => {
    if (tabState) {
      setAllowance(
        (bonds.filter((bond) => bond.name === "usdbBuy")[0] as IAllBondData)?.allowance >
          0
      );
    } else {
      setAllowance(
        (bonds.filter((bond) => bond.name === "usdbFhmBurn")[0] as IAllBondData)
          ?.allowance > 0
      );
    }
  }, [bonds, usdbBondData, usdbBondData?.allowance]);

  const selectedToken = tabState ? token[0] : token[1];

  async function handleMint() {
    if (Number(quantity) === 0) {
      await dispatch(error("Please enter a value!"));
    } else if (isNaN(Number(quantity))) {
      await dispatch(error("Please enter a valid value!"));
    } else if (Number(quantity) > selectedToken.total) {
      await dispatch(error("Please enter a valid value!"));
    } else {
      dispatch(
        bondAsset({
          address,
          slippage: 0.005,
          value: quantity.toString(),
          provider,
          networkId: chainId,
          bond: bond,
        } as IBondAssetAsyncThunk)
      );
    }
  }

  async function handleRedeem() {
    dispatch(
      redeemBondUsdb({
        address,
        provider,
        networkId: chainId,
        bond: bond,
      } as IRedeemBondAsyncThunk)
    );
  }

  function setBondState(bool: boolean) {
    if (bool) {
      setUsdbBondData(bonds.filter((bond) => bond.name === "usdbBuy")[0] as IAllBondData);
      setBond(allBonds.filter((bond) => bond.name === "usdbBuy")[0] as Bond);
      setImage(DaiToken);
    } else {
      setUsdbBondData(
        bonds.filter((bond) => bond.name === "usdbFhmBurn")[0] as IAllBondData
      );
      setBond(allBonds.filter((bond) => bond.name === "usdbFhmBurn")[0] as Bond);
      setImage(FHMToken);
    }
    setTabState(bool);
  }

  const setMax = () => {
    if (selectedToken === token[0]) {
      setQuantity(tokenBalance.dai);
    } else {
      setQuantity(tokenBalance.fhm);
    }
  };

  const goToMyAccount = () => {
    setTimeout(() => navigate("/my-account"), 200);
  };

  return (
    <Box className={style["hero"]}>
      <div className={style["tabContent"]}>
        <Button
          className={style["tapButton"]}
          variant="text"
          onClick={() => setBondState(true)}
          style={{
            borderBottom: `${
              tabState ? `solid 4px ${themeType === "light" ? "black" : "white"}` : "none"
            }`,
          }}
        >
          Mint with DAI
        </Button>
        <Button
          variant="text"
          className={style["tapButton"]}
          onClick={() => setBondState(false)}
          style={{
            borderBottom: `${
              tabState ? "none" : `solid 4px ${themeType === "light" ? "black" : "white"}`
            }`,
          }}
        >
          Mint with FHM
        </Button>
      </div>
      <Grid container spacing={8} className={style["cardGrid"]}>
        <Grid item md={6} sx={{ width: "100%" }}>
          <Box
            className={style["subCardBorder"]}
            sx={{
              borderRadius: "20px",
              background: `${themeType === "light" ? "white" : "black"}`,
            }}
          >
            <Carousel
              sx={{ width: "100%", height: { xs: "330px", md: "550px" } }}
              indicatorContainerProps={{
                style: {
                  position: "absolute",
                  bottom: "15px",
                  zIndex: "1000",
                },
              }}
              indicatorIconButtonProps={{
                style: {
                  color: themeType === "light" ? "#877979" : "#808080",
                },
              }}
              activeIndicatorIconButtonProps={{
                style: {
                  color: themeType === "light" ? "black" : "white",
                },
              }}
            >
              {selectedToken[themeType === "light" ? "lightBanner" : "darkBanner"].map(
                (item: any, index: number) => (
                  <Box
                    display="flex"
                    justifyContent="center"
                    key={`${themeType}_${selectedToken.title}_${index}`}
                    sx={{
                      backgroundImage: `url(${item.img})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      width: "100%",
                      height: {
                        xs: "330px",
                        md: "550px",
                        borderRadius: "20px",
                      },
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="center"
                      sx={{
                        alignItems: item?.location === "center" ? "center" : "end",
                        px: `${isTabletScreen ? "10px" : "0"}`,
                        width: { xs: "100%", md: "70%" },
                        paddingBottom:
                          item?.location === "center"
                            ? "0"
                            : `${isTabletScreen ? "35px" : "100px"}`,
                      }}
                    >
                      <Box display="flex">
                        <Icon
                          component={InfoOutlinedIcon}
                          fontSize={isTabletScreen ? "small" : "medium"}
                          sx={{
                            mt: `${isTabletScreen ? "1px" : "3px"}`,
                            mr: `${isTabletScreen ? "5px" : "10px"}`,
                          }}
                        />
                        <Typography
                          variant={isTabletScreen ? "subtitle2" : "h6"}
                          color="primary"
                        >
                          {item.text}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )
              )}
            </Carousel>
          </Box>
        </Grid>
        <Grid item md={6} sx={{ width: "100%" }}>
          <Paper className={`${style["subCard"]} ${style["subCardBorder"]}`}>
            <SettingsOutlinedIcon
              onClick={goToMyAccount}
              className={style["settingIcon"]}
            />
            <div className={style["subTitle"]}>{selectedToken.title}</div>
            <Grid container spacing={1}>
              <Grid item md={4} xs={12}>
                <div className={style["roundArea"]}>
                  <img
                    src={image}
                    className={style["daiIcon"]}
                    style={{ marginRight: "10px" }}
                    alt={selectedToken.title}
                  />
                  <div className={style["tokenInfo"]}>
                    <div className={style["tokenName"]}>{selectedToken.name}</div>
                    <div className={style["tokenValue"]}>
                      {trim(selectedToken.total, 9)}
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item md={8} xs={12}>
                <Box className={style["roundArea"]}>
                  <OutlinedInput
                    id="amount-input-lqdr"
                    type="number"
                    placeholder="Enter an amount"
                    className="w100"
                    classes={outlinedInputClasses}
                    value={quantity}
                    onChange={(e) => {
                      if (Number(e.target.value) < 0 || e.target.value === "-") return;
                      setQuantity(e.target.value);
                    }}
                    inputProps={{
                      classes: {
                        notchedOutline: {
                          border: "none",
                        },
                      },
                    }}
                    startAdornment={
                      <InputAdornment position="end">
                        <Button
                          className={style["no-padding"]}
                          variant="text"
                          onClick={setMax}
                          color="primary"
                        >
                          Max
                        </Button>
                      </InputAdornment>
                    }
                  />
                </Box>
              </Grid>
            </Grid>
            <div className={style["reward"]}>
              <div>You will Get</div>
              <div>{(selectedToken.price * Number(quantity)).toFixed(3)} USDB</div>
            </div>
            <div style={{ marginTop: "30px" }}>
              {!connected ? (
                <Button
                  variant="contained"
                  color="primary"
                  id="bond-btn"
                  onClick={() => connect(true)}
                >
                  Connect Wallet
                </Button>
              ) : !ableToBond ? (
                selectedAccountBond?.userBonds.length > 0 &&
                Number(selectedAccountBond?.userBonds[0].amount) > 0 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    id="bond-btn"
                    disableElevation
                    onClick={handleRedeem}
                    disabled={isPendingTxn(pendingTransactions, "redeem_" + bond?.name)}
                  >
                    {txnButtonText(
                      pendingTransactions,
                      "redeem_" + bond?.name,
                      "Sold Out"
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    id="bond-btn"
                    disabled={true}
                  >
                    Sold Out
                  </Button>
                )
              ) : allowance ? (
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Button
                    color="primary"
                    variant="contained"
                    disableElevation
                    onClick={handleMint}
                    disabled={isPendingTxn(pendingTransactions, "deposit_" + bond?.name)}
                    className={style["mintButton"]}
                    sx={{
                      mb: "20px",
                    }}
                  >
                    {txnButtonText(
                      pendingTransactions,
                      "deposit_" + bond?.name,
                      "Mint USDB"
                    )}
                  </Button>
                  {selectedAccountBond?.userBonds.length > 0 &&
                    Number(selectedAccountBond?.userBonds[0].amount) > 0 && (
                      <Button
                        color="primary"
                        variant="contained"
                        disableElevation
                        onClick={handleRedeem}
                        disabled={isPendingTxn(
                          pendingTransactions,
                          "redeem_" + bond?.name
                        )}
                        className={style["mintButton"]}
                      >
                        {txnButtonText(
                          pendingTransactions,
                          "redeem_" + bond?.name,
                          "Redeem"
                        )}
                      </Button>
                    )}
                </Box>
              ) : (
                <Button
                  color="primary"
                  variant="contained"
                  className={style["mintButton"]}
                  disabled={isPendingTxn(pendingTransactions, "approve_" + bond?.name)}
                  onClick={onSeekApproval}
                >
                  {txnButtonText(pendingTransactions, "approve_" + bond?.name, "Approve")}
                </Button>
              )}
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
