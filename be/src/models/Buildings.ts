import { AbstractModel } from "abstracts";
import { IBuilding } from "interfaces";
import { Schema } from "mongoose";
import { MODEL } from "constant";

class Buildings extends AbstractModel<IBuilding> {
  constructor(tenantId : string) {
    super({name : MODEL.buildings,tenantId})
    this.schema = new Schema<IBuilding>({
    }, {
      timestamps : true
    })
  }
}

export default Buildings