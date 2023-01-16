import { ENHANCE } from "const"
import { IUnit } from "./IUnit"

export interface IEnhance {
  _id: string
  castle: string
  unit: IUnit
  type: ENHANCE
  startAt: string
  endAt: string
}