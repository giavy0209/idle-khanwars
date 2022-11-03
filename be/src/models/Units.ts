import { AbstractModel } from "abstracts";
import { IUnit } from "interfaces";
import { Schema } from "mongoose";
import { MODEL } from "constant";

class Units extends AbstractModel<IUnit> {
  constructor(tenantId: string) {
    super({ name: MODEL.units, tenantId })
    this.schema = new Schema<IUnit>({
      castle: { type: Schema.Types.ObjectId, ref: this.getCollectionName(MODEL.castles) },
      building: { type: Schema.Types.ObjectId, ref: this.getCollectionName(MODEL.buildings) },
      default: { type: Schema.Types.ObjectId, ref: this.getCollectionName(MODEL.default_units) },
      total: { type: Number, default: 0 },
      inTower: { type: Number, default: 0 },
      enhance: {
        current: {
          hp: { type: Schema.Types.ObjectId, ref: this.getCollectionName(MODEL.default_enhances) },
          cargo: { type: Schema.Types.ObjectId, ref: this.getCollectionName(MODEL.default_enhances) },
          attack: { type: Schema.Types.ObjectId, ref: this.getCollectionName(MODEL.default_enhances) },
        },
        next: {
          hp: { type: Schema.Types.ObjectId, ref: this.getCollectionName(MODEL.default_enhances) },
          cargo: { type: Schema.Types.ObjectId, ref: this.getCollectionName(MODEL.default_enhances) },
          attack: { type: Schema.Types.ObjectId, ref: this.getCollectionName(MODEL.default_enhances) },
        }
      }
    }, {
      timestamps: true
    })
  }
}

export default Units