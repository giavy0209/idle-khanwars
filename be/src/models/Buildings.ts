import { AbstractModel } from "abstracts";
import { IBuilding } from "interfaces";
import { Schema } from "mongoose";
import { MODEL } from "constant";

class Buildings extends AbstractModel<IBuilding> {
  constructor(tenantId: string) {
    super({ name: MODEL.buildings, tenantId })
    this.schema = new Schema<IBuilding>({
      castle: {type : Schema.Types.ObjectId, ref : this.getCollectionName(MODEL.castles)},
      default: {type : Schema.Types.ObjectId, ref : MODEL.default_buildings},
      isUpgrading: {type : Boolean, default : false},
      value: {type : Number, default : 100},
      level: {type : Number, default : 0},
      startAt : {type : Date},
      endAt : {type : Date},
    }, {
      timestamps: true
    })
  }
}

export default Buildings