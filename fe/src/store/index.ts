import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { resourceReducer, userReducer, worldReducer, buildingReducer, fetchBuilding, castleReducer, fetchCurrent, fetchCastle, fetchResource, fetchUnit, globalReducer } from './slices';

const store = configureStore({
  reducer: {
    globalState: globalReducer,
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
