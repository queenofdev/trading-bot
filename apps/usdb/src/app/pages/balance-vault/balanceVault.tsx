import { Box, Button, Container, TableBody, TableRow, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Switch from "@mui/material/Switch";
import { BigNumber, ethers } from "ethers";
import CreateVaultForm from "../../components/create-vault/createVault";
import {
  defaultNetworkId,
  getBalanceVaultManager,
  getGeneratedVaultsLength,
  NetworkIds,
  useWeb3Context,
} from "@fantohm/shared-web3";
import { BalanceVaultType } from "../../store/interfaces";
import { PaperTable, PaperTableCell, PaperTableHead } from "@fantohm/shared-ui-themes";
import style from "./balanceVault.module.scss";
import { BalanceVaultItem } from "./balance-vault-item";

export enum BalanceVaultOverview {
  Vault_Name = "Vault",
  Vault_Size = "TVL",
  Vault_Apr = "APR",
  Vault_Duration = "Lock Duration",
  Vault_Currency = "Currencies",
  Vault_Status = "Funding Status",
}

export default function BalanceVault() {
  const { provider, address, chainId, connected, defaultProvider } = useWeb3Context();
  const dispatch = useDispatch();

  const [createVaultOpen, setCreateVaultOpen] = useState(false);
  const [balanceVaults, setBalanceVaults] = useState<BalanceVaultType[]>();

  const [vaultLength, setVaultLength] = useState("0");
  const overView = [
    BalanceVaultOverview.Vault_Name,
    BalanceVaultOverview.Vault_Size,
    BalanceVaultOverview.Vault_Apr,
    BalanceVaultOverview.Vault_Duration,
    BalanceVaultOverview.Vault_Currency,
    BalanceVaultOverview.Vault_Status,
  ];

  useEffect(() => {
    if (!provider && !defaultProvider) return;

    dispatch(
      getGeneratedVaultsLength({
        networkId: chainId ?? defaultNetworkId,
        provider: provider || defaultProvider,
        callback: (result: any) => {
          const length = BigNumber.from(result).toString();
          setVaultLength(length);

          dispatch(
            getBalanceVaultManager({
              networkId: chainId ?? defaultNetworkId,
              provider: provider || defaultProvider,
              skip: "0",
              limit: length,
              callback: (result: any) => {
                const tmpVaults: BalanceVaultType[] = [];
                result.forEach((vault: any) => {
                  tmpVaults.push({
                    vaultAddress: vault["vaultAddress"],
                    index: BigNumber.from(vault["index"]).toString(),
                    nftAddress: vault["nftAddress"],
                    ownerInfos: vault["ownerInfos"],
                    ownerContacts: vault["ownerContacts"],
                    ownerWallet: vault["ownerWallet"],
                    fundingAmount: vault["fundingAmount"],
                    fundraised: vault["fundraised"],
                    allowedTokens: vault["allowedTokens"],
                    freezeTimestamp: vault["freezeTimestamp"],
                    repaymentTimestamp: vault["repaymentTimestamp"],
                    apr: vault["apr"],
                    shouldBeFrozen: vault["shouldBeFrozen"],
                  });
                });
                setBalanceVaults(tmpVaults);
              },
            })
          );
        },
      })
    );
  }, [provider, defaultProvider, connected, address]);

  const onCreateVaultOpen = useCallback(() => {
    setCreateVaultOpen(true);
  }, []);
  const onCreateVaultClose = () => {
    setCreateVaultOpen(false);
  };

  const shouldSwitch = useMemo(() => {
    return (
      chainId !== NetworkIds.FantomOpera &&
      (balanceVaults ?? new Array(0)).filter(
        (x) => x.vaultAddress !== ethers.constants.AddressZero
      ).length === 0
    );
  }, [balanceVaults, chainId]);

  return !shouldSwitch ? (
    <Box sx={{ mt: "100px" }}>
      <CreateVaultForm onClose={onCreateVaultClose} open={createVaultOpen} />
      <Typography
        sx={{
          fontFamily: "sora",
          fontSize: "35px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        Vaults Overview
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: "20px",
        }}
      >
        <Typography sx={{ fontSize: "16px", color: "#8a99a8" }}>
          Hide closed vaults
        </Typography>
        <Switch defaultChecked />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mt: "50px" }}>
        <Link to="/portfolio">
          <Button sx={{ border: "solid 2px #3744e6", width: "200px" }}>
            View portfolio
          </Button>
        </Link>
        {/*<Button*/}
        {/*  onClick={onCreateVaultOpen}*/}
        {/*  disabled={true}*/}
        {/*  sx={{ border: "solid 2px #252729", width: "200px", ml: "20px" }}*/}
        {/*>*/}
        {/*  + Create Vault*/}
        {/*</Button>*/}
      </Box>
      <Box className={style["offerContainer"]}>
        <PaperTable sx={{ borderSpacing: "0em 2em !important" }}>
          <colgroup>
            <col width="20%"></col>
            <col width="30%"></col>
          </colgroup>
          <PaperTableHead>
            <TableRow className={style["rowh"]}>
              {overView.map((item, index) => (
                <PaperTableCell key={index} className={style["offersHead"]}>
                  {item}
                </PaperTableCell>
              ))}
            </TableRow>
          </PaperTableHead>
          <TableBody>
            {balanceVaults &&
              balanceVaults
                .filter((x) => x.vaultAddress !== ethers.constants.AddressZero)
                .map((balanceVault: BalanceVaultType, index: number) => (
                  <BalanceVaultItem key={index} Type={balanceVault} overview={overView} />
                ))}
          </TableBody>
        </PaperTable>
      </Box>
    </Box>
  ) : (
    <Box className="flex fj-c" sx={{ mt: "100px" }}>
      <Typography sx={{ fontSize: "40px" }}>Switch wallet to FTM chain</Typography>
    </Box>
  );
}
