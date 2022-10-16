import { Document, HydratedDocument, Types, UnpackedIntersection } from "mongoose";
import { ICastle, IDefaultBuilding } from ".";
import { IDefaultUpgradeFullyPopulate } from "./IDefaultUpgrade";

export default interface IBuilding extends Document {
  castle: Types.ObjectId
  default: Types.ObjectId
  isUpgrading: boolean
  upgrade: {
    current: Types.ObjectId
    next: Types.ObjectId
  }
  startAt: Date
  endAt: Date
}

export interface IBuildingPullPopulate {
  castle: ICastle
  default: IDefaultBuilding
  upgrade: {
    current: IDefaultUpgradeFullyPopulate
    next: IDefaultUpgradeFullyPopulate
  }
}

export type IBuildingFullyPopulate = UnpackedIntersection<HydratedDocument<IBuilding , {}, {}>,IBuildingPullPopulate>