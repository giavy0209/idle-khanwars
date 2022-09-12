import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import callAPI from 'callAPI';
export interface Chat {
  _id ?: string,
  user? : {
    username : string
  },
  content?:string
  createdAt ?: Date,
}
export interface chatState {
  chatList : Chat[]
}
const initialState: chatState = {
  chatList : []
};

export const fetchChats = createAsyncThunk(
  'chat/fetchChats',
  async () => {
    const res = await callAPI.get('/chat')
    return res.data;
  }
);

export const chatSlice = createSlice({
  name: 'user',
  initialState,
  reducers : {
    chat : (state,action: PayloadAction<Chat>) => {
      state.chatList = [action.payload,...state.chatList , ]
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchChats.fulfilled, (state, action) => {
      state.chatList = action.payload
    })
  }
})

export const {chat} = chatSlice.actions

export default chatSlice.reducer