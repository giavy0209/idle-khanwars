import { AbstractModel } from "abstracts";
import { IMarching } from "interfaces";
import { Schema } from "mongoose";
import { MODEL } from "constant";

class Marchings extends AbstractModel<IMarching> {
  constructor(tenantId: string) {
    super({ name: MODEL.marchings, tenantId })
    this.schema = new Schema<IMarching>({
      startAt: { type: Date, default: Date.now() },
      arriveAt: { type: Date },
      homeAt: { type: Date },
      speed: { type: Number },
      population: { type: Number },
      castle: { type: Schema.Types.ObjectId, ref: this.getCollectionName(MODEL.castles) },
      target: {
        castle: { type: Schema.Types.ObjectId, ref: this.getCollectionName(MODEL.castles) },
        coordinate: {
          x: { type: Number },
          y: { type: Number },
        }
      },
      cargo: {
        asArray: [{
          type: { type: Schema.Types.ObjectId, ref: this.getCollectionName(MODEL.default_resources) },
          value: { type: Number }
        }],
        asObject: {
          gold: { type: Number },
          iron: { type: Number },
          wood: { type: Number },
          food: { type: Number },
        }
      }
    }, {
      timestamps: true
    })
  }
}

export default Marchings