import { RootState } from "store";

export const selectUnitTraining = (state: RootState) => state.unitState.training;
export const selectUnitByBuilding = (building: string) => (state: RootState) => state.unitState.units.filter(o => o.building.default.key === building);