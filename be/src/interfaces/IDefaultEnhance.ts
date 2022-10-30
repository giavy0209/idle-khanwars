import { Document, Types } from "mongoose";

export interface IDefaultEnhance extends Document {
  level: number
  unit: Types.ObjectId
  type: string
  value: number
  time: number
  resources: {
    asArray: {
      type: Types.ObjectId
      value: number
    }[]
    asObject: {
      gold: number
      iron: number
      wood: number
      food: number
    }
  }
}