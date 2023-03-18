import { AbstractModel } from "abstracts";
import { IMarching } from "interfaces";
import { Schema } from "mongoose";
import { MODEL } from "constant";
import { MARCHING } from "constant/enums";

class Marchings extends AbstractModel<IMarching> {
  constructor(tenantId: string) {
    super({ name: MODEL.marchings, tenantId })
    this.schema = new Schema<IMarching>({
      startAt: { type: Date, default: Date.now() },
      arriveAt: { type: Date },
      homeAt: { type: Date },
      speed: { type: Number },
      distance: { type: Number },
      population: { type: Number },
      status: { type: String, enum: Object.values(MARCHING.STATUS), default: MARCHING.STATUS.TO_TARGET },
      action: { type: String, enum: Object.values(MARCHING.ACTION) },
      from: { type: Schema.Types.ObjectId, ref: MODEL.castles },
      to: { type: Schema.Types.ObjectId, ref: MODEL.castles },
      coordinates: {
        x: { type: Number },
        y: { type: Number }
      },
      units: [{
        unit: { type: Schema.Types.ObjectId, ref: MODEL.units },
        total: { type: Number }
      }],
      cargo: {
        asArray: [{
          type: { type: Schema.Types.ObjectId, ref: MODEL.default_resources },
          value: { type: Number, default: 0 }
        }],
        asObject: {
          gold: { type: Number, default: 0 },
          iron: { type: Number, default: 0 },
          wood: { type: Number, default: 0 },
          food: { type: Number, default: 0 },
        }
      }
    }, {
      timestamps: true
    })
  }
}

export default Marchings