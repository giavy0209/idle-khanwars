import { Types } from "mongoose";
import { MergePopulate } from "./utils";
import { IBattleRoundUnitFullyPopulate } from "./IBattleRoundUnit";

export interface IBattleRound {
  count: number
  battle: Types.ObjectId
}

export interface IBattleRoundPullPopulate {
  attacker: {
    start: IBattleRoundUnitFullyPopulate
    end: IBattleRoundUnitFullyPopulate
    dead: IBattleRoundUnitFullyPopulate
  }
  defender: {
    start: IBattleRoundUnitFullyPopulate
    end: IBattleRoundUnitFullyPopulate
    dead: IBattleRoundUnitFullyPopulate
  }
}

export type IBattleRoundFullyPopulate = MergePopulate<IBattleRound, IBattleRoundPullPopulate>
export type BattleRoundDoc = MongooseDocument<IBattleRound>