import { IWorld } from "./IWorld"

export interface IUser {
  _id: string
  username: string
  world: IWorld
  status: string
  lastLogin: Date
  createdAt: Date
}