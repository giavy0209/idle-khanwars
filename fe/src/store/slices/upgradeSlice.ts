import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import callAPI from "callAPI";
import { IDefaultUpgrade, IUpgrade } from "interfaces";
import { RootState } from "store";

interface InitialState {
  upgrades: IUpgrade[]
  upgradeCost?: IDefaultUpgrade
}

const initialState: InitialState = {
  upgrades: [],
}

export const fetchUpgrade = createAsyncThunk<IUpgrade[]>(
  'upgrade/fetchUpgrade',
  async (_, { getState }) => {
    const state = getState() as RootState
    const castle = state.castleState.current._id
    const res = await callAPI.get(`/upgrades?castle=${castle}`)
    return res.data
  }
)

export const postUpgrade = createAsyncThunk<IUpgrade, string>(
  'upgrade/postUpgrade',
  async (building) => {
    const res = await callAPI.post(`/upgrades`, { building }, { toastSuccess: true })
    return res.data
  }
)

const upgradeSlice = createSlice({
  name: 'upgrade',
  initialState,
  reducers: {
    setUpgrade(state, action: PayloadAction<IUpgrade>) {
      const upgrades = [...state.upgrades]
      upgrades.push(action.payload)
      state.upgrades = [...upgrades]
    },
    setUpgradeCost: (state, action: PayloadAction<IDefaultUpgrade | undefined>) => {
      state.upgradeCost = action.payload
    },
    removeUpgrade(state, action: PayloadAction<string>) {
      const upgrades = [...state.upgrades]
      const index = upgrades.findIndex(upgrade => upgrade._id === action.payload)
      upgrades.splice(index, 1)
      state.upgrades = upgrades
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUpgrade.fulfilled, (state, action) => {
        state.upgrades = action.payload
      })
  },
})

export const upgradeAction = upgradeSlice.actions
export const upgradeReducer = upgradeSlice.reducer