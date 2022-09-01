import { IDefaultResource } from '../../interfaces/default-resource.interface'
import { IBuilding } from '../building/building.interface'

export interface IResource {
  _id: string
  castle: string
  default: IDefaultResource
  building: IBuilding
  value: number
}