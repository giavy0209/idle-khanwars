import { Document, Types } from "mongoose";

export interface IDefaultBuilding extends Document {
  name: string
  key: string
  description: string
  type: string
  path: string
  resource: Types.ObjectId
}