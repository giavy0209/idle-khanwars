import { Document, HydratedDocument, Types, UnpackedIntersection } from "mongoose";
import { IBuildingFullyPopulate } from "./IBuilding";
import { IDefaultUnitFullyPopulate } from "./IDefaultUnits";

export default interface IUnit extends Document {
  castle: Types.ObjectId
  building: Types.ObjectId
  default: Types.ObjectId
  total: number
  inTower: number
}

export interface IUnitPullPopulate {
  building: IBuildingFullyPopulate,
  default: IDefaultUnitFullyPopulate
}

export type IUnitFullyPopulate = UnpackedIntersection<HydratedDocument<IUnit, {}, {}>, IUnitPullPopulate>