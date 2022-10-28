import { AbstractModel } from "abstracts";
import { IEnhance } from "interfaces";
import { Schema } from "mongoose";
import { MODEL } from "constant";

class Enhances extends AbstractModel<IEnhance> {
  constructor(tenantId: string) {
    super({ name: MODEL.enhances, tenantId })
    this.schema = new Schema<IEnhance>({

    }, {
      timestamps: true
    })
  }
}

export default Enhances