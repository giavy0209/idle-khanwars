import { Document } from "mongoose";

export default interface IWorld extends Document {
  tenant: string
}