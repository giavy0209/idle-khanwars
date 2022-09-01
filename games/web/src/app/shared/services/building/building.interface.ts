import { IDefaultBuilding } from 'app/shared/interfaces/default-building.interface'
import { IDefaultUpgrade } from 'app/shared/interfaces/default-upgrade.interface'

export interface IBuilding {
  _id: string
  default: IDefaultBuilding
  upgrade: {
    current: IDefaultUpgrade
    next: IDefaultUpgrade
  }
}