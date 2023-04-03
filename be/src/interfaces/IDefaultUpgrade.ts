import { HydratedDocument, Types, UnpackedIntersection } from "mongoose";
import { IDefaultBuilding } from "./IDefaultBuilding";
import { DefaultResourcesDoc } from "./IDefaultResources";

export interface IDefaultUpgrade {
  building: Types.ObjectId
  level: number
  generate: number
  time: number
  resources: {
    asArray: {
      type: Types.ObjectId
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

export interface IDefaultUpgradePullPopulate {
  building: IDefaultBuilding,
  resources: {
    asArray: {
      type: DefaultResourcesDoc
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

export type IDefaultUpgradeFullyPopulate = UnpackedIntersection<HydratedDocument<IDefaultUpgrade, {}, {}>, IDefaultUpgradePullPopulate>