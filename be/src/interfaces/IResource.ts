import { Document, HydratedDocument, Types, UnpackedIntersection } from "mongoose";
import { IBuildingFullyPopulate } from "./IBuilding";
import { IDefaultResources } from "./IDefaultResources";

export interface IResource extends Document {
  castle: Types.ObjectId
  default: Types.ObjectId
  building: Types.ObjectId
  value: number
  lastUpdate: Date
}

export interface IResourcePullPopulate {
  default: IDefaultResources
  building: IBuildingFullyPopulate
}

export type IResourceFullyPopulate = UnpackedIntersection<HydratedDocument<IResource, {}, {}>, IResourcePullPopulate>