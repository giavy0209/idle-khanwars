import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import callAPI from 'callAPI';
export interface World {
  _id: string,
  name: string
  speed: number
  tenant: string
}
export interface WorldState {
  worlds: World[]
}
const initialState: WorldState = {
  worlds: []
};

export const fetchWorlds = createAsyncThunk<World[]>(
  'world/fetchWorlds',
  async () => {
    const res = await callAPI.get('/worlds')
    return res.data;
  }
);

export const worldSlice = createSlice({
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


export default worldSlice.reducer