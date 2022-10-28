import { Document } from "mongoose";

export interface IDefaultResources extends Document {
  name: string
  key: string
  path: string
}