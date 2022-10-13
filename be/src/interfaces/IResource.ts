import { Document, Types } from "mongoose";
import IBuilding from "./IBuilding";
import IDefaultResources from "./IDefaultResources";

export default interface IResource extends Document {
  castle : Types.ObjectId
  default : Types.ObjectId
  building : Types.ObjectId
  value : number
  lastUpdate : Date
}

export interface IResourcePullPopulate {
  default : IDefaultResources
  buillding : IBuilding
}