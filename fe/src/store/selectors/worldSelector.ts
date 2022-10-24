import { RootState } from "store";

export const selectWorlds = (state: RootState) => state.worldState.worlds;