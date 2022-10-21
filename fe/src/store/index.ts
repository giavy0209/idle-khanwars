import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { resourceReducer, trainingReducer, unitReducer, userReducer, worldReducer, buildingReducer, fetchBuilding, castleReducer, fetchCurrent, fetchCastle, fetchResource, fetchUnit, fetchTraining, globalReducer } from './slices';

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
  },
});

export const initDefault = () => async (dispatch: AppDispatch) => {
  await dispatch(fetchCurrent())
  await dispatch(fetchCastle())
  dispatch(fetchBuilding())
  dispatch(fetchResource())
  dispatch(fetchUnit())
  dispatch(fetchTraining())
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
