import { Types } from "mongoose";
import { MergePopulate } from "./utils";
import { BATTLE } from "constant/enums";
import { IMarchingFullyPopulate } from "./IMarching";

export interface IBattleRoundUnit {
  type: Types.ObjectId
  total: number
  round: Types.ObjectId
  owner: BATTLE.ROUND.UNIT.OWNER
}

export interface IBattleRoundUnitPullPopulate {
  type: IMarchingFullyPopulate
}

export type IBattleRoundUnitFullyPopulate = MergePopulate<IBattleRoundUnit, IBattleRoundUnitPullPopulate>
export type BattleRoundUnitDoc = MongooseDocument<IBattleRoundUnit>