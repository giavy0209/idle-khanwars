import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import callAPI from "callAPI";
import { ENHANCE } from "const";
import { IEnhance } from "interfaces";
import { RootState } from "store";

interface InitialState {
  enhances: IEnhance[]

}

const initialState: InitialState = {
  enhances: []
}
export const fetchEnhance = createAsyncThunk<IEnhance[]>(
  'enhance/fetchEnhance',
  async (_, { getState }) => {
    const state = getState() as RootState
    const castle = state.castleState.current._id
    const res = await callAPI.get(`/enhances?castle=${castle}`)
    return res.data
  }
)
export const postEnhance = createAsyncThunk<IEnhance, { type: ENHANCE, unit: string }>(
  'enhance/postEnhance',
  async ({ type, unit }) => {
    const res = await callAPI.post(`/enhances`, { type, unit }, { toastSuccess: true })
    return res.data
  }
)
const enhanceSlice = createSlice({
  name: 'enhance',
  initialState,
  reducers: {
    setEnhance(state, action: PayloadAction<IEnhance>) {
      state.enhances.push(action.payload)
    },
    removeEnhance(state, action: PayloadAction<string>) {
      const index = state.enhances.findIndex(enhance => enhance._id === action.payload)
      state.enhances.splice(index, 1)
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchEnhance.fulfilled, (state, action) => {
        state.enhances = action.payload
      })
  },
})
export const enhanceAction = enhanceSlice.actions
export const enhanceReducer = enhanceSlice.reducer