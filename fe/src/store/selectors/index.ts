import { RootState } from "store";

export const selectWorlds = (state: RootState) => state.worldState.worlds;
export const selectUser = (state: RootState) => state.userState.user;
export const selecToken = (state: RootState) => state.userState.token;
