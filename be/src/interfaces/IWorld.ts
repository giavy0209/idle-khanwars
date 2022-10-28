import { Document } from "mongoose";

export interface IWorld extends Document {
  name: string
  speed: number
  tenant: string
  status: string
}