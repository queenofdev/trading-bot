import {
  defaultNetworkId,
  networks,
  selectErc20Balance,
  useWeb3Context,
} from "@fantohm/shared-web3";
import { Box, Button, Container, Paper } from "@mui/material";
import { ethers } from "ethers";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { selectCurrencies } from "../../../store/selectors/currency-selectors";
import ManageFund from "../../managefund/managefund";

export const WalletBalances = (): JSX.Element => {
  const currencies = useSelector((state: RootState) => selectCurrencies(state));
  const erc20Balances = useSelector((state: RootState) => selectErc20Balance(state));
  const { chainId } = useWeb3Context();
  // make offer code
  const [dialogOpen, setDialogOpen] = useState(false);

  const onListDialogClose = (accepted: boolean) => {
    setDialogOpen(false);
  };

  const handleManageFund = () => {
    setDialogOpen(true);
  };

  return (
    <div
      style={{
        padding: "5px 0",
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <Container style={{ width: "100%", flex: "0 0 100%", padding: "0" }}>
          <Paper
            style={{
              marginTop: "5px",
              marginBottom: "5px",
              padding: "1em",
            }}
          >
            <Box
              sx={{
                marginBottom: "20px",
              }}
            >
              <h6
                style={{
                  color: "grey",
                  marginLeft: "10px",
                  marginTop: "10px",
                  marginBottom: "5px",
                }}
              >
                Wallet balance
              </h6>
              {Object.values(currencies).map((currencyInfo) => {
                const balance =
                  erc20Balances[currencyInfo.currentAddress] || ethers.BigNumber.from(0);
                const value = +ethers.utils.formatUnits(
                  balance,
                  currencyInfo.decimals || 18
                );

                if (value === 0) {
                  return null;
                }
                // Hide usdb
                if (
                  currencyInfo.addresses[chainId || defaultNetworkId] ==
                  networks[chainId || defaultNetworkId]?.addresses?.["USDB_ADDRESS"]
                ) {
                  return null;
                }

                return (
                  <h4
                    key={currencyInfo.symbol}
                    className="flex fr ai-c"
                    style={{
                      marginLeft: "10px",
                      marginTop: "5px",
                      marginBottom: "1px",
                    }}
                  >
                    <img
                      src={currencyInfo.icon}
                      alt={currencyInfo.symbol}
                      style={{ height: "1em", width: "1em", marginRight: "5px" }}
                    />{" "}
                    {parseFloat(value.toFixed(4))} {currencyInfo.symbol}
                  </h4>
                );
              })}
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {/* <div>
                    <h6
                      style={{
                        color: "grey",
                        marginLeft: "10px",
                        marginTop: "5px",
                        marginBottom: "5px",
                      }}
                    >
                      Offer balance
                    </h6>
                    <h4
                      style={{
                        marginLeft: "10px",
                        marginTop: "5px",
                        marginBottom: "1px",
                      }}
                    >
                      {repaymentTotal.toFixed(2)}{" "}
                      {(listings && currency?.symbol) || "USDB"}
                    </h4>
                  </div> */}
              <ManageFund onClose={onListDialogClose} open={dialogOpen} />
              <Button
                size="small"
                onClick={handleManageFund}
                sx={{
                  padding: "5px 20px",
                  fontSize: "10px",
                  height: "30px",
                  color: "blue",
                  backgroundColor: "#e6edfd",
                }}
              >
                Manage Allowance
              </Button>
            </Box>
          </Paper>
        </Container>
      </div>
    </div>
  );
};

export default WalletBalances;
