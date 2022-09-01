import { IResourceCost } from './resource-cost.interface'

export interface IDefaultUnitType {
  name: string
  key: string
  order: number
}

export interface IStrength {
  type: IDefaultUnitType
  value: number
}

export interface IDefaultUnit {
  name: string
  key: string
  order: number
  description: string
  path: string
  type: IDefaultUnitType
  building: string
  time: number
  speed: number
  cargo: number
  life: number
  range: number
  population: number
  resources: IResourceCost[]
  strength: IStrength[]
}