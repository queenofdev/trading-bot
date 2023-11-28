import { BondType } from "@fantohm/shared-web3";

export default interface Investment {
  id: string;
  type: BondType;
  amount: number;
  rewards: number;
  rewardToken: string;
  rewardsInUsd: number;
  term: number;
  termType: string;
  vestDate: number;
  bondName: string;
  bondIndex: number;
  displayName: string;
  roi: string;
  secondsToVest: number;
  percentVestedFor: number;
}
