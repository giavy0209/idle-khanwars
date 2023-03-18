import { RootState } from "store";

export const selectMarching = (state: RootState) => state.marchingState.marchings
