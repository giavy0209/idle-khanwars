import { Document, HydratedDocument, Types, UnpackedIntersection } from "mongoose";
import { IDefaultBuilding } from "./IDefaultBuilding";
import { IDefaultResources } from "./IDefaultResources";

export interface IDefaultUpgrade extends Document {
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
      type: IDefaultResources
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