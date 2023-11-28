import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import allBonds from "../helpers/all-bonds";
import { IUserBondDetails } from "../slices/account-slice";
import { Bond, BondType } from "../lib/bond";
import { IBondDetails } from "../slices/bond-slice";
import { NetworkId, networks } from "../networks";

interface IBondingStateView {
  account: {
    bonds: {
      [key: string]: IUserBondDetails;
    };
  };
  bonding: {
    loading: boolean;
    [key: string]: any;
  };
  app: {
    stakingRebase: number;
    marketPrice: number;
  };
}

// Smash all the interfaces together to get the BondData Type
export interface IAllBondData extends Bond, IBondDetails, IUserBondDetails {}
// Slaps together bond data within the account & bonding states
export function useBonds(networkId: NetworkId) {
  // Filter out non supported bonds
  const filteredBonds = allBonds.filter((bond) => networkId in bond.networkAddrs);
  const bondLoading = useSelector((state: IBondingStateView) => !state.bonding.loading);
  const bondState = useSelector((state: IBondingStateView) => state.bonding);
  const accountBondsState = useSelector(
    (state: IBondingStateView) => state.account.bonds
  );
  const [bonds, setBonds] = useState<IAllBondData[]>([]);

  const stakingRebase = useSelector(
    (state: IBondingStateView) => state.app.stakingRebase
  );
  const fhmMarketPrice = useSelector((state: IBondingStateView) => state.app.marketPrice);

  useEffect(() => {
    let bondDetails: IAllBondData[];
    // eslint-disable-next-line prefer-const
    bondDetails = filteredBonds
      .flatMap((bond) => {
        if (bondState[bond.name] && bondState[bond.name].bondDiscount != null) {
          return Object.assign(bond, bondState[bond.name]); // Keeps the object type
        }
        return bond;
      })
      .flatMap((bond) => {
        if (accountBondsState[bond.name]) {
          return Object.assign(bond, accountBondsState[bond.name]);
        }
        return bond;
      })
      .flatMap((bond) => {
        // (4, 4) bonds include additional rebase discount
        if (
          bond.type === BondType.BOND_44 &&
          stakingRebase != null &&
          fhmMarketPrice != null
        ) {
          const epochLength = networks[networkId].epochInterval;
          const rebasesDuringVesting = bond.vestingTerm / epochLength;
          const rebaseValue = Math.pow(1 + stakingRebase, rebasesDuringVesting) - 1;

          const roi: number = (1 + rebaseValue) / (1 - bond.bondDiscount) - 1;
          const discountProperties = {
            bondDiscount: roi,
            bondDiscountFromRebase: 0,
          };
          return Object.assign(bond, discountProperties);
        }
        return bond;
      });

    const mostProfitableBonds = bondDetails.concat().sort((a, b) => {
      // fhud always goes last
      if (a["name"] === "fhud") return 1;
      else if (b["name"] === "fhud") return -1;
      else
        return a["bondDiscount"] > b["bondDiscount"]
          ? -1
          : b["bondDiscount"] > a["bondDiscount"]
          ? 1
          : 0;
    });

    setBonds(mostProfitableBonds);
  }, [
    bondState,
    accountBondsState,
    bondLoading,
    networkId,
    stakingRebase,
    fhmMarketPrice,
  ]);

  // Debug Log:
  // console.log(bonds);
  return { bonds, loading: bondLoading, allBonds };
}

export default useBonds;
