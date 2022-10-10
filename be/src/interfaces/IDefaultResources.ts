import { Document } from "mongoose";

export default interface IDefaultResources extends Document {
  name: string
  key: string
}