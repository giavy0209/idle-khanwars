import { RootState } from "store";

export const selectWorlds = (state: RootState) => state.worldState.worlds;
export const selectUser = (state: RootState) => state.userState.user;
export const selectToken = (state: RootState) => state.userState.token;
export const selectResources = (state: RootState) => state.resourceState.resources;
export const selectResource = (state: RootState) => state.resourceState.resource;
export const selectBuildingUpgrade = (state: RootState) => state.buildingState.upgrade;
export const selectUpgradeCost = (state: RootState) => state.buildingState.upgradeCost;
