import { RootState } from "store";

export const selectGlobal = (state: RootState) => state.globalState.global;
