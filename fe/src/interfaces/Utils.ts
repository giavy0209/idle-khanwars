import { IDefaultResource } from "./IDefaultResource"

export type ResourceData = {
  asArray: {
    type: IDefaultResource
    _id: string
    value: number
  }[]
  asObject: {
    gold: number
    iron: number
    wood: number
    food: number
  }
}