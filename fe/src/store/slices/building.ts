import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import callAPI from "callAPI"
import store, { RootState } from "store"

export interface IBuilding {
  _id: string
  default: {
    name: string
    description: string
    type: string
    path: string
  }
  isUpgrading: boolean
  value: number
  level: number
  startAt: string
}

export interface IUpgrade {
  building: {
    type: string
  }
  level: number
  generate: number
  time: number
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
}

export const fetchBuilding = createAsyncThunk<IBuilding[]>(
  'building/fetchBuilding',
  async (_, { getState }) => {
    const state = getState() as RootState
    const currentCastle = state.castleState.current
    const res = await callAPI.get(`/buildings?castle=${currentCastle._id}`)
    return res.data
  }
)

export const fetchUpgrade = createAsyncThunk<IUpgrade, string>(
  'building/fetchUpgrade',
  async (building: string) => {
    const res = await callAPI.get(`/buildings/upgrade?building=${building}`)
    return res.data
  }
)

export const postUpgrade = createAsyncThunk<IUpgrade, string>(
  'building/postUpgrade',
  async (building: string) => {
    const res = await callAPI.post(`/buildings/upgrade/${building}`, {})
    return res.data
  }
)

interface InitialState {
  buildings: IBuilding[]
  upgrade?: IBuilding
  upgradeCost?: IUpgrade
}

const initialState: InitialState = {
  buildings: [],
  upgrade: undefined,
  upgradeCost: undefined
}

export const buildingSlice = createSlice({
  name: 'building',
  initialState,
  reducers: {
    setUpgrade: (state, action: PayloadAction<IBuilding | undefined>) => {
      state.upgrade = action.payload
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchBuilding.fulfilled, (state, action) => {
        state.buildings = action.payload
      })
      .addCase(fetchUpgrade.fulfilled, (state, action) => {
        state.upgradeCost = action.payload
      })
  },
})

export default buildingSlice.reducer