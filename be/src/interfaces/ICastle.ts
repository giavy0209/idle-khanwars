import { Document, Types } from "mongoose";

export default interface ICastle extends Document {
  user : Types.ObjectId
  loyal : number
  population : number
  name :string
  isCapital : boolean
  lastUpdate : Date
}