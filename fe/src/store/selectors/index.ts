import { RootState } from "store";

export const selectGlobal = (state: RootState) => state.globalState.global;
export const selectWorlds = (state: RootState) => state.worldState.worlds;
export const selectUser = (state: RootState) => state.userState.user;
export const selectCastle = (state: RootState) => state.castleState.current;
export const selectToken = (state: RootState) => state.userState.token;
export const selectResources = (state: RootState) => state.resourceState.resources;
export const selectResource = (state: RootState) => state.resourceState.resource;

export const selectBuildingByKey = (key: string) => (state: RootState) => state.buildingState.buildings.find(o => o.default.key === key);
export const selectBuildingById = (_id: string) => (state: RootState) => state.buildingState.buildings.find(o => o._id === _id);
export const selectBuildingByType = (type: string) => (state: RootState) => state.buildingState.buildings.filter(o => o.default.type === type);
export const selectBuildingUpgrade = (state: RootState) => state.buildingState.upgrade;
export const selectBuildingUpgradiing = (state: RootState) => state.buildingState.buildings.find(o => o.isUpgrading);

export const selectUpgradeCost = (state: RootState) => state.buildingState.upgradeCost;

export const selectUnitTraining = (state: RootState) => state.unitState.training;
export const selectUnitByBuilding = (building: string) => (state: RootState) => state.unitState.units.filter(o => o.building.default.key === building);

export const selectTrainings = (state: RootState) => state.trainingState.trainings