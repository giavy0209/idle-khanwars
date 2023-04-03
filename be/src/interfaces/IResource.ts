import { HydratedDocument, Types, UnpackedIntersection } from "mongoose";
import { IBuildingFullyPopulate } from "./IBuilding";
import { DefaultResourcesDoc } from "./IDefaultResources";

export interface IResource {
  castle: Types.ObjectId
  default: Types.ObjectId
  building: Types.ObjectId
  value: number
  lastUpdate: Date
}

export interface IResourcePullPopulate {
  default: DefaultResourcesDoc
  building: IBuildingFullyPopulate
}

export type IResourceFullyPopulate = UnpackedIntersection<HydratedDocument<IResource, {}, {}>, IResourcePullPopulate>