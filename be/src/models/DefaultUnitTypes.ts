import { AbstractModel } from "abstracts";
import { MODEL } from "constant";
import { IDefaultUnitType } from "interfaces";
import { Schema } from "mongoose";

class DefaultUnitTypes extends AbstractModel<IDefaultUnitType> {
  constructor(tenant : string) {
    super({name : MODEL.default_unit_types, tenantId : tenant})
    this.schema = new Schema<IDefaultUnitType>({
      name : {type : String},
      key : {type : String},
      order : {type : Number}
    })
  }
}

export default DefaultUnitTypes