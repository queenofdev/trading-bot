import style from "./deposit-choice.module.scss";
import { Box } from "@mui/material";
import { DepositCard } from "./deposit-card";
import { allBonds, BondType, IAllBondData } from "@fantohm/shared-web3";
import { useBonds } from "@fantohm/shared-web3";
import { useWeb3Context } from "@fantohm/shared-web3";
import { useEffect, useState } from "react";

interface DepositChoiceParams {
  id?: string;
}

export const DepositChoice = (params: DepositChoiceParams): JSX.Element => {
  const { chainId } = useWeb3Context();
  const { bonds } = useBonds(chainId || 250);
  const [bondsUsdb, setBondsUsdb] = useState<Array<IAllBondData>>();
  const allTradfiBonds = allBonds
    .filter((bond) => bond.type === BondType.TRADFI)
    .sort((a, b) => (a.days > b.days ? 1 : -1));
  useEffect(() => {
    setBondsUsdb(
      bonds
        .filter((bond) => bond.type === BondType.TRADFI)
        .sort((a, b) => (a.days > b.days ? 1 : -1))
    );
  }, [bonds, chainId]);

  return (
    <Box id={params.id}>
      <Box className={style["__bond-cards"]}>
        {bondsUsdb?.map((bond, index) => (
          <DepositCard
            key={`dc-${index}`}
            bondType={bond.name}
            months={bond.name === "tradfi3month" ? 3 : 6}
            roi={Number(bond.roi)}
            apy={Number(bond.apy)}
            bond={bond}
            vestingTermPretty={bond.name === "tradfi3month" ? "90 days" : "180 days"}
          />
        ))}
        {(!bondsUsdb || bondsUsdb.length) === 0 &&
          allTradfiBonds?.map((bond, index) => (
            <DepositCard
              key={index}
              bondType={bond.name}
              months={bond.name === "tradfi3month" ? 3 : 6}
              roi={Number(bond.roi)}
              apy={Number(bond.apy)}
              bond={bond}
              vestingTermPretty={bond.name === "tradfi3month" ? "90 days" : "180 days"}
            />
          ))}
      </Box>
    </Box>
  );
};

export default DepositChoice;
