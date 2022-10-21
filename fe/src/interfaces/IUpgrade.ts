import { IBuilding } from "./IBuilding"

export interface IUpgrade {
  _id: string
  castle: string
  building: IBuilding
  startAt: Date
  endAt: Date
}