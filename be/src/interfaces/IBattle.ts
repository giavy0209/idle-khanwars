import { Types } from "mongoose";
import { CastleDoc, IBattleRoundFullyPopulate, UserDoc } from ".";
import { MergePopulate } from "./utils";

export interface IBattle {
  marching: Types.ObjectId,

  attacker: Types.ObjectId
  defender: Types.ObjectId

  attackerCastle: Types.ObjectId
  defenderCastle: Types.ObjectId

  winner: Types.ObjectId
  loser: Types.ObjectId

  winnerExp: number
  loserExp: number
}

export interface IBattlePullPopulate {
  attacker: UserDoc
  defender: UserDoc

  attackerCastle: CastleDoc
  defenderCastle: CastleDoc

  winner: UserDoc
  loser: UserDoc

  rounds: IBattleRoundFullyPopulate
}

export type IBattleFullyPopulate = MergePopulate<IBattle, IBattlePullPopulate>
export type BattleDoc = MongooseDocument<IBattle>