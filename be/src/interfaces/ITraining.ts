import { Document, HydratedDocument, Types, UnpackedIntersection } from "mongoose";
import { IUnitFullyPopulate } from "./IUnit";

export default interface ITraining extends Document {
  unit: Types.ObjectId
  total: number
  left: number
  trained: number
  startAt: Date
  endAt: Date
  nextAt: Date
}

export interface ITrainingPullPopulate {
  unit: IUnitFullyPopulate
}

export type IResourceFullyPopulate = UnpackedIntersection<HydratedDocument<ITraining, {}, {}>, ITrainingPullPopulate>