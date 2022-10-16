import { AbstractModel } from "abstracts";
import { MODEL } from "constant";
import { IDefaultBuilding } from "interfaces";
import { Schema } from "mongoose";

class DefaultBuildings extends AbstractModel<IDefaultBuilding> {
  constructor(tenant : string) {
    super({name : MODEL.default_buildings, tenantId : tenant})
    this.schema = new Schema<IDefaultBuilding>({
      name : {type : String},
      key : {type : String},
      description : {type : String},
      type : {type : String},
      path : {type : String},
      resource : {type : Schema.Types.ObjectId, ref : MODEL.resources}
    })
  }
}

export default DefaultBuildings