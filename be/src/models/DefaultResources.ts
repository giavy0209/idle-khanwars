import { AbstractModel } from "abstracts";
import { MODEL } from "constant";
import { IDefaultResources } from "interfaces";
import { Schema } from "mongoose";

class DefaultResources extends AbstractModel<IDefaultResources> {
  constructor(tenant: string) {
    super({ name: MODEL.default_resources, tenantId: tenant })
    this.schema = new Schema<IDefaultResources>({
      name: { type: String },
      key: { type: String },
      path: { type: String },
    })
  }
}

export default DefaultResources