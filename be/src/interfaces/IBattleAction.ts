import { Types } from "mongoose";
import { MergePopulate } from "./utils";
import { ICastleFullyPopulate } from "./ICastle";
import { MarchingUnitFullyPopulate } from "./IMarchingUnit";
import { DefaultUnitTypeDoc } from "./IDefaultUnitType";

export interface IBattleAction {
  turn: Types.ObjectId
  attacker: {
    castle: Types.ObjectId
    unit: Types.ObjectId
    total: number
    damage: number
    type: Types.ObjectId
  }
  defender: {
    castle: Types.ObjectId
    unit: Types.ObjectId
    total: number
    type: Types.ObjectId
  }
}

export interface IBattleActionPullPopulate {
  attacker: Omit<IBattleAction['attacker'], 'castle' | 'unit' | 'type'> & {
    castle: ICastleFullyPopulate
    unit: MarchingUnitFullyPopulate
    type: DefaultUnitTypeDoc
  }
  defender: Omit<IBattleAction['defender'], 'castle' | 'unit' | 'type'> & {
    castle: ICastleFullyPopulate
    unit: MarchingUnitFullyPopulate
    type: DefaultUnitTypeDoc
  }
}
export type IBattleActionFullyPopulate = MergePopulate<IBattleAction, IBattleActionPullPopulate>
export type BattleActionDoc = MongooseDocument<IBattleAction>