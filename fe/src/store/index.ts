import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { building, castle, global, resource, training, unit, user, world, } from './slices';
import { fetchBuilding, } from './slices/building';
import { fetchCastle } from './slices/castle';
import { fetchResource } from './slices/resource';
import { fetchTraining } from './slices/training';
import { fetchUnit } from './slices/unit';
import { fetchCurrent } from './slices/user';

const store = configureStore({
  reducer: {
    globalState: global,
    unitState: unit,
    trainingState: training,
    worldState: world,
    userState: user,
    castleState: castle,
    buildingState: building,
    resourceState: resource,
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
