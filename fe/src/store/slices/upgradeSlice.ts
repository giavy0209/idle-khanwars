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



const upgradeSlice = createSlice({
  name: 'upgrade',
  initialState,
  reducers: {

  }
})
export default upgradeSlice