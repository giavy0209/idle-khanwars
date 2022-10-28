import { Document, HydratedDocument, Types, UnpackedIntersection } from "mongoose";
import { IBuildingFullyPopulate } from "./IBuilding";

export interface IUpgrade extends Document {
  castle: Types.ObjectId
  building: Types.ObjectId
  startAt: Date
  endAt: Date
}

export interface IUpgradePullPopulate {
  building: IBuildingFullyPopulate
}

export type IUpgradeFullyPopulate = UnpackedIntersection<HydratedDocument<IUpgrade, {}, {}>, IUpgradePullPopulate>