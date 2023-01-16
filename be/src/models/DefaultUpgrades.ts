import { AbstractModel } from "abstracts";
import { MODEL } from "constant";
import { IDefaultUpgrade } from "interfaces";
import { Schema } from "mongoose";

class DefaultUpgrades extends AbstractModel<IDefaultUpgrade> {
  constructor(tenant: string) {
    super({ name: MODEL.default_upgrades, tenantId: tenant })
    this.schema = new Schema<IDefaultUpgrade>({
      building: { type: Schema.Types.ObjectId, ref: MODEL.default_buildings },
      level: { type: Number, default: 0 },
      generate: { type: Number, default: 0 },
      time: { type: Number, default: 1 },
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
      }
    })
  }
}
export default DefaultUpgrades