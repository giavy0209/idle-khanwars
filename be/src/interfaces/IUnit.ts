import { Document, Types } from "mongoose";

export default interface IUnit extends Document {
  castle : Types.ObjectId
  building : Types.ObjectId
  default : Types.ObjectId
  total : number
  inTower : number
}