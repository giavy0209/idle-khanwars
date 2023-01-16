import { AbstractModel } from "abstracts";
import { IDefaultEnhance } from "interfaces";
import { Schema } from "mongoose";
import { MODEL } from "constant";
import { ENHANCE_TYPE } from "constant/enums";

class DefaultEnhances extends AbstractModel<IDefaultEnhance> {
  constructor(tenantId: string) {
    super({ name: MODEL.default_enhances, tenantId })
    this.schema = new Schema<IDefaultEnhance>({
      level: { type: Number },
      unit: { type: Schema.Types.ObjectId, ref: MODEL.default_units },
      value: { type: Number },
      time: { type: Number },
      type: { type: String, enum: Object.values(ENHANCE_TYPE) },
      resources: {
        asArray: [{
          type: { type: Schema.Types.ObjectId, ref: MODEL.default_resources },
          value: { type: Number }
        }],
        asObject: {
          gold: { type: Number },
          iron: { type: Number },
          wood: { type: Number },
          food: { type: Number },
        }
      },
    }, {
      timestamps: true
    })
  }
}

export default DefaultEnhances