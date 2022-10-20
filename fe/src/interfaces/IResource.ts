import { IBuilding } from "./IBuilding"
import { IDefaultResource } from "./IDefaultResource"

export interface IResource {
  _id: string
  castle: string
  default: IDefaultResource
  building: IBuilding
  value: number
  lastUpdate: Date
}