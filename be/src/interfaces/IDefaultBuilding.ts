import { Document, Types } from "mongoose";

export default interface IDefaultBuilding extends Document {
  name : string
  description : string
  type : string
  path:string
  resource : Types.ObjectId
}