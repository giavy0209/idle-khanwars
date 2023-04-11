import { Types } from "mongoose";
import { MergePopulate } from "./utils";
import { IBattleActionFullyPopulate } from "./IBattleAction";
import { DefaultUnitTypeDoc } from "./IDefaultUnitType";
import { BATTLE } from "constant/enums";

export interface IBattleTurn {
  type: Types.ObjectId
  round: Types.ObjectId
  owner: BATTLE.ROUND.TURN.OWNER
}

export interface IBattleTurnPullPopulate {
  type: DefaultUnitTypeDoc
  actions: IBattleActionFullyPopulate
}

export type IBattleTurnFullyPopulate = MergePopulate<IBattleTurn, IBattleTurnPullPopulate>
export type BattleTurnDoc = MongooseDocument<IBattleTurn>