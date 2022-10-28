import { Document, HydratedDocument, Types, UnpackedIntersection } from "mongoose";
import { ICastle, IDefaultBuilding } from ".";
import { IDefaultUpgradeFullyPopulate } from "./IDefaultUpgrade";

export interface IBuilding extends Document {
  castle: Types.ObjectId
  default: Types.ObjectId
  upgrade: {
    current: Types.ObjectId
    next: Types.ObjectId
  }
}

export interface IBuildingPullPopulate {
  castle: ICastle
  default: IDefaultBuilding
  upgrade: {
    current: IDefaultUpgradeFullyPopulate
    next: IDefaultUpgradeFullyPopulate
  }
}

export type IBuildingFullyPopulate = UnpackedIntersection<HydratedDocument<IBuilding, {}, {}>, IBuildingPullPopulate>