import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import callAPI from "callAPI"
import store from "store"
import { IBuilding } from "./building"

export interface IResource {
  _id: string
  castle: string
  default: {
    name: string
    key: string
    path: string
  }
  building: IBuilding
  value: number
  lastUpdate: Date
}

export const fetchResource = createAsyncThunk<IResource[]>(
  'resource/fetchResource',
  async () => {
    const currentCastle = store.getState().castleState.current

    const res = await callAPI.get(`/resources?castle=${currentCastle._id}`)
    return res.data
  }
)

interface InitialState {
  resources: IResource[]
  resource: {
    gold: number
    iron: number
    wood: number
    food: number
  }
}

const initialState: InitialState = {
  resources: [],
  resource: {
    gold: 0,
    iron: 0,
    wood: 0,
    food: 0
  }
}

const setResource = (state: InitialState, action: PayloadAction<IResource[]>) => {
  state.resources = action.payload.map(o => ({ ...o, value: Math.floor(o.value) }))
  action.payload.forEach(o => {
    state.resource[o.default.key as keyof typeof initialState.resource] = Math.floor(o.value)
  })
}

const resourceSlice = createSlice({
  name: 'resource',
  initialState,
  reducers: {
    setResource: setResource
  },
  extraReducers(builder) {
    builder
      .addCase(fetchResource.fulfilled, setResource)
  },
})

export default resourceSlice.reducer