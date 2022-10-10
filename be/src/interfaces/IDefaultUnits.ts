import { Document, Types } from "mongoose";

export default interface IDefaultUnits extends Document {
  name: string
  description: string
  path : string
  building: Types.ObjectId
  type: Types.ObjectId
  time: number
  speed: number
  cargo: number
  life: number
  range: number
  population: number
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
  strength: {
    asArray : {
      type: Types.ObjectId
      value:number
    }[]
    asObject : {
      infantry: number,
      archers: number,
      cavalry: number,
      siege: number
      wall: number
    }
  },
}