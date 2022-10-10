import { AbstractModel } from "abstracts";
import { IUnit } from "interfaces";
import { Schema } from "mongoose";
import { MODEL } from "constant";

class Units extends AbstractModel<IUnit> {
  constructor(tenantId : string) {
    super({name : MODEL.units,tenantId})
    this.schema = new Schema<IUnit>({
    }, {
      timestamps : true
    })
  }
}

export default Units