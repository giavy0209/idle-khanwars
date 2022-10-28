import { Document } from "mongoose";

export interface IDefaultUnitType extends Document {
  name: string
  key: string
  order: number
}