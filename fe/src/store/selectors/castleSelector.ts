import { RootState } from "store";

export const selectCastle = (state: RootState) => state.castleState.current;
