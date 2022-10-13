import { RootState } from "store";

export const selectGlobal = (state: RootState) => state.globalState.global;
export const selectWorlds = (state: RootState) => state.worldState.worlds;
export const selectUser = (state: RootState) => state.userState.user;
export const selectCastle = (state: RootState) => state.castleState.current;
export const selectToken = (state: RootState) => state.userState.token;
export const selectResources = (state: RootState) => state.resourceState.resources;
export const selectResource = (state: RootState) => state.resourceState.resource;
export const selectBuildingByType = (type : string) => (state: RootState) => state.buildingState.buildings.filter(o => o.default.type === type);
export const selectBuildingUpgrade = (state: RootState) => state.buildingState.upgrade;
export const selectBuildingUpgradiing = (state: RootState) => state.buildingState.buildings.find(o => o.isUpgrading);
export const selectUpgradeCost = (state: RootState) => state.buildingState.upgradeCost;
