import { Types } from "mongoose";
import { WorldDoc } from ".";
import { MergePopulate } from "./utils";

export interface IUser {
  username: string
  password: string
  world: Types.ObjectId
  status: string
  isSelectStart: boolean
  lastLogin: Date
  createdAt: Date
  updatedAt: Date
}

export interface IUserPullPopulate {
  world: WorldDoc
}

export type IUserFullyPopulate = MergePopulate<IUser, IUserPullPopulate>

export type UserDoc = MongooseDocument<IUser>