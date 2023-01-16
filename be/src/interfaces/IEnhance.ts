import { ENHANCE_TYPE, PROGRESS } from "constant/enums";
import { Document, Types } from "mongoose";
import { IUnitFullyPopulate } from "./IUnit";
import { MergePopulate } from "./utils";

export interface IEnhance extends Document {
  castle: Types.ObjectId
  unit: Types.ObjectId
  type: ENHANCE_TYPE
  progress: PROGRESS
  startAt: Date
  endAt: Date
}

export interface IEnhancePullPopulate {
  unit: IUnitFullyPopulate
}

export type IEnhanceFullyPopulate = MergePopulate<IEnhance, IEnhancePullPopulate>