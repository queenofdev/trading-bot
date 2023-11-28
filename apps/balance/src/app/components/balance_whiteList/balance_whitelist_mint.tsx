import { addressEllipsis } from "@fantohm/shared-helpers";
import { isDev, NetworkIds, useWeb3Context } from "@fantohm/shared-web3";
import {
  AboutDivider,
  DownLine,
  NumberImage1,
  NumberImage2,
  NumberImage3,
  NumberImage4,
  OpenSeaImage,
  preMintImage,
} from "@fantohm/shared/images";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { MouseEvent, useMemo, useState, useEffect } from "react";
import style from "./balance_whitelist_mint.module.scss";
import { useBPGetProof } from "../../hooks/use-balance-pass-api";
import {
  bpContractAddress,
  useBpGetTimestampsQuery,
  useBpGetTotalSupplyQuery,
  useBpGetWalletBalanceQuery,
  useBpMintMutation,
} from "../../hooks/use-balance-pass-contract";

/* eslint-disable-next-line */
export interface BalanceWhitelistMintProps {}

export const BalanceWhitelistMintPage = (
  props: BalanceWhitelistMintProps
): JSX.Element => {
  const { connect, disconnect, connected, address, chainId } = useWeb3Context();

  const { data: proofData, isLoading: isProofLoading } = useBPGetProof(address);

  const [countDown, setCountDown] = useState<number>(0);
  const [countdownTimestamp, setCountdownTimestamp] = useState<number>(1662400800 * 1000);

  const {
    data: timestampData,
    isLoading: isCountdownLoading,
    error: tsError,
  } = useBpGetTimestampsQuery();

  useEffect(() => {
    console.log("tsError", tsError);
  }, [tsError]);

  const { data: walletBalance, isLoading: isWalletBalanceLoading } =
    useBpGetWalletBalanceQuery();

  const { data: totalSupply, isLoading: isTotalSupplyLoading } =
    useBpGetTotalSupplyQuery();

  const { mutation: mintNft } = useBpMintMutation({
    proof1: proofData?.wl === 1 ? proofData?.proof : [],
    proof2: proofData?.wl === 2 ? proofData?.proof : [],
  });

  // using the timestamp and proof data, calculate the timestamp for the countdown
  useEffect(() => {
    console.log("timestampData", timestampData);
    console.log("proofData", proofData);
    if (!timestampData) return;
    switch (proofData?.wl) {
      case 1:
        setCountdownTimestamp(timestampData.whitelist1Timestamp * 1000);
        break;
      case 2:
        setCountdownTimestamp(timestampData.whitelist2Timestamp * 1000);
        break;
      default:
        setCountdownTimestamp(timestampData.publicTimestamp * 1000);
    }
  }, [
    timestampData?.whitelist1Timestamp,
    timestampData?.whitelist2Timestamp,
    timestampData?.publicTimestamp,
    proofData?.wl,
  ]);

  const onClickConnect = (event: MouseEvent<HTMLButtonElement>) => {
    console.log("connect", isDev);
    connect(true, isDev ? NetworkIds.Rinkeby : NetworkIds.Ethereum);
  };

  const onClickDisconnect = () => {
    disconnect();
  };

  //
  const isWhitelisted = useMemo(() => {
    return !isProofLoading && proofData && proofData?.proof.length > 0;
  }, [isProofLoading, proofData?.wl]);

  const useCountdown = () => {
    useEffect(() => {
      const interval = setInterval(() => {
        if (countdownTimestamp >= new Date().getTime()) {
          setCountDown(countdownTimestamp - new Date().getTime());
        } else {
          setCountDown(0);
        }
      }, 1000);

      return () => clearInterval(interval);
    }, [countdownTimestamp]);

    return getReturnValues(countDown ?? 0);
  };

  const getReturnValues = (countDown: number) => {
    // calculate time left
    const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
    const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

    return [days, hours, minutes, seconds];
  };

  const [days, hours, minutes, seconds] = useCountdown();

  async function handleMint() {
    mintNft.mutate();
  }

  return (
    <Box>
      <Container maxWidth="xl">
        <Grid
          container
          columnSpacing={2}
          rowSpacing={{ xs: 4, md: 0 }}
          sx={{ mt: { md: "100px", xs: "50px" } }}
        >
          <Grid item md={6} xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                src={preMintImage}
                alt="PreMintPage"
                style={{ width: "100%", border: "1px solid", borderRadius: "25px" }}
              ></img>
            </Box>
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "MonumentExtendedRegular",
                fontSize: { md: "45px", xs: "40px" },
                color: "#dee9ff",
                mt: "5%",
                textAlign: "center",
              }}
            >
              Balance Alpha Pass
            </Typography>
            <Typography
              sx={{
                fontFamily: "sequel100black-55",
                fontSize: { md: "19px", xs: "18px" },
                color: "#8fa0c3",
                letterSpacing: "0.3em",
                mt: "10%",
                textAlign: "center",
              }}
            >
              {!isProofLoading &&
                !isCountdownLoading &&
                countDown > 0 &&
                proofData &&
                `TIME UNTIL WHITELIST ${proofData?.wl} MINT`}
              {!isProofLoading &&
                !isCountdownLoading &&
                countDown > 0 &&
                !proofData &&
                "TIME UNTIL PUBLIC MINT"}
              {!connected && "TIME UNTIL MINTING OPENS"}
              {!isProofLoading &&
                !isCountdownLoading &&
                countDown <= 0 &&
                "MINTING OPEN NOW"}
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", mt: "7%" }}>
              <Box
                sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}
              >
                <Typography
                  sx={{
                    fontFamily: "MonumentExtendedRegular",
                    fontSize: { md: "64px", xs: "30px" },
                    color: "#dee9ff",
                  }}
                >
                  {days && days < 10 ? `0${days}` : days}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "sequel100black-55",
                    fontSize: { md: "14px", xs: "8px" },
                    color: "#8fa0c3",
                    letterSpacing: "0.3em",
                  }}
                >
                  Days
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontFamily: "MonumentExtendedRegular",
                  fontSize: { md: "64px", xs: "30px" },
                  color: "#dee9ff",
                  ml: "4%",
                  mr: "4%",
                }}
              >
                :
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}
              >
                <Typography
                  sx={{
                    fontFamily: "MonumentExtendedRegular",
                    fontSize: { md: "64px", xs: "30px" },
                    color: "#dee9ff",
                  }}
                >
                  {hours && hours < 10 ? `0${hours}` : hours}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "sequel100black-55",
                    fontSize: { md: "14px", xs: "8px" },
                    color: "#8fa0c3",
                    letterSpacing: "0.3em",
                  }}
                >
                  Hours
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontFamily: "MonumentExtendedRegular",
                  fontSize: { md: "64px", xs: "30px" },
                  color: "#dee9ff",
                  ml: "4%",
                  mr: "4%",
                }}
              >
                :
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}
              >
                <Typography
                  sx={{
                    fontFamily: "MonumentExtendedRegular",
                    fontSize: { md: "64px", xs: "30px" },
                    color: "#dee9ff",
                  }}
                >
                  {minutes && minutes < 10 ? `0${minutes}` : minutes}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "sequel100black-55",
                    fontSize: { md: "14px", xs: "8px" },
                    color: "#8fa0c3",
                    letterSpacing: "0.3em",
                  }}
                >
                  Minutes
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontFamily: "MonumentExtendedRegular",
                  fontSize: { md: "64px", xs: "30px" },
                  color: "#dee9ff",
                  ml: "4%",
                  mr: "4%",
                }}
              >
                :
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}
              >
                <Typography
                  sx={{
                    fontFamily: "MonumentExtendedRegular",
                    fontSize: { md: "64px", xs: "30px" },
                    color: "#dee9ff",
                  }}
                >
                  {seconds && seconds < 10 ? `0${seconds}` : seconds}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "sequel100black-55",
                    fontSize: { md: "14px", xs: "8px" },
                    color: "#8fa0c3",
                    letterSpacing: "0.3em",
                  }}
                >
                  Seconds
                </Typography>
              </Box>
            </Box>
            {!isProofLoading &&
              !isCountdownLoading &&
              !isTotalSupplyLoading &&
              (totalSupply ?? 0) < 350 && (
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    mt: "50px",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      mr: { md: "10%", xs: "5%" },
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "MonumentExtendedRegular",
                        fontSize: { md: "55px", xs: "32px" },
                        color: "#dee9ff",
                      }}
                    >
                      {350 - (totalSupply ?? 0)}/350
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "sequel100black-55",
                        fontSize: { md: "14px", xs: "12px" },
                        color: "#8fa0c3",
                        letterSpacing: "0.3em",
                      }}
                    >
                      Remaining
                    </Typography>
                  </Box>
                  <img
                    src={DownLine}
                    alt="down line"
                    className={style["dropLineSection"]}
                  ></img>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      ml: { md: "10%", xs: "5%" },
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "MonumentExtendedRegular",
                        fontSize: { md: "55px", xs: "32px" },
                        color: "#dee9ff",
                      }}
                    >
                      Free
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "sequel100black-55",
                        fontSize: { md: "14px", xs: "12px" },
                        color: "#8fa0c3",
                        letterSpacing: "0.3em",
                      }}
                    >
                      Price
                    </Typography>
                  </Box>
                </Box>
              )}
            {!!totalSupply && totalSupply === 350 && (
              <Typography
                sx={{
                  fontFamily: "MonumentExtendedRegular",
                  fontSize: "55px",
                  color: "#dee9ff",
                  mt: "30px",
                  textAlign: "center",
                }}
              >
                SOLD OUT
              </Typography>
            )}

            {!connected && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  mt: { md: "7%", xs: "15%" },
                }}
              >
                <Typography>Connect to verify your whitelist status</Typography>
                <Button
                  variant="contained"
                  onClick={onClickConnect}
                  sx={{
                    display: { md: "flex" },
                    width: { md: "35%", xs: "50%" },
                    fontSize: { md: "19px", xs: "14px" },
                    backgroundColor: "#3744e6",
                    color: "white",
                    fontFamily: "sora",
                    mt: "1em",
                  }}
                  className={style["heroLink"]}
                >
                  Connect Wallet
                </Button>
                <Typography sx={{ width: { md: "50%", xs: "50%" }, color: "#8fa0c3" }}>
                  Hint: If you don't see your wallet whitelisted and it should be, try to
                  switch to different wallet and return back in MetaMask.
                </Typography>
              </Box>
            )}
            {connected && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    mt: { md: "7%", xs: "15%" },
                  }}
                >
                  {proofData && proofData?.wl > 0 && (
                    <Typography>You are on whitelist {proofData?.wl}</Typography>
                  )}
                  {chainId && !bpContractAddress.get(chainId) && (
                    <Typography sx={{ color: "red" }}>
                      You must be connected to the Ethereum Mainnet to Mint.
                    </Typography>
                  )}
                  <Button
                    variant="contained"
                    onClick={onClickDisconnect}
                    sx={{
                      display: { md: "flex" },
                      width: { md: "35%", xs: "50%" },
                      fontSize: { md: "19px", xs: "14px" },
                      backgroundColor: "#3744e6",
                      color: "white",
                      fontFamily: "sora",
                      mt: "1em",
                    }}
                    className={style["heroLink"]}
                  >
                    Disconnect : {addressEllipsis(address)}
                  </Button>
                </Box>
                {address &&
                  !isProofLoading &&
                  !isCountdownLoading &&
                  !isWalletBalanceLoading &&
                  !isTotalSupplyLoading &&
                  walletBalance === 0 &&
                  (totalSupply ?? 0) < 350 &&
                  countDown < 1 && (
                    <Button
                      variant="contained"
                      disabled={mintNft.isLoading || countDown > 0}
                      onClick={handleMint}
                      sx={{
                        display: { md: "flex" },
                        width: { md: "35%", xs: "50%" },
                        fontSize: { md: "19px", xs: "14px" },
                        backgroundColor: "#3744e6",
                        color: "white",
                        fontFamily: "sora",
                        mt: { md: "7%", xs: "15%" },
                      }}
                      className={style["heroLink"]}
                    >
                      Mint {mintNft.isLoading && <CircularProgress size={20} />}
                    </Button>
                  )}
                {!isWalletBalanceLoading && !!walletBalance && walletBalance > 0 && (
                  <Typography sx={{ mt: "2em" }}>
                    You have successfully minted your NFT!
                  </Typography>
                )}
                {!isProofLoading && !isCountdownLoading && countDown < 1 && (
                  <Button
                    variant="contained"
                    href="https://opensea.io/account"
                    sx={{
                      display: { md: "flex" },
                      width: { md: "40%", xs: "65%" },
                      fontSize: { md: "19px", xs: "14px" },
                      backgroundColor: "#3744e6",
                      color: "white",
                      fontFamily: "sora",
                      mt: { md: "2em", xs: "15%" },
                    }}
                  >
                    <img
                      src={OpenSeaImage}
                      alt="OpenSeaImage"
                      style={{ marginRight: "5%", width: "20%" }}
                    />
                    View on Opensea
                  </Button>
                )}
                {!isWhitelisted ? (
                  <Typography
                    sx={{
                      fontFamily: "sora",
                      fontSize: { md: "16px", xs: "12px" },
                      color: "#eb7676",
                      mt: "20px",
                    }}
                  >
                    *ADDRESS NOT WHITELISTED
                  </Typography>
                ) : (
                  ""
                )}
                <Typography
                  sx={{
                    fontFamily: "sora",
                    fontSize: { md: "16px", xs: "12px" },
                    color: "#8fa0c3",
                    width: { md: "52%", xs: "80%" },
                    textAlign: "center",
                    mt: "30px",
                  }}
                >
                  MAX 1 NFT PER WALLET. PRICE 0.00 ETH + GAS WL MINT IS LIVE FOR 60
                  MINUTES
                </Typography>
              </>
            )}
          </Grid>
        </Grid>
        <Box sx={{ mt: { md: "200px", xs: "100px" }, mb: { md: "200px", xs: "100px" } }}>
          <Typography
            sx={{
              fontFamily: "MonumentExtendedRegular",
              fontSize: { md: "45px", xs: "38px" },
              color: "#dee9ff",
              textAlign: "center",
            }}
          >
            How to Mint
          </Typography>
          <Grid
            container
            columnSpacing={2}
            rowSpacing={{ xs: 4, md: 0 }}
            sx={{ mt: { md: "50px", xs: "20px" } }}
          >
            <Grid
              item
              md={3}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center !important",
                mt: { xs: "20px" },
              }}
            >
              <img
                src={NumberImage1}
                alt="Number1"
                style={{ width: "66px", height: "69px" }}
              ></img>
              <Typography
                sx={{
                  fontFamily: "MonumentExtendedRegular",
                  fontSize: "23px",
                  color: "#dee9ff",
                  width: "60%",
                  ml: "10%",
                }}
              >
                Connect your Wallet
              </Typography>
            </Grid>
            <Grid
              item
              md={3}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center !important",
                mt: { xs: "20px" },
              }}
            >
              <img
                src={NumberImage2}
                alt="Number2"
                style={{ width: "66px", height: "69px" }}
              ></img>
              <Typography
                sx={{
                  fontFamily: "MonumentExtendedRegular",
                  fontSize: "23px",
                  color: "#dee9ff",
                  width: "60%",
                  ml: "10%",
                }}
              >
                Press the ‘Mint’ button
              </Typography>
            </Grid>
            <Grid
              item
              md={3}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center !important",
                mt: { xs: "20px" },
              }}
            >
              <img
                src={NumberImage3}
                alt="Number3"
                style={{ width: "66px", height: "69px" }}
              ></img>
              <Typography
                sx={{
                  fontFamily: "MonumentExtendedRegular",
                  fontSize: "23px",
                  color: "#dee9ff",
                  width: "60%",
                  ml: "10%",
                }}
              >
                Confirm the transaction
              </Typography>
            </Grid>
            <Grid
              item
              md={3}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center !important",
                mt: { xs: "20px" },
              }}
            >
              <img
                src={NumberImage4}
                alt="Number4"
                style={{ width: "66px", height: "69px" }}
              ></img>
              <Typography
                sx={{
                  fontFamily: "MonumentExtendedRegular",
                  fontSize: "23px",
                  color: "#dee9ff",
                  width: "60%",
                  ml: "10%",
                }}
              >
                Receive your Alpha Pass
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <img src={AboutDivider} alt="Divider" style={{ width: "100%" }} />
    </Box>
  );
};

export default BalanceWhitelistMintPage;
