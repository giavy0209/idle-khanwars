import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import callAPI from "callAPI"
import { IBuilding, IUnit } from "interfaces"
import { RootState } from "store"

export const fetchUnit = createAsyncThunk<IUnit[]>(
  'unit/fetchUnit',
  async (_, { getState }) => {
    const state = getState() as RootState
    const castle = state.castleState.current._id
    const res = await callAPI.get(`/units?castle=${castle}`)
    return res.data
  }
)
interface Move {
  type: "TO_DEFENSE" | "TO_TOWER"
  value: number
  unit: string
}
export const moveUnit = createAsyncThunk<IUnit[], Move>(
  'unit/moveUnit',
  async ({ type, unit, value }) => {
    const res = await callAPI.post<Move>(`/units/move`, { type, unit, value })
    return res.data
  }
)

interface InitialState {
  units: IUnit[]
  training?: IUnit
  enhance?: IUnit
}

const initialState: InitialState = {
  units: [],
}

const unitSlice = createSlice({
  name: 'unit',
  initialState,
  reducers: {
    training(state, action: PayloadAction<IUnit | undefined>) {
      state.training = action.payload
    },
    enhance(state, action: PayloadAction<IUnit | undefined>) {
      state.enhance = action.payload
    },
    setUnit(state, action: PayloadAction<IUnit>) {
      const index = state.units.findIndex(o => o._id === action.payload._id)
      const units = [...state.units]
      units.splice(index, 1, action.payload)
      state.units = units
    },
    setUnitByBuilding(state, action: PayloadAction<IBuilding>) {
      const units = [...state.units]
      units.forEach(unit => {
        if (unit.building._id === action.payload._id) {
          unit.building = action.payload
        }
      })
      state.units = units
    }
  },
  extraReducers(builder) {
    builder.addCase(fetchUnit.fulfilled, (state, action) => {
      state.units = action.payload
    })
  },
})
export const unitAction = unitSlice.actions
export const unitReducer = unitSlice.reducer