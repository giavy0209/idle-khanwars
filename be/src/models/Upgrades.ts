import { AbstractModel } from "abstracts";
import { IUpgrade } from "interfaces";
import { Schema } from "mongoose";
import { MODEL } from "constant";

class Upgrades extends AbstractModel<IUpgrade> {
  constructor(tenantId: string) {
    super({ name: MODEL.upgrades, tenantId })
    this.schema = new Schema<IUpgrade>({
      castle: { type: Schema.Types.ObjectId, ref: MODEL.castles },
      building: { type: Schema.Types.ObjectId, ref: MODEL.buildings },
      startAt: { type: Date, default: Date.now },
      endAt: { type: Date }
    })
  }
}

export default Upgrades