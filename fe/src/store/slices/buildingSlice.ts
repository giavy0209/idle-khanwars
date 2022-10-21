import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IBuilding, IDefaultUpgrade } from "interfaces"
import { fetchBuilding } from "store/thunks"


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

const buildingSlice = createSlice({
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
  },
})
export default buildingSlice