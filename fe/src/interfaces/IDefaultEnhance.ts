import { IDefaultResource } from "./IDefaultResource"

export interface IDefaultEnhance {
  level: number
  type: string
  value: number
  time: number
  resources: {
    asArray: {
      type: IDefaultResource
      value: number
    }[]
    asObject: {
      gold: number
      iron: number
      wood: number
      food: number
    }
  }
}