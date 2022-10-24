import { RootState } from "store";

export const selectUpgrading = (state: RootState) => state.upgradeState.upgrades
export const selectUpgradeCost = (state: RootState) => state.upgradeState.upgradeCost;
