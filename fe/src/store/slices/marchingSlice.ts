import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import callAPI from "callAPI"
import { MARCHING, IMarching } from "interfaces"

export const fetchMarching = createAsyncThunk<IMarching[]>(
  'marching/fetchMarching',
  async () => {
    const res = await callAPI.get(`/marchings`)
    return res.data
  }
)

type PostMarching = {
  to: string
  action: MARCHING.ACTION
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
  action: MARCHING.ACTION
  units: {
    _id: string
    selected: number
  }[]
}

export const postMarching = createAsyncThunk<IMarching, PostMarching>(
  'marching/postMarching',
  async (marching) => {
    const res = await callAPI.post(`/marchings`, marching, { toastSuccess: true })
    return res.data
  }
)

export const patchMarching = createAsyncThunk<IMarching, string>(
  'marching/patchMarching',
  async (id) => {
    const res = await callAPI.patch(`/marchings/${id}`, { action: 'RETURN' })
    return res.data
  }
)
interface InitialState {
  marchings: IMarching[],
  detail?: IMarching
}

const initialState: InitialState = {
  marchings: [],
}

const marchingSlice = createSlice({
  name: 'marching',
  initialState,
  reducers: {
    setMarching(state, action: PayloadAction<IMarching>) {
      const index = state.marchings.findIndex(enhance => enhance._id === action.payload._id)
      if (index !== -1) {
        state.marchings.splice(index, 1, action.payload)
      } else {
        state.marchings.push(action.payload)
      }
    },
    removeMarching(state, action: PayloadAction<string>) {
      const index = state.marchings.findIndex(marching => marching._id === action.payload)
      state.marchings.splice(index, 1)
    },
    setMarchingDetail(state, action: PayloadAction<IMarching | undefined>) {
      state.detail = action.payload
    }
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