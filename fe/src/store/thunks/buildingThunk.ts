import { createAsyncThunk } from "@reduxjs/toolkit"
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

