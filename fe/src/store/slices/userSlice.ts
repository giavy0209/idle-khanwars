import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import callAPI from "callAPI"
import { IUser } from "interfaces"
import { storage } from "utils"

export interface UserState {
  user: Partial<IUser>
  token: string
}
const initialState: UserState = {
  user: {},
  token: ''
}

export interface LoginReturn {
  user: IUser,
  token: string
}
export interface LoginPayload {
  username: string
  password: string
  world: string
}
export const login = createAsyncThunk<LoginReturn, LoginPayload>(
  'user/Login',
  async (payload) => {
    const res = await callAPI.post('/users/login', payload, { toastSuccess: true })
    return res.data
  }
)
export const signup = createAsyncThunk<LoginReturn, LoginPayload>(
  'user/Signup',
  async (payload) => {
    const res = await callAPI.post('/users', payload, { toastSuccess: true })
    return res.data
  }
)
export const fetchCurrent = createAsyncThunk<IUser>(
  'user/Current',
  async () => {
    const res = await callAPI.get('/users/my')
    return res.data
  }
)
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    user: (state, action: PayloadAction<LoginReturn['user']>) => {
      state.user = action.payload
    },
    token: (state, action: PayloadAction<LoginReturn['token']>) => {
      state.token = action.payload
    }
  },
  extraReducers(builder) {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token
        state.user = action.payload.user
        storage.setToken(action.payload.token)
      })
      .addCase(fetchCurrent.fulfilled, (state, action) => {
        state.user = action.payload
      })
  },
})

export default userSlice