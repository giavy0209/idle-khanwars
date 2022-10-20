import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import callAPI from "callAPI"
import { RootState } from "store"
import { IBuilding } from "./building"

export interface IUnit {
  castle: string
  building: IBuilding
  default: {
    name: string
    key: string
    order: number
    description: string
    path: string
    type: {
      name: string
      key: string
      order: number
    }
    time: number
    speed: number
    cargo: number
    life: number
    range: number
    population: number
    resources: {
      asArray: {
        type: {
          name: string
          key: string
          path: string
        }
        _id: string
        value: number
      }[]
      asObject: {
        gold: number
        iron: number
        wood: number
        food: number
      }
    }
    strength: {
      asArray: {
        type: {
          name: string
          key: string
          order: number
        }
        value: number
      }[]
      asObject: {
        infantry: number,
        archers: number,
        cavalry: number,
        siege: number
        wall: number
      }
    },
  }
  total: number
  inTower: number,
  _id: string
}

export const fetchUnit = createAsyncThunk<IUnit[]>(
  'unit/fetchUnit',
  async (_, { getState }) => {
    const state = getState() as RootState
    const castle = state.castleState.current._id
    const res = await callAPI.get(`/units?castle=${castle}`)
    return res.data
  }
)

interface InitialState {
  units: IUnit[]
  training?: IUnit
}

const initialState: InitialState = {
  units: [],
  training: undefined
}

export const unitSlice = createSlice({
  name: 'unit',
  initialState,
  reducers: {
    training: (state, action: PayloadAction<IUnit | undefined>) => {
      state.training = action.payload
    },
    setUnit: (state, action: PayloadAction<IUnit>) => {
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

export default unitSlice.reducer