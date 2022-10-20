import { IBuilding } from "./IBuilding"
import { IDefaultUnit } from "./IDefaultUnit"

export interface IUnit {
  castle: string
  building: IBuilding
  default: IDefaultUnit
  total: number
  inTower: number,
  _id: string
}