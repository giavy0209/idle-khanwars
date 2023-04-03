import { PROGRESS } from "constant/enums";
import { HydratedDocument, Types, UnpackedIntersection } from "mongoose";
import { IBuildingFullyPopulate } from "./IBuilding";

export interface IUpgrade {
  castle: Types.ObjectId
  building: Types.ObjectId
  progress: PROGRESS
  startAt: Date
  endAt: Date
}

export interface IUpgradePullPopulate {
  building: IBuildingFullyPopulate
}

export type IUpgradeFullyPopulate = UnpackedIntersection<HydratedDocument<IUpgrade, {}, {}>, IUpgradePullPopulate>