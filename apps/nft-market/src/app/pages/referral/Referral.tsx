import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import {
  defaultNetworkId,
  getBalances,
  isDev,
  setWalletConnected,
  useWeb3Context,
} from "@fantohm/shared-web3";
import { EarningView } from "./EarningView";
import { ReferralList } from "./ReferralList";
import { copyToClipboard } from "@fantohm/shared-helpers";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAlert, GrowlNotification } from "../../store/reducers/app-slice";
import { getAccountAffiliateState } from "../../store/selectors/affilate-selectors";
import { RootState } from "../../store";
import {
  getAffiliateAddresses,
  getAffiliateFees,
  getPassBonusable,
  getTotalClaimedAmounts,
} from "../../store/reducers/affiliate-slice";

export const Referral = (): JSX.Element => {
  const { address, chainId, provider, connected, disconnect, connect } = useWeb3Context();
  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => getAccountAffiliateState(state));
  const referralPrefix = isDev ? "http://localhost:4200/" : "https://liqdnft.com/";

  console.log("affiliateData: ", data);

  const isDesktop = useMediaQuery("(min-width:767px)");

  const handleConnect = useCallback(async () => {
    if (connected) {
      await disconnect();
    } else {
      try {
        connect();
      } catch (e) {
        console.log("Connection metamask error", e);
      }
    }
  }, [connected, disconnect, connect]);

  useEffect(() => {
    dispatch(setWalletConnected(connected));
    dispatch(getBalances({ address: address, networkId: chainId || defaultNetworkId }));
  }, [connected, address, dispatch]);

  const handleCopyReferralCode = () => {
    if (!address) return;
    copyToClipboard(`${referralPrefix}?ref=${address}`);
    const notification: Partial<GrowlNotification> = {
      message: "Referral link copied to clipboard",
      duration: 1000,
    };
    dispatch(addAlert(notification));
  };

  useEffect(() => {
    if (address && connected && provider && chainId) {
      dispatch(getAffiliateAddresses(address));
      dispatch(getAffiliateFees(address));
      dispatch(getPassBonusable({ provider, networkId: chainId }));
      dispatch(getTotalClaimedAmounts({ provider, networkId: chainId }));
    }
  }, [address, connected, provider, chainId]);

  return (
    <Container maxWidth={"lg"}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "5%",
          width: "100%",
          gridGap: "40px",
        }}
        className="referral-wrapper"
      >
        <Paper variant="elevation" elevation={6} className="referral-link-paper">
          <Typography variant="h5" component="h5">
            Refer a Friend to Liqd
          </Typography>
          <Box mt={2.5}>
            <Typography variant="subtitle2" component="span">
              Refer someone to Liqd and you’ll earn 5% of all fees they generate on the
              platform. Learn more about this here.
            </Typography>
          </Box>

          <Box
            display={"flex"}
            flexDirection={"row"}
            mt="50px"
            mr="auto"
            alignItems="center"
          >
            <Typography variant="subtitle2" component="span">
              Your Liqd referral link
            </Typography>
            <Box ml={1} display={"flex"}>
              <InfoIcon />
            </Box>
          </Box>

          {connected ? (
            <Box
              display="flex"
              alignItems={"center"}
              mt="21px"
              width="100%"
              gap={3}
              sx={{
                flexDirection: isDesktop ? "row" : "column",
                justifyContent: isDesktop ? "space-between" : "center",
              }}
            >
              <TextField
                id="standard-basic"
                label=""
                variant="standard"
                value={`${referralPrefix}?ref=${address}`}
                disabled
                fullWidth
                style={{ color: "#7e9aa9", border: "none" }}
                className="referral-link"
              />
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCopyReferralCode}
                >
                  Copy
                </Button>
              </Box>
            </Box>
          ) : (
            <Box mx={"auto"} mt="50px">
              <Button variant="contained" color="primary" onClick={handleConnect}>
                Connect Wallet
              </Button>
            </Box>
          )}
        </Paper>
        {connected && (
          <>
            <Box className="referral-link-paper">
              <EarningView />
            </Box>
            <Paper className="referral-link-paper" variant="elevation" elevation={6}>
              <ReferralList data={data?.data?.referredAddresses || []} />
            </Paper>
          </>
        )}
      </Box>
    </Container>
  );
};
export default Referral;
