import { Types } from "mongoose";
import { MergePopulate } from "./utils";
import { DefaultResourcesDoc } from ".";

export interface IMarchingCago {
  _id: Types.ObjectId
  type: Types.ObjectId,
  value: number
  marching: Types.ObjectId
}

export interface IMarchingCagoPullPopulate {
  type: DefaultResourcesDoc
}

export type MarchingCargoFullyPopulate = MergePopulate<IMarchingCago, IMarchingCagoPullPopulate>
export type MarchingCargoDoc = MongooseDocument<IMarchingCago>