import { AbstractModel } from "abstracts";
import { MODEL } from "constant";
import { IMarchingUnit } from "interfaces";
import { Schema } from "mongoose";

export default class MarchingUnits extends AbstractModel<IMarchingUnit> {
  constructor(tenantId: string) {
    super({ tenantId, name: MODEL.marching_units })
    this.schema = new Schema<IMarchingUnit>({
      type: { type: Schema.Types.ObjectId, ref: MODEL.units },
      total: { type: Number, min: 1 },
      marching: { type: Schema.Types.ObjectId },
    })
  }
}