import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import callAPI from "callAPI"
import { IBuilding, IDefaultUpgrade } from "interfaces"
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

export const fetchUpgrade = createAsyncThunk<IDefaultUpgrade, string>(
  'building/fetchUpgrade',
  async (building: string) => {
    const res = await callAPI.get(`/buildings/upgrade?building=${building}`)
    return res.data
  }
)

export const postUpgrade = createAsyncThunk<IDefaultUpgrade, string>(
  'building/postUpgrade',
  async (building: string) => {
    const res = await callAPI.post(`/buildings/upgrade/${building}`, {}, { toastSuccess: true })
    return res.data
  }
)

interface InitialState {
  buildings: IBuilding[]
  upgrade?: IBuilding
  upgradeCost?: IDefaultUpgrade
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
    },
    setUpgradeCost: (state, action: PayloadAction<IDefaultUpgrade | undefined>) => {
      state.upgradeCost = action.payload
    },
    setBuilding: (state, action: PayloadAction<IBuilding>) => {
      const buildings = [...state.buildings]
      const index = buildings.findIndex(o => o._id === action.payload._id)
      buildings.splice(index, 1, action.payload)
      state.buildings = [...buildings]
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