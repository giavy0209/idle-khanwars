import { Types } from "mongoose";
import { MergePopulate } from "./utils";
import { BATTLE } from "constant/enums";
import { MarchingUnitFullyPopulate } from "./IMarchingUnit";

export interface IBattleRoundUnit {
  type: Types.ObjectId
  total: number
  round: Types.ObjectId
  owner: BATTLE.ROUND.UNIT.OWNER
}

export interface IBattleRoundUnitPullPopulate {
  type: MarchingUnitFullyPopulate
}

export type IBattleRoundUnitFullyPopulate = MergePopulate<IBattleRoundUnit, IBattleRoundUnitPullPopulate>
export type BattleRoundUnitDoc = MongooseDocument<IBattleRoundUnit>