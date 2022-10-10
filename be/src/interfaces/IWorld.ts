import { Document } from "mongoose";

export default interface IWorld extends Document {
  name : string
  speed : number
  tenant: string
  status : string
}