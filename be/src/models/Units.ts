import { AbstractModel } from "abstracts";
import { IUnit } from "interfaces";
import { Schema } from "mongoose";
import { MODEL } from "constant";
import { EnhanceDefination } from "./utils";

class Units extends AbstractModel<IUnit> {
  constructor(tenantId: string) {
    super({ name: MODEL.units, tenantId })
    this.schema = new Schema<IUnit>({
      castle: { type: Schema.Types.ObjectId, ref: MODEL.castles },
      building: { type: Schema.Types.ObjectId, ref: MODEL.buildings },
      default: { type: Schema.Types.ObjectId, ref: MODEL.default_units },
      total: { type: Number, default: 0 },
      inTower: { type: Number, default: 0 },
      enhance: {
        current: EnhanceDefination,
        next: EnhanceDefination
      }
    }, {
      timestamps: true
    })
  }
}

export default Units