import { AbstractModel } from "abstracts";
import { IBattleAction } from "interfaces";
import { Schema } from "mongoose";
import { MODEL } from "constant";

class BattleRounds extends AbstractModel<IBattleAction> {
  constructor(tenantId: string) {
    super({ name: MODEL.battle_actions, tenantId })
    this.schema = new Schema<IBattleAction>(
      {
        turn: { type: Schema.Types.ObjectId, index: true },
        attacker: {
          castle: { type: Schema.Types.ObjectId, ref: MODEL.castles },
          unit: { type: Schema.Types.ObjectId, ref: MODEL.marching_units },
          totalUnit: { type: Number },
          totalDamage: { type: Number },
          remaining: { type: Number },
          type: { type: Schema.Types.ObjectId, ref: MODEL.default_unit_types }
        },
        defender: {
          castle: { type: Schema.Types.ObjectId, ref: MODEL.castles },
          unit: { type: Schema.Types.ObjectId, ref: MODEL.marching_units },
          totalUnit: { type: Number },
          totalHP: { type: Number },
          remaining: { type: Number },
          type: { type: Schema.Types.ObjectId, ref: MODEL.default_unit_types }
        }
      },
      {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
      }
    )

    this.schema.virtual('', {
      localField: "_id",
      foreignField: 'battle',
      ref: MODEL.battle_rounds,
    })
  }
}
export default BattleRounds