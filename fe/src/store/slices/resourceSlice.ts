import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import callAPI from "callAPI"
import { IResource } from "interfaces"
import { RootState } from "store"

export const fetchResource = createAsyncThunk<IResource[]>(
  'resource/fetchResource',
  async (_, { getState }) => {
    const state = getState() as RootState
    const castle = state.castleState.current._id
    const res = await callAPI.get(`/resources?castle=${castle}`)
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

const setResources = (state: InitialState, action: PayloadAction<IResource[]>) => {
  state.resources = action.payload.map(o => ({ ...o, value: Math.floor(o.value) }))
  action.payload.forEach(o => {
    state.resource[o.default.key as keyof typeof initialState.resource] = Math.floor(o.value)
  })
}

const resourceSlice = createSlice({
  name: 'resource',
  initialState,
  reducers: {
    setResources: setResources,
    setResource: (state, action: PayloadAction<IResource>) => {
      const resources = [...state.resources]
      const index = resources.findIndex(o => o._id === action.payload._id)
      resources.splice(index, 1, {
        ...action.payload,
        value: Math.floor(action.payload.value)
      })
      state.resources = [...resources]
      state.resource = {
        ...state.resource,
        [action.payload.default.key]: Math.floor(action.payload.value)
      }
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchResource.fulfilled, setResources)
  },
})
export const resourceAction = resourceSlice.actions
export const resourceReducer = resourceSlice.reducer