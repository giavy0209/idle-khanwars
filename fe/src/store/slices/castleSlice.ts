import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import callAPI from "callAPI"
import { ICastle } from "interfaces"
import { reconnect } from "socket"
import { storage } from "utils"

export const fetchCastle = createAsyncThunk<ICastle[]>(
  'castle/fetchCastle',
  async () => {
    const res = await callAPI.get('/castles')
    return res.data
  }
)


export const fetchMapCastles = createAsyncThunk<
  ICastle[],
  {
    start: { x: number, y: number }
    end: { x: number, y: number }
  }
>(
  'castle/fetchMapCastles',
  async ({ start, end }) => {
    const res = await callAPI.get(`/castles/map?startX=${start.x}&endX=${end.x}&startY=${start.y}&endY=${end.y}`)
    return res.data
  }
)

interface InitialState {
  mapCastles: ICastle[]
  castles: ICastle[]
  current: ICastle
}
const initialState: InitialState = {
  castles: [],
  mapCastles: [],
  current: {
    _id: '',
    loyal: 0,
    population: 0,
    name: '',
    isCapital: true,
    coordinate: {
      x: 0,
      y: 0
    }
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
      .addCase(fetchMapCastles.fulfilled, (state, action) => {
        state.mapCastles = action.payload
      })
  },
})
export const castleAction = castleSlice.actions
export const castleReducer = castleSlice.reducer