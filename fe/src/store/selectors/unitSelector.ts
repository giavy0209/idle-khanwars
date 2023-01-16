import { RootState } from "store";

export const selectUnits = (state: RootState) => state.unitState.units;
export const selectUnitTraining = (state: RootState) => state.unitState.training;
export const selectUnitEnhance = (state: RootState) => state.unitState.enhance;
export const selectUnitByBuilding = (building: string) => (state: RootState) => state.unitState.units.filter(o => o.building.default.key === building);