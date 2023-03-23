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
    setMarching(state, action: PayloadAction<IMarching>) {
      const marchings = [...state.marchings]
      const index = marchings.findIndex(enhance => enhance._id === action.payload._id)
      if (index !== -1) {
        marchings.splice(index, 1, action.payload)
      } else {
        marchings.push(action.payload)
      }
      state.marchings = marchings
    },
    removeMarching(state, action: PayloadAction<string>) {
      const marchings = [...state.marchings]
      const index = marchings.findIndex(marching => marching._id === action.payload)
      marchings.splice(index, 1)
      state.marchings = marchings
    },
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