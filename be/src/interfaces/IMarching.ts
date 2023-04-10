import { MARCHING } from "constant/enums";
import { HydratedDocument, Types, UnpackedIntersection } from "mongoose";
import { ICastleFullyPopulate } from "./ICastle";
import { IDefaultResources } from "./IDefaultResources";
import { IUnitFullyPopulate } from "./IUnit";

export interface IMarching {
  startAt: Date
  arriveAt: Date
  homeAt: Date
  speed: number
  distance: number
  population: number
  from: Types.ObjectId
  to: Types.ObjectId
  coordinates: {
    x: number
    y: number
  }
  status: MARCHING.STATUS
  action: MARCHING.ACTION
  units: {
    type: Types.ObjectId
    total: number
  }[]
  cargo: {
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

export interface IMarchingPullPopulate {
  units: {
    type: IUnitFullyPopulate,
    total: number
  }[]
  from: ICastleFullyPopulate
  to: ICastleFullyPopulate
  cargo: {
    asArray: {
      type: IDefaultResources
      value: number
    }
    asObjet: IMarching['cargo']['asObject']
  }
}

export type IMarchingFullyPopulate = UnpackedIntersection<HydratedDocument<IMarching, {}, {}>, IMarchingPullPopulate>