import { RootState } from "store";

export const selectMarching = (state: RootState) => state.marchingState.marchings
export const selectMarchingDetail = (state: RootState) => state.marchingState.detail
