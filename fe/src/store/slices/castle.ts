import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import callAPI from "callAPI"

export interface ICastle {
  _id : string
  loyal: number
  population: number
  name: string
  isCapital: boolean
}

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
    _id : '',
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

  },
  extraReducers(builder) {
    builder
      .addCase(fetchCastle.fulfilled, (state, action) => {
        state.castles = action.payload
        const capital = action.payload.find(o => o.isCapital)
        if (capital) {
          state.current = capital
        }
      })
  },
})

export default castleSlice.reducer