import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import callAPI from "callAPI";
import { IUpgrade } from "interfaces";
import { AppThunk, RootState } from "store";

interface InitialState {
  upgrades: IUpgrade[]
}

const initialState: InitialState = {
  upgrades: []
}

export const fetchUpgrade = createAsyncThunk<AppThunk<IUpgrade[]>>(
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
    const res = await callAPI.post(`/buildings/upgrade/${building}`, {}, { toastSuccess: true })
    return res.data
  }
)

const upgradeSlice = createSlice({
  name: 'upgrade',
  initialState,
  reducers: {

  }
})

export const upgradeAction = upgradeSlice.actions
export const upgradeReducer = upgradeSlice.reducer