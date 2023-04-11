import { HydratedDocument, Types, UnpackedIntersection } from "mongoose";
import { IBuildingFullyPopulate } from "./IBuilding";
import { IDefaultUnitFullyPopulate } from "./IDefaultUnits";
import { IEnhanceDefination, IEnhanceDefinationFullyPopulate } from "./utils";

export interface IUnit {
  castle: Types.ObjectId
  building: Types.ObjectId
  default: Types.ObjectId
  total: number
  inTower: number
  enhance: {
    current: IEnhanceDefination
    next: IEnhanceDefination
  }
}

export interface IUnitPullPopulate {
  enhance: {
    current: IEnhanceDefinationFullyPopulate
    next: IEnhanceDefinationFullyPopulate
  }
  building: IBuildingFullyPopulate,
  default: IDefaultUnitFullyPopulate
}

export type IUnitFullyPopulate = UnpackedIntersection<HydratedDocument<IUnit, {}, {}>, IUnitPullPopulate>