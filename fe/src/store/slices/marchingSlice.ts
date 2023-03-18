import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import callAPI from "callAPI"
import { ACTION, IMarching } from "interfaces"

export const fetchMarching = createAsyncThunk<IMarching[]>(
  'marching/fetchMarching',
  async () => {
    const res = await callAPI.get(`/marchings`)
    return res.data
  }
)

type PostMarching = {
  to: string
  action: ACTION
  units: {
    _id: string
    selected: number
    [k: string]: any
  }[]
} | {
  coordinates: {
    x: number
    y: number
  }
  action: ACTION
  units: {
    _id: string
    selected: number
    [k: string]: any
  }[]
}

export const postMarching = createAsyncThunk<IMarching, PostMarching>(
  'upgrade/postMarching',
  async (marching) => {
    const res = await callAPI.post(`/marchings`, marching, { toastSuccess: true })
    return res.data
  }
)
interface InitialState {
  marchings: IMarching[]
}

const initialState: InitialState = {
  marchings: [],
}

const marchingSlice = createSlice({
  name: 'marching',
  initialState,
  reducers: {

  },
  extraReducers(builder) {
    builder
      .addCase(fetchMarching.fulfilled, (state, action) => {

        state.marchings = [...action.payload]
      })
  },
})
export const marchingAction = marchingSlice.actions
export const marchingReducer = marchingSlice.reducer