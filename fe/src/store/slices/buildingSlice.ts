import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import callAPI from "callAPI"
import { IBuilding } from "interfaces"
import { RootState } from "store"

export const fetchBuilding = createAsyncThunk<IBuilding[]>(
  'building/fetchBuilding',
  async (_, { getState }) => {
    const state = getState() as RootState
    const currentCastle = state.castleState.current
    const res = await callAPI.get(`/buildings?castle=${currentCastle._id}`)
    return res.data
  }
)

interface InitialState {
  buildings: IBuilding[]
  upgrade?: IBuilding
}

const initialState: InitialState = {
  buildings: [],
  upgrade: undefined,
}

const buildingSlice = createSlice({
  name: 'building',
  initialState,
  reducers: {
    setUpgrade(state, action: PayloadAction<IBuilding | undefined>) {
      state.upgrade = action.payload
    },
    setBuilding(state, action: PayloadAction<IBuilding>) {
      const index = state.buildings.findIndex(o => o._id === action.payload._id)
      if (index !== -1) {
        state.buildings.splice(index, 1, action.payload)
      }
      if (state.upgrade?._id === action.payload._id) {
        state.upgrade = action.payload
      }
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchBuilding.fulfilled, (state, action) => {
        state.buildings = action.payload
      })
  },
})

export const buildingAction = buildingSlice.actions
export const buildingReducer = buildingSlice.reducer
