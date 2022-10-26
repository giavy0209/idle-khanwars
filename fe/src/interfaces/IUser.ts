import { IWorld } from "./IWorld"

export interface IUser {
  _id: string
  username: string
  world: IWorld
  status: string
  isSelectStart: boolean
  lastLogin: Date
  createdAt: Date
}