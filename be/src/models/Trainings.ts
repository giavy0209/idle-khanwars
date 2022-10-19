import { AbstractModel } from "abstracts";
import { ITraining } from "interfaces";
import { Schema } from "mongoose";
import { MODEL } from "constant";

class Trainings extends AbstractModel<ITraining> {
  constructor(tenantId: string) {
    super({ name: MODEL.trainings, tenantId })
    this.schema = new Schema<ITraining>({
      unit: { type: Schema.Types.ObjectId, ref: this.getCollectionName(MODEL.units) },
      total: { type: Number },
      left: { type: Number },
      trained: { type: Number, default: 0 },
      startAt: { type: Date, default: Date.now },
      endAt: { type: Date },
      nextAt: { type: Date }
    })
  }
}

export default Trainings