import { AbstractModel } from "abstracts";
import { IBattle } from "interfaces";
import { Schema } from "mongoose";
import { MODEL } from "constant";

class Battles extends AbstractModel<IBattle> {
  constructor(tenantId: string) {
    super({ name: MODEL.battles, tenantId })
    this.schema = new Schema<IBattle>(
      {
        attacker: { type: Schema.Types.ObjectId },
        defender: { type: Schema.Types.ObjectId },
        marching: { type: Schema.Types.ObjectId },
        winner: { type: Schema.Types.ObjectId, ref: MODEL.users },
        loser: { type: Schema.Types.ObjectId, ref: MODEL.users },
        winnerExp: { type: Number },
        loserExp: { type: Number }
      },
      {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
      }
    )

    this.schema.virtual('rounds', {
      localField: "_id",
      foreignField: 'battle',
      ref: MODEL.battle_rounds
    })
  }
}
export default Battles