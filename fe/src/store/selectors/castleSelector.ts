import { RootState } from "store";

export const selectCastle = (state: RootState) => state.castleState.current;
export const selectMapCastles = (state: RootState) => state.castleState.mapCastles;
