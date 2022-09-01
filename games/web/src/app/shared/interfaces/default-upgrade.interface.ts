import { IResourceCost } from './resource-cost.interface'

export interface IDefaultUpgrade {
  building: string
  level: number
  generate: number
  time: number
  resources: IResourceCost[]
}