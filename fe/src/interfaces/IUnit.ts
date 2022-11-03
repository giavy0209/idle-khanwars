import { IBuilding } from "./IBuilding"
import { IDefaultEnhance } from "./IDefaultEnhance"
import { IDefaultUnit } from "./IDefaultUnit"

interface Enhance {
  hp: IDefaultEnhance
  attack: IDefaultEnhance
  cargo: IDefaultEnhance
}
export interface IUnit {
  castle: string
  building: IBuilding
  default: IDefaultUnit
  total: number
  inTower: number,
  enhance: {
    current: Enhance
    next: Enhance
  }
  _id: string
}