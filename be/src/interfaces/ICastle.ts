import { Types } from "mongoose";
import { UserDoc } from "./IUser";
import { MergePopulate } from "./utils";

export interface ICastle {
  user: Types.ObjectId
  loyal: number
  population: number
  name: string
  isCapital: boolean
  coordinate: {
    x: number
    y: number
  }
  lastUpdate: Date
}

export interface ICastlePullPopulate {
  user: UserDoc
}

export type ICastleFullyPopulate = MergePopulate<ICastle, ICastlePullPopulate>

export type CastleDoc = MongooseDocument<ICastle>