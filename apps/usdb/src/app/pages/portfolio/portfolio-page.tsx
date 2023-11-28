import { Box, Grid, LinearProgress, Container, Typography, Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import { formatCurrency, prettifySeconds, useWeb3Context } from "@fantohm/shared-web3";
import {
  useBvmGetGeneratedVaults,
  useBvmGetPositions,
  VaultPosition,
} from "../../hooks/use-balance-vault-manager";
import { BalanceVault } from "../../hooks/use-balance-vault";
import { useMemo } from "react";
import { RootState } from "../../store";

export default function PortfolioPage() {
  const { address } = useWeb3Context();
  const themeType = useSelector((state: RootState) => state.app.theme);

  // load user positions from balance vault manager
  const { data: positionData } = useBvmGetPositions(address, 0, 1000);

  // load generated vaults from balance vault manager
  const { data: vaultData } = useBvmGetGeneratedVaults(0, 1000);

  // total portfolio value from all vaults
  const portfolioValue = useMemo(() => {
    return positionData?.reduce(
      (previous: number, current: VaultPosition) => previous + current.totalUsdValue,
      0
    );
  }, [positionData]);

  /**
   * Filter function that returns true if there is a vaultPosition for the vault with a positive USD value
   *
   * @param vault Vault address to load position from;
   *
   */
  const filterNoPosition = (vault: BalanceVault, positionData: VaultPosition[]) => {
    const position = positionData?.find(
      (position: VaultPosition) => position.vaultAddress === vault.vaultAddress
    );
    return (position?.totalUsdValue ?? 0) > 0;
  };

  return (
    <Container maxWidth="xl">
      <Typography
        sx={{
          fontFamily: "sora",
          fontSize: "35px",
          marginTop: "80px",
        }}
      >
        Portfolio
      </Typography>
      <Typography
        sx={{
          fontFamily: "sora",
          fontSize: "16px",
          color: "#8A99A8",
          marginTop: "30px",
        }}
      >
        Portfolio Value:
      </Typography>
      <Typography
        sx={{
          fontFamily: "sora",
          fontSize: "32px",
          color: "#69D9C8",
          marginTop: "20px",
        }}
      >
        {formatCurrency(portfolioValue ?? 0, 4)}
      </Typography>
      <Box
        sx={{
          width: "100%",
          height: "2px",
          background: themeType === "light" ? "#FFFFFF" : "#101112",
          marginTop: "40px",
          marginBottom: "40px",
        }}
      />
      <Grid container spacing={8}>
        {vaultData
          ?.filter((vault: BalanceVault) => filterNoPosition(vault, positionData ?? []))
          .map((vault: BalanceVault, idx) => (
            <Grid item md={4} xs={12} key={idx}>
              <Box
                sx={{
                  borderRadius: "10px",
                  padding: "36px 42px",
                  background: themeType === "light" ? "#FFFFFF" : "#0A0C0F",
                }}
              >
                <Box className="flex fr ai-c">
                  <Avatar
                    src={vault.ownerContacts[0]}
                    sx={{ width: 48, height: 48, mr: "1em", border: "1px solid #1C1E21" }}
                  />
                  <Typography
                    sx={{
                      fontFamily: "sora",
                      fontSize: "20px",
                    }}
                  >
                    {vault.name}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    marginTop: "40px",
                  }}
                >
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography
                        sx={{
                          fontFamily: "sora",
                          fontSize: "16px",
                          color: "#8A99A8",
                        }}
                      >
                        Vault APR
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "sora",
                          fontSize: "18px",
                          marginTop: "18px",
                        }}
                      >
                        {vault.apr / 100}%
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        sx={{
                          fontFamily: "sora",
                          fontSize: "16px",
                          color: "#8A99A8",
                        }}
                      >
                        Lock duration
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "sora",
                          fontSize: "18px",
                          marginTop: "18px",
                        }}
                      >
                        {prettifySeconds(vault.lockDuration)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box
                  sx={{
                    marginTop: "40px",
                  }}
                >
                  <Box display="flex">
                    <Typography
                      sx={{
                        fontFamily: "sora",
                        fontSize: "20px",
                      }}
                    >
                      My position
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: "sora",
                      fontSize: "20px",
                      color: "#69D9C8",
                      marginTop: "18px",
                    }}
                  >
                    $
                    {
                      positionData?.find(
                        (position: VaultPosition) =>
                          position.vaultAddress === vault.vaultAddress
                      )?.totalUsdValue
                    }
                  </Typography>
                </Box>
                <Box
                  sx={{
                    marginTop: "40px",
                  }}
                >
                  <Box display="flex">
                    <Typography
                      sx={{
                        fontFamily: "sora",
                        fontSize: "20px",
                      }}
                    >
                      Duration
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" sx={{ marginTop: "10px" }}>
                    <Typography
                      sx={{
                        fontFamily: "sora",
                        fontSize: "16px",
                      }}
                    >
                      {vault.time.completedTime}
                    </Typography>
                    <Box sx={{ width: "100px", margin: "0 10px" }}>
                      <LinearProgress
                        variant="determinate"
                        value={vault.time.percentComplete * 100}
                      />
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: "sora",
                        fontSize: "16px",
                      }}
                    >
                      {prettifySeconds(vault.lockDuration)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
}
