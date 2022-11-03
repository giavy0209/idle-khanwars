import { Document, HydratedDocument, Types, UnpackedIntersection } from "mongoose";
import { IBuildingFullyPopulate } from "./IBuilding";
import { IDefaultEnhance } from "./IDefaultEnhance";
import { IDefaultUnitFullyPopulate } from "./IDefaultUnits";

export interface IUnit extends Document {
  castle: Types.ObjectId
  building: Types.ObjectId
  default: Types.ObjectId
  total: number
  inTower: number
  enhance: {
    current: {
      hp: Types.ObjectId
      cargo: Types.ObjectId
      attack: Types.ObjectId
    }
    next: {
      hp: Types.ObjectId
      cargo: Types.ObjectId
      attack: Types.ObjectId
    }
  }
}

export interface IUnitPullPopulate {
  enhance: {
    current: {
      hp: IDefaultEnhance
      cargo: IDefaultEnhance
      attack: IDefaultEnhance
    }
    next: {
      hp: IDefaultEnhance
      cargo: IDefaultEnhance
      attack: IDefaultEnhance
    }
  }
  building: IBuildingFullyPopulate,
  default: IDefaultUnitFullyPopulate
}

export type IUnitFullyPopulate = UnpackedIntersection<HydratedDocument<IUnit, {}, {}>, IUnitPullPopulate>