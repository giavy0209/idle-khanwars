import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IGlobal } from "interfaces"

const initialState: {
  global: Partial<IGlobal>
} = {
  global: {}
}
export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setState: (state, action: PayloadAction<Partial<IGlobal>>) => {
      state.global = action.payload

    }
  }
})

export default globalSlice