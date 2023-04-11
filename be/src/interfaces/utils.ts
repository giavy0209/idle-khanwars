import { HydratedDocument, Types, UnpackedIntersection } from "mongoose"
import { IDefaultEnhanceFullyPopulate } from "./IDefaultEnhance"

export type MergePopulate<I, IP> = UnpackedIntersection<HydratedDocument<I, {}, {}>, IP>

export interface IEnhanceDefination {
  hp: Types.ObjectId
  cargo: Types.ObjectId
  attack: Types.ObjectId
}

export interface IEnhanceDefinationFullyPopulate {
  hp: IDefaultEnhanceFullyPopulate
  cargo: IDefaultEnhanceFullyPopulate
  attack: IDefaultEnhanceFullyPopulate
}