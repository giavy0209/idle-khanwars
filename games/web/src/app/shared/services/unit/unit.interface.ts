import { IDefaultEnhance } from 'app/shared/interfaces/default-enhance.interface'
import { IDefaultUnit } from 'app/shared/interfaces/default-unit.interface'
import { IBuilding } from '../building/building.interface'

export interface IEnhanceDetail {
  attack: IDefaultEnhance
  hp: IDefaultEnhance
  cargo: IDefaultEnhance
}

export interface IUnit {
  _id: string
  building: string
  default: IDefaultUnit
  total: number
  inTower: number
  enhance: {
    current: IEnhanceDetail
    next: IEnhanceDetail
  }
}

export interface IUnitFully extends Omit<IUnit, 'building'> {
  building: IBuilding
}
