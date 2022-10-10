import { AbstractModel } from "abstracts";
import { MODEL } from "constant";
import { IDefaultUnits } from "interfaces";
import { Schema } from "mongoose";

class DefaultUnits extends AbstractModel<IDefaultUnits> {
  constructor() {
    super({ name: MODEL.default_units })
    this.schema = new Schema<IDefaultUnits>({
      name : {type:String},
      description : {type:String},
      building: { type: Schema.Types.ObjectId, ref: MODEL.default_buildings },
      time: { type: Number, default: 1 },
      speed : {type : Number},
      cargo : {type : Number},
      life : {type : Number},
      range : {type : Number},
      population : {type : Number},

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
      },

      strength : {
        asArray :[{
          type : {type : Schema.Types.ObjectId , ref: MODEL.default_unit_types},
          value : {type : Number}
        }],
        asObject : {
          infantry: {type : Number},
          archers: {type : Number},
          cavalry: {type : Number},
          siege: {type : Number},
          wall: {type : Number},
        }
      }
    })
  }
}
export default DefaultUnits