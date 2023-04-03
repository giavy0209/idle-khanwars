import { ResourceData } from "./Utils"

export interface IDefaultUpgrade {
  building: {
    type: string
    key: string
  }
  level: number
  generate: number
  time: number
  resources: ResourceData
}