import { AbstractModel } from "abstracts";
import { IMarching } from "interfaces";
import { Schema } from "mongoose";
import { MODEL } from "constant";
import { MARCHING } from "constant/enums";

class Marchings extends AbstractModel<IMarching> {
  constructor(tenantId: string) {
    super({ name: MODEL.marchings, tenantId })
    this.schema = new Schema<IMarching>(
      {
        startAt: { type: Date, default: Date.now },
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
      },
      {
        timestamps: true,
        toJSON: {
          virtuals: true
        },
        toObject: {
          virtuals: true
        }
      }
    )
    this.schema.virtual('units', {
      ref: MODEL.marching_units,
      localField: '_id',
      foreignField: 'marching'
    })
    this.schema.virtual('cargoes', {
      ref: MODEL.marching_cargoes,
      localField: '_id',
      foreignField: 'marching'
    })
  }
}

export default Marchings