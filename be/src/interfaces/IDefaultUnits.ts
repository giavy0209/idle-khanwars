import { Types } from "mongoose";
import { DefaultBuildingDoc } from "./IDefaultBuilding";
import { DefaultResourcesDoc } from "./IDefaultResources";
import { DefaultUnitTypeDoc } from "./IDefaultUnitType";
import { MergePopulate } from "./utils";
import { DefaultUnitTypes } from "models";
export interface IDefaultUnits {
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
  type: DefaultUnitTypes,
  building: DefaultBuildingDoc,
  resources: {
    asArray: {
      type: DefaultResourcesDoc
      value: number
    }[],
    asObject: IDefaultUnits['resources']['asObject']
  }
  strength: {
    asArray: {
      type: DefaultUnitTypeDoc
      value: number
    }[]
    asObject: IDefaultUnits['strength']['asObject']
  },
}

export type IDefaultUnitFullyPopulate = MergePopulate<IDefaultUnits, IDefaultUnitsPullPopulate>

export type DefaultUnitsDoc = MongooseDocument<IDefaultUnits>