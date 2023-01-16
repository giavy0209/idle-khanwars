import { AbstractModel } from "abstracts";
import { IBuilding } from "interfaces";
import { Schema } from "mongoose";
import { MODEL } from "constant";

class Buildings extends AbstractModel<IBuilding> {
  constructor(tenantId: string) {
    super({ name: MODEL.buildings, tenantId })
    this.schema = new Schema<IBuilding>({
      castle: { type: Schema.Types.ObjectId, ref: MODEL.castles },
      default: { type: Schema.Types.ObjectId, ref: MODEL.default_buildings },
      upgrade: {
        current: { type: Schema.Types.ObjectId, ref: MODEL.default_upgrades },
        next: { type: Schema.Types.ObjectId, ref: MODEL.default_upgrades },
      },
    }, {
      timestamps: true
    })
  }
}

export default Buildings