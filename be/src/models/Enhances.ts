import { AbstractModel } from "abstracts";
import { IEnhance } from "interfaces";
import { Schema } from "mongoose";
import { MODEL } from "constant";
import { ENHANCE_TYPE, PROGRESS } from "constant/enums";

class Enhances extends AbstractModel<IEnhance> {
  constructor(tenantId: string) {
    super({ name: MODEL.enhances, tenantId })
    this.schema = new Schema<IEnhance>({
      castle: { type: Schema.Types.ObjectId, ref: MODEL.castles },
      unit: { type: Schema.Types.ObjectId, ref: MODEL.units },
      type: { type: String, enum: Object.values(ENHANCE_TYPE) },
      progress: { type: String, enum: Object.values(PROGRESS), default: PROGRESS.PENDING },
      startAt: { type: Date, default: Date.now },
      endAt: { type: Date }
    }, {
      timestamps: true
    })
  }
}

export default Enhances