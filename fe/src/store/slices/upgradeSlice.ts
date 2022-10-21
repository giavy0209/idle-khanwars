import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import callAPI from "callAPI";
import { IUpgrade } from "interfaces";
import { RootState } from "store";

interface InitialState {
  upgrades: IUpgrade[]
}

const initialState: InitialState = {
  upgrades: []
}

export const fetchUpgrade = createAsyncThunk<IUpgrade[]>(
  'upgrade/fetchUpgrade',
  async (_, { getState }) => {
    const state = getState() as RootState
    const currentCastle = state.castleState.current
    const res = await callAPI.get(`/upgrades?castle=${currentCastle}`)
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
      state.upgrades.push(action.payload)
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