import { Document, HydratedDocument, Types, UnpackedIntersection } from "mongoose";
import { ICastleFullyPopulate } from "./ICastle";
import { IDefaultResources } from "./IDefaultResources";
import { IUnitFullyPopulate } from "./IUnit";

export interface IMarching extends Document {
  startAt: Date
  arriveAt: Date
  homeAt: Date
  speed: number
  castle: Types.ObjectId
  population: number
  target: {
    castle: Types.ObjectId
    coordinate: {
      x: number
      y: number
    }
  }
  units: {
    type: Types.ObjectId
    value: number
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
    value: number
  }[]
  castle: ICastleFullyPopulate
  target: {
    castle: ICastleFullyPopulate
    coordinate: {
      x: number
      y: number
    }
  }
  cargo: {
    asArray: {
      type: IDefaultResources
      value: number
    }
    asObjet: IMarching['cargo']['asObject']
  }
}

export type IMarchingFullyPopulate = UnpackedIntersection<HydratedDocument<IMarching, {}, {}>, IMarchingPullPopulate>