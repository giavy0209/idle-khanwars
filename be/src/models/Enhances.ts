import { AbstractModel } from "abstracts";
import { IEnhance } from "interfaces";
import { Schema } from "mongoose";
import { MODEL } from "constant";

class Enhances extends AbstractModel<IEnhance> {
  constructor(tenantId: string) {
    super({ name: MODEL.enhances, tenantId })
    this.schema = new Schema<IEnhance>({
      castle: { type: Schema.Types.ObjectId, ref: this.getCollectionName(MODEL.castles) },
      unit: { type: Schema.Types.ObjectId, ref: this.getCollectionName(MODEL.units) },
      startAt: { type: Date, default: Date.now },
      endAt: { type: Date }
    }, {
      timestamps: true
    })
  }
}

export default Enhances