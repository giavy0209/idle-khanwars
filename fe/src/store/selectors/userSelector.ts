import { RootState } from "store";

export const selectUser = (state: RootState) => state.userState.user;
export const selectToken = (state: RootState) => state.userState.token;