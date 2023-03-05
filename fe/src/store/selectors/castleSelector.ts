import { RootState } from "store";

export const selectCastle = (state: RootState) => state.castleState.current;
export const selectCastles = (state: RootState) => state.castleState.castles;
export const selectMapCastles = (state: RootState) => state.castleState.mapCastles;
