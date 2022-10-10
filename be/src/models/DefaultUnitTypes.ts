import { AbstractModel } from "abstracts";
import { MODEL } from "constant";
import { IDefaultUnitType } from "interfaces";
import { Schema } from "mongoose";

class DefaultUnitTypes extends AbstractModel<IDefaultUnitType> {
  constructor() {
    super({name : MODEL.default_unit_types})
    this.schema = new Schema<IDefaultUnitType>({
      name : {type : String},
      key : {type : String},
    })
  }
}

export default DefaultUnitTypes