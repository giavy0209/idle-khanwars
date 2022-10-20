import { IDefaultUpgrade } from "./IDefaultUpgrade"

export interface IBuilding {
  _id: string
  default: {
    name: string
    key: string
    description: string
    type: string
    path: string
  }
  upgrade: {
    current: IDefaultUpgrade,
    next: IDefaultUpgrade
  }
}