import { createSlice } from "@reduxjs/toolkit";
import { IEnhance } from "interfaces";

interface InitialState {
  enhances: IEnhance[]

}

const initialState: InitialState = {
  enhances: []
}

const enhanceSlice = createSlice({
  name: 'enhance',
  initialState,
  reducers: {

  }
})