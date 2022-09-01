import { IBuilding } from '../building/building.interface'

export interface IUpgrade {
  _id: string
  castle: string
  building: string
  endAt: Date
  deletedAt: Date
}

export interface IUpgradeFully extends Omit<IUpgrade, 'building'> {
  building: IBuilding
}