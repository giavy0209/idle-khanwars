import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { user, world } from './slices';
import { fetchCurrent } from './slices/user';

const store = configureStore({
  reducer: {
    worldState : world,
    userState : user
  },
});

export const initDefault = () => async (dispatch : AppDispatch) => {
  dispatch(fetchCurrent())
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
