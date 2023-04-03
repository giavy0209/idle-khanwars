import { ActionReducerMapBuilder, AsyncThunkPayloadCreator, createAsyncThunk, createSlice, Slice, SliceCaseReducers, ValidateSliceCaseReducers } from "@reduxjs/toolkit";

export default abstract class AbstractSlice<S, R extends SliceCaseReducers<S> = SliceCaseReducers<S>,> {
  name: string;
  apiPrefix: string;
  initialState: S
  reducers: ValidateSliceCaseReducers<S, R>
  slice!: Slice<S, R, string>

  constructor(
    {
      name,
      apiPrefix,
      initialState,
      reducers,
    }: {
      name: string
      apiPrefix: string
      initialState: S
      reducers: ValidateSliceCaseReducers<S, R>
    }
  ) {
    this.name = name
    this.apiPrefix = apiPrefix
    this.initialState = initialState
    this.reducers = reducers
  }

  createSlice(
    extraReducers: (builder: ActionReducerMapBuilder<S>) => void
  ) {
    this.slice = createSlice<S, R>({
      name: this.name,
      initialState: this.initialState,
      reducers: this.reducers,
      extraReducers: extraReducers
    })
  }

  createAsyncThunk<Returned = any, ThunkArg = void>(
    action: string,
    payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, {}>
  ) {
    return createAsyncThunk<Returned, ThunkArg>(
      `${this.name}/${action}`,
      payloadCreator
    )
  }

}