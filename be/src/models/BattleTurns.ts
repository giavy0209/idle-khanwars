import { AbstractModel } from "abstracts";
import { IBattleTurn } from "interfaces";
import { Schema } from "mongoose";
import { MODEL } from "constant";
import { BATTLE } from "constant/enums";

class BattleRounds extends AbstractModel<IBattleTurn> {
  constructor(tenantId: string) {
    super({ name: MODEL.battle_turns, tenantId })
    this.schema = new Schema<IBattleTurn>(
      {
        type: { type: Schema.Types.ObjectId, ref: MODEL.default_unit_types },
        round: { type: Schema.Types.ObjectId, index: true },
        owner: { type: String, enum: Object.values(BATTLE.ROUND.TURN.OWNER) }
      },
      {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
      }
    )

    this.schema.virtual('actions', {
      localField: "_id",
      foreignField: 'turn',
      ref: MODEL.battle_actions,
    })
  }
}
export default BattleRounds