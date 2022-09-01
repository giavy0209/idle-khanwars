import { IBuilding } from '../building/building.interface'
import { IResource } from '../resource/resource.interface'
import { ITraining } from '../training/training.interface'
import { IUnit } from '../unit/unit.interface'
import { IUpgrade } from '../upgrade/upgrade.interface'

export interface ICastle {
  _id: string
  user: string
  coordinate: {
    x: number
    y: number
  }
  isCapital: boolean
}

export interface ICastleDetail extends ICastle {
  resources: IResource[]
  buildings: IBuilding[]
  units: IUnit[]
  trainings: ITraining[]
  upgrades: IUpgrade[]
}