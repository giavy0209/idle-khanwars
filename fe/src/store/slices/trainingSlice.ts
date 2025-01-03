import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import callAPI from "callAPI"
import { ITraining } from "interfaces"
import { RootState } from "store"

interface InitialState {
  trainings: ITraining[]
}
const initialState: InitialState = {
  trainings: []
}

export const fetchTraining = createAsyncThunk<ITraining[]>(
  'training/fetchTraining',
  async (_, { getState }) => {
    const state = getState() as RootState
    const castle = state.castleState.current._id
    const res = await callAPI.get(`/trainings?castle=${castle}`)
    return res.data
  }
)

export const postTraining = createAsyncThunk<ITraining, { total: number, unit: string }>(
  'unit/postTraining',
  async ({ total, unit }) => {
    const res = await callAPI.post(`/trainings`, { total, unit }, { toastSuccess: true })
    return res.data
  }
)

const trainingSlice = createSlice({
  name: 'training',
  initialState,
  reducers: {
    setTraining(state, action: PayloadAction<ITraining>) {
      const index = state.trainings.findIndex(training => training._id === action.payload._id)
      state.trainings.splice(index, 1, action.payload)
    },
    removeTraining(state, action: PayloadAction<string>) {
      const index = state.trainings.findIndex(training => training._id === action.payload)
      state.trainings.splice(index, 1)
    }
  },
  extraReducers(builder) {
    builder
      .addCase(postTraining.fulfilled, (state, action) => {
        state.trainings = [...state.trainings, action.payload]
      })
      .addCase(fetchTraining.fulfilled, (state, action) => {
        state.trainings = action.payload
      })
  },
})

export const trainingAction = trainingSlice.actions
export const trainingReducer = trainingSlice.reducer