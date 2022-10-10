import { Document, Types } from "mongoose";

export default interface IDefaultUpgrade extends Document {
  building: Types.ObjectId
  level: number
  generate: number
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