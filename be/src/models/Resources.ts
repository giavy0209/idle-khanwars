import { AbstractModel } from "abstracts";
import { IResource } from "interfaces";
import { Schema } from "mongoose";
import { MODEL } from "constant";

class Resources extends AbstractModel<IResource> {
  constructor(tenantId : string) {
    super({name : MODEL.resources,tenantId})
    this.schema = new Schema<IResource>({
    }, {
      timestamps : true
    })
  }
}

export default Resources