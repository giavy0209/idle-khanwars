import { Document, HydratedDocument, Types, UnpackedIntersection } from "mongoose";
import { IDefaultBuilding } from "./IDefaultBuilding";
import { IDefaultResources } from "./IDefaultResources";
import { IDefaultUnitType } from "./IDefaultUnitType";
export interface IDefaultUnits extends Document {
  name: string
  key: string
  order: number
  description: string
  path: string
  building: Types.ObjectId
  type: Types.ObjectId
  time: number
  speed: number
  cargo: number
  life: number
  range: number
  population: number
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
  strength: {
    asArray: {
      type: Types.ObjectId
      value: number
    }[]
    asObject: {
      infantry: number,
      archers: number,
      cavalry: number,
      siege: number
      wall: number
    }
  },
}

export interface IDefaultUnitsPullPopulate {
  type: IDefaultUnitType,
  building: IDefaultBuilding,
  resources: {
    asArray: {
      type: IDefaultResources
      value: number
    }[],
    asObject: IDefaultUnits['resources']['asObject']
  }
  strength: {
    asArray: {
      type: IDefaultUnitType
      value: number
    }[]
    asObject: IDefaultUnits['strength']['asObject']
  },
}

export type IDefaultUnitFullyPopulate = UnpackedIntersection<HydratedDocument<IDefaultUnits, {}, {}>, IDefaultUnitsPullPopulate>