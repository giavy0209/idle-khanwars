import { Types } from "mongoose";
import { IUnitFullyPopulate } from "./IUnit";
import { IEnhanceDefination, IEnhanceDefinationFullyPopulate, MergePopulate } from "./utils";

export interface IMarchingUnit {
  _id: Types.ObjectId
  type: Types.ObjectId,
  total: number
  marching: Types.ObjectId
  enhance: IEnhanceDefination
}

export interface IMarchingUnitPullPopulate {
  type: IUnitFullyPopulate
  enhance: IEnhanceDefinationFullyPopulate
}

export type MarchingUnitFullyPopulate = MergePopulate<IMarchingUnit, IMarchingUnitPullPopulate>
export type MarchingUnitDoc = MongooseDocument<IMarchingUnit>