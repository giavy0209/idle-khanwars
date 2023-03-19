import { MARCHING } from "constant/enums"
import { IUnitFullyPopulate } from "interfaces"

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
    [k: string]: any
  }[]
}

export interface ICalcMarchingStats {
  from: { x: number, y: number }
  to: { x: number, y: number }
  units: IUnitFullyPopulate[]
}