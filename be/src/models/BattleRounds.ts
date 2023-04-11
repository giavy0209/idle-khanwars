import { AbstractModel } from "abstracts";
import { IBattleRound } from "interfaces";
import { Schema } from "mongoose";
import { MODEL } from "constant";
import { BATTLE } from "constant/enums";

class BattleRounds extends AbstractModel<IBattleRound> {
  constructor(tenantId: string) {
    super({ name: MODEL.battle_rounds, tenantId })
    this.schema = new Schema<IBattleRound>(
      {
        count: { type: Number },
        battle: { type: Schema.Types.ObjectId, index: true }
      },
      {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
      }
    )

    this.schema.virtual('attacker.start', {
      localField: "_id",
      foreignField: 'round',
      ref: MODEL.battle_round_units,
      match: { owner: BATTLE.ROUND.UNIT.OWNER.ATTACKER_START }
    })

    this.schema.virtual('attacker.end', {
      localField: "_id",
      foreignField: 'round',
      ref: MODEL.battle_round_units,
      match: { owner: BATTLE.ROUND.UNIT.OWNER.ATTACKER_END }
    })

    this.schema.virtual('attacker.dead', {
      localField: "_id",
      foreignField: 'round',
      ref: MODEL.battle_round_units,
      match: { owner: BATTLE.ROUND.UNIT.OWNER.ATTACKER_DEAD }
    })

    this.schema.virtual('defender.start', {
      localField: "_id",
      foreignField: 'round',
      ref: MODEL.battle_round_units,
      match: { owner: BATTLE.ROUND.UNIT.OWNER.DEFENDER_START }
    })

    this.schema.virtual('defender.end', {
      localField: "_id",
      foreignField: 'round',
      ref: MODEL.battle_round_units,
      match: { owner: BATTLE.ROUND.UNIT.OWNER.DEFENDER_END }
    })

    this.schema.virtual('defender.dead', {
      localField: "_id",
      foreignField: 'round',
      ref: MODEL.battle_round_units,
      match: { owner: BATTLE.ROUND.UNIT.OWNER.DEFENDER_DEAD }
    })


  }
}
export default BattleRounds