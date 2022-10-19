export interface ITraining {
  unit: string
  total: number
  left: number
  trained: number
  startAt: string
  endAt: string
  nextAt: string
}

interface InitialState {
  ttrainings:ITraining
}
const initialState:InitialState= {
  trainings:[]
}
export trainingSlice = createSlice({
  name:'training',
  initialState,
  reducers :{
    
  }
})