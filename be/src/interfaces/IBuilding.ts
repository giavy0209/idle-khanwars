import { Document, Types } from "mongoose";
import {ICastle,IDefaultBuilding} from ".";

export default interface IBuilding extends Document {
  castle : Types.ObjectId
  default : Types.ObjectId
  isUpgrading : boolean
  value : number
  level : number
  startAt : Date
  endAt : Date
}

export interface IBuildingPullPopulate {
  castle : ICastle
  default : IDefaultBuilding
}