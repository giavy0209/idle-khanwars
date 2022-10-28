import { Document, HydratedDocument, Types, UnpackedIntersection } from "mongoose";
import { IWorld } from ".";

export interface IUser extends Document {
  username: string
  password: string
  world: Types.ObjectId
  status: string
  isSelectStart: boolean
  lastLogin: Date
  createdAt: Date
}

export interface IUserPullPopulate {
  world: IWorld
}

export type IUserFullyPopulate = UnpackedIntersection<HydratedDocument<IUser, {}, {}>, IUserPullPopulate>