import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import callAPI from "callAPI"
import { ICastle } from "interfaces"
import socket, { reconnect } from "socket"
import { storage } from "utils"

export const fetchCastle = createAsyncThunk<ICastle[]>(
  'castle/fetchCastle',
  async () => {
    const res = await callAPI.get('/castles')
    return res.data
  }
)
interface InitialState {
  castles: ICastle[]
  current: ICastle
}
const initialState: InitialState = {
  castles: [],
  current: {
    _id: '',
    loyal: 0,
    population: 0,
    name: '',
    isCapital: true,
  }
}

const castleSlice = createSlice({
  name: 'castle',
  initialState,
  reducers: {
    reset: () => initialState,
    updateCastle(state, action: PayloadAction<ICastle>) {
      state.current = action.payload
    },
    changeCastle(state, action: PayloadAction<ICastle>) {
      state.current = action.payload
      storage.setItem('castle', action.payload._id)
      reconnect()
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCastle.fulfilled, (state, action) => {
        state.castles = action.payload
        const capital = action.payload.find(o => o.isCapital)
        if (capital) {
          castleSlice.caseReducers.changeCastle(state, { payload: capital, type: '' })
        }
      })
  },
})
export const castleAction = castleSlice.actions
export const castleReducer = castleSlice.reducer