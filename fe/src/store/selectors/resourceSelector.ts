import { RootState } from "store";

export const selectResources = (state: RootState) => state.resourceState.resources;
export const selectResource = (state: RootState) => state.resourceState.resource;