import { IBuilding } from "./IBuilding"

export interface IUpgrade {
  castle: string
  building: IBuilding
  startAt: Date
  endAt: Date
}