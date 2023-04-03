import { Types } from "mongoose";
import { CastleDoc, DefaultBuildingDoc } from ".";
import { IDefaultUpgradeFullyPopulate } from "./IDefaultUpgrade";
import { MergePopulate } from "./utils";

export interface IBuilding {
  castle: Types.ObjectId
  default: Types.ObjectId
  upgrade: {
    current: Types.ObjectId
    next: Types.ObjectId
  }
}

export interface IBuildingPullPopulate {
  castle: CastleDoc
  default: DefaultBuildingDoc
  upgrade: {
    current: IDefaultUpgradeFullyPopulate
    next: IDefaultUpgradeFullyPopulate
  }
}

export type IBuildingFullyPopulate = MergePopulate<IBuilding, IBuildingPullPopulate>
export type BuildingDoc = MongooseDocument<IBuilding>