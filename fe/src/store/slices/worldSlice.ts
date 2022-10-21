import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import callAPI from 'callAPI';
import { IWorld } from 'interfaces';

export interface InitialState {
  worlds: IWorld[]
}
const initialState: InitialState = {
  worlds: []
};

export const fetchWorlds = createAsyncThunk<IWorld[]>(
  'world/fetchWorlds',
  async () => {
    const res = await callAPI.get('/worlds')
    return res.data;
  }
);

const worldSlice = createSlice({
  name: 'world',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorlds.fulfilled, (state, action) => {
        state.worlds = action.payload
      })
  }
})

export const worldAction = worldSlice.actions
export const worldReducer = worldSlice.reducer