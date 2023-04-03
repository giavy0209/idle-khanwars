import { HydratedDocument, Types, UnpackedIntersection } from "mongoose";
import { IUnitFullyPopulate } from "./IUnit";

export interface ITraining {
  castle: Types.ObjectId
  unit: Types.ObjectId
  building: Types.ObjectId
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

export type ITrainingFullyPopulate = UnpackedIntersection<HydratedDocument<ITraining, {}, {}>, ITrainingPullPopulate>