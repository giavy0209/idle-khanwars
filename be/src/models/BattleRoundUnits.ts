import { AbstractModel } from "abstracts";
import { IBattleRoundUnit } from "interfaces";
import { Schema } from "mongoose";
import { MODEL } from "constant";
import { BATTLE } from "constant/enums";

class BattleRoundUnits extends AbstractModel<IBattleRoundUnit> {
  constructor(tenantId: string) {
    super({ name: MODEL.battle_round_units, tenantId })
    this.schema = new Schema<IBattleRoundUnit>(
      {
        type: { type: Schema.Types.ObjectId, ref: MODEL.marching_units },
        total: { type: Number },
        round: { type: Schema.Types.ObjectId, index: true },
        owner: { type: String, enum: Object.values(BATTLE.ROUND.UNIT.OWNER), index: true }
      },
      {
        timestamps: true,
      }
    )
  }
}
export default BattleRoundUnits