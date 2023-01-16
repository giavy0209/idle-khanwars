import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import {
  resourceReducer,
  trainingReducer,
  unitReducer,
  userReducer,
  worldReducer,
  buildingReducer,
  fetchBuilding,
  castleReducer,
  fetchCurrent,
  fetchCastle,
  fetchResource,
  fetchUnit,
  fetchTraining,
  globalReducer,
  fetchUpgrade,
  upgradeReducer,
  enhanceReducer,
  fetchEnhance
} from './slices';

const store = configureStore({
  reducer: {
    globalState: globalReducer,
    unitState: unitReducer,
    trainingState: trainingReducer,
    worldState: worldReducer,
    userState: userReducer,
    castleState: castleReducer,
    buildingState: buildingReducer,
    resourceState: resourceReducer,
    upgradeState: upgradeReducer,
    enhanceState: enhanceReducer
  },
});

export const initDefault = () => async (dispatch: AppDispatch) => {
  await dispatch(fetchCurrent())
  await dispatch(fetchCastle())
  dispatch(fetchBuilding())
  dispatch(fetchResource())
  dispatch(fetchUnit())
  dispatch(fetchTraining())
  dispatch(fetchUpgrade())
  dispatch(fetchEnhance())
}


export default store

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
