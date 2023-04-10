import { MARCHING } from "constant/enums"
import { IUnitFullyPopulate } from "interfaces"
import { Types } from "mongoose"

export interface IPostInput {
  to?: string
  coordinates?: {
    x: number,
    y: number
  }
  action: MARCHING.ACTION
  units: {
    _id: string
    selected: number
  }[]
  resources?: {
    type: Types.ObjectId
    value: number
  }[]
}

export interface ICalcMarchingStats {
  from: { x: number, y: number }
  to: { x: number, y: number }
  units: IUnitFullyPopulate[]
}

export interface IPatchInput {
  action: 'RETURN'
}