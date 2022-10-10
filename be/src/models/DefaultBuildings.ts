import { AbstractModel } from "abstracts";
import { MODEL } from "constant";
import { IDefaultBuilding } from "interfaces";
import { Schema } from "mongoose";

class DefaultBuildings extends AbstractModel<IDefaultBuilding> {
  constructor() {
    super({name : MODEL.default_buildings})
    this.schema = new Schema<IDefaultBuilding>({
      name : {type : String},
      description : {type : String},
      type : {type : String},
      path : {type : String},
      resource : {type : Schema.Types.ObjectId}
    })
  }
}

export default DefaultBuildings