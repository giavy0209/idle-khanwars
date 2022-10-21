import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import {
  buildingSlice,
  castleSlice,
  globalSlice,
  resourceSlice,
  trainingSlice,
  unitSlice,
  upgradeSlice,
  userSlice,
  worldSlice
} from 'store/slices'
const store = configureStore({
  reducer: {
    globalState: globalSlice.reducer,
    unitState: unitSlice.reducer,
    trainingState: trainingSlice.reducer,
    worldState: worldSlice.reducer,
    userState: userSlice.reducer,
    castleState: castleSlice.reducer,
    buildingState: buildingSlice.reducer,
    resourceState: resourceSlice.reducer,
    upgradeState: upgradeSlice.reducer,
  },
});

export const initDefault = () => async (dispatch: AppDispatch) => {
  // await dispatch(fetchCurrent())
  // await dispatch(fetchCastle())
  // dispatch(fetchBuilding())
  // dispatch(fetchResource())
  // dispatch(fetchUnit())
  // dispatch(fetchTraining())
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
