import { Document, MergeType, Types } from "mongoose";
import { IDefaultResources } from "./IDefaultResources";
import { MergePopulate } from "./utils";

export interface IDefaultEnhance extends Document {
  level: number
  unit: Types.ObjectId
  type: string
  value: number
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

export interface IDefaultEnhancePullPopulate {
  resources: MergeType<IDefaultEnhance['resources'], {
    asArray: {
      type: IDefaultResources
      value: number
    }[]
  }>
}


export type IDefaultEnhanceFullyPopulate = MergePopulate<IDefaultEnhance, IDefaultEnhancePullPopulate>