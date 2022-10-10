import { Types } from "mongoose"

export interface IGetInput {
  castle : string
}

export interface IisEnoughResourceInput {
  type: Types.ObjectId
  value: number
}