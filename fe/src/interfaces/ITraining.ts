import { IUnit } from "./IUnit"

export interface ITraining {
  _id: string
  unit: IUnit
  total: number
  left: number
  trained: number
  startAt: string
  endAt: string
  nextAt: string
}