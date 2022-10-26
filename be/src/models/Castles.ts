import { AbstractModel } from "abstracts";
import { ICastle } from "interfaces";
import { Schema } from "mongoose";
import { MODEL } from "constant";

class Castles extends AbstractModel<ICastle> {
  constructor(tenantId: string) {
    super({ name: MODEL.castles, tenantId })
    this.schema = new Schema<ICastle>({
      user: { type: Schema.Types.ObjectId, ref: this.getCollectionName(MODEL.users) },
      loyal: { type: Number, default: 10000 },
      population: { type: Number, default: 0 },
      name: { type: String },
      isCapital: { type: Boolean, default: true },
      coordinate: {
        x: { type: Number },
        y: { type: Number }
      },
      lastUpdate: { type: Date, default: Date.now }
    }, {
      timestamps: true
    })
  }
}

export default Castles