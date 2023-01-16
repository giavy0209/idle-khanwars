import { RootState } from "store";


export const selectBuildingByKey = (key: string) => (state: RootState) => state.buildingState.buildings.find(o => o.default.key === key);
export const selectBuildingGenerateByKey = (key: string) => (state: RootState) => state.buildingState.buildings.find(o => o.default.key === key)?.upgrade.current.generate;
export const selectBuildingById = (_id: string) => (state: RootState) => state.buildingState.buildings.find(o => o._id === _id);
export const selectBuildingByType = (type: string) => (state: RootState) => state.buildingState.buildings.filter(o => o.default.type === type);
export const selectBuildingUpgrade = (state: RootState) => state.buildingState.upgrade;
