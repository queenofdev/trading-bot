import {
  defaultNetworkId,
  enabledNetworkIds,
  error,
  networks,
  useWeb3Context,
} from "@fantohm/shared-web3";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button, Paper, Fade, Popper, SvgIcon } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { memo, useEffect, useState } from "react";

import store from "../../../store";

export const NetworkMenu = (): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { chainId, switchEthereumChain } = useWeb3Context();
  const [currentNetwork, setCurrentNetwork] = useState({
    id: chainId,
    name: networks[chainId || defaultNetworkId]?.name,
    icon: networks[chainId || defaultNetworkId]?.logo,
  });

  const open = Boolean(anchorEl);
  const isMediumScreen = useMediaQuery("(max-width: 980px)");

  let availableNetworks = enabledNetworkIds
    .filter((networkId) => networkId !== chainId)
    .map((networkId) => ({
      id: networkId,
      name: networks[networkId]?.name,
      icon: networks[networkId]?.logo,
    }));

  const changeNetworks = async (chainId: number) => {
    if (!switchEthereumChain) return;
    const result = await switchEthereumChain(chainId || defaultNetworkId);
    if (!result) {
      const errorMessage =
        "Unable to switch networks. Please change network using provider.";
      console.error(errorMessage);
      store.dispatch(error(errorMessage));
    }
  };

  const handleClick = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  useEffect(() => {
    if (!chainId) {
      return;
    }
    setCurrentNetwork({
      id: chainId,
      name: networks[chainId]?.name,
      icon: networks[chainId]?.logo,
    });
    availableNetworks = enabledNetworkIds
      .filter((networkId) => networkId !== chainId)
      .map((networkId) => ({
        id: networkId,
        name: networks[networkId]?.name,
        icon: networks[networkId]?.logo,
      }));
  }, [chainId]);

  return (
    <Box onClick={(e: any) => handleClick(e)} id="network-menu-button-hover">
      <Button
        className="menuButton"
        sx={{ margin: "0 !important", width: { xs: "75px", sm: "170px" } }}
        color="primary"
        title="Network"
        aria-describedby="network-popper"
        disableElevation={false}
      >
        <SvgIcon component={currentNetwork.icon} color="primary" viewBox="0 0 32 32" />
        <Typography noWrap hidden={isMediumScreen} style={{ paddingLeft: "8px" }}>
          {currentNetwork?.name}
        </Typography>
      </Button>

      <Popper
        id="network-popper"
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        transition
        hidden={availableNetworks?.length === 0}
      >
        {({ TransitionProps }) => {
          return (
            <Fade {...TransitionProps} timeout={100}>
              <Paper
                className="MuiMenu-paper"
                sx={{ width: { xs: "75px", sm: "170px" } }}
                elevation={1}
              >
                <Box className="select-network">
                  {availableNetworks?.map((network) => {
                    return (
                      <Button
                        className="ultraThin"
                        key={`${network?.name}-btn`}
                        size="large"
                        color="primary"
                        fullWidth
                        onClick={() => changeNetworks(network.id)}
                        disableElevation={true}
                      >
                        <Box display="flex" justifyContent="center">
                          <SvgIcon
                            component={network.icon}
                            color="primary"
                            viewBox="0 0 32 32"
                          />
                          <Typography
                            noWrap
                            hidden={isMediumScreen}
                            sx={{ marginLeft: "1rem", maxWidth: "90px" }}
                          >
                            {network?.name}
                          </Typography>
                        </Box>
                      </Button>
                    );
                  })}
                </Box>
              </Paper>
            </Fade>
          );
        }}
      </Popper>
    </Box>
  );
};

export default memo(NetworkMenu);
