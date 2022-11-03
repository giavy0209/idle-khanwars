import { Document, Types } from "mongoose";
import { IUnitFullyPopulate } from "./IUnit";

export interface IEnhance extends Document {
  castle: Types.ObjectId
  unit: Types.ObjectId
  startAt: Date
  endAt: Date
}

export interface IEnhancePullPopulate {
  unit: IUnitFullyPopulate
}