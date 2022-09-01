import { IUnitFully } from '../unit/unit.interface'

export interface ITraining {
  _id: string
  unit: string
  castle: string
  total: number
  left: number
  nextAt: Date
  endAt: Date
  deletedAt?: Date
}

export interface ITrainingUnit {
  _id: string
  unit: IUnitFully
  castle: string
  total: number
  left: number
  nextAt: Date
  endAt: Date
}