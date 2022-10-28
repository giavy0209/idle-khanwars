import { Document, HydratedDocument, Types, UnpackedIntersection } from "mongoose";
import { IUser } from "./IUser";

export interface ICastle extends Document {
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
  user: IUser
}

export type ICastleFullyPopulate = UnpackedIntersection<HydratedDocument<ICastle, {}, {}>, ICastlePullPopulate>