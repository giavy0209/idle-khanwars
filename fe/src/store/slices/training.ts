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
    const res = await callAPI.post(`/trainings`, { total, unit })
    return res.data
  }
)

export const trainingSlice = createSlice({
  name: 'training',
  initialState,
  reducers: {
    setTraining(state, action: PayloadAction<ITraining>) {
      const trainings = [...state.trainings]
      const index = trainings.findIndex(training => training._id === action.payload._id)
      trainings.splice(index, 1, action.payload)
      state.trainings = trainings
    },
    removeTraining(state, action: PayloadAction<string>) {
      const trainings = [...state.trainings]
      const index = trainings.findIndex(training => training._id === action.payload)
      trainings.splice(index, 1)
      state.trainings = trainings
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

export default trainingSlice.reducer