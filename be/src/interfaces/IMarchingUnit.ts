import { Types } from "mongoose";
import { IUnitFullyPopulate } from "./IUnit";
import { MergePopulate } from "./utils";

export interface IMarchingUnit {
  _id: Types.ObjectId
  type: Types.ObjectId,
  total: number
  marching: Types.ObjectId
}

export interface IMarchingUnitPullPopulate {
  type: IUnitFullyPopulate
}

export type MarchingUnitFullyPopulate = MergePopulate<IMarchingUnit, IMarchingUnitPullPopulate>
export type MarchingUnitDoc = MongooseDocument<IMarchingUnit>