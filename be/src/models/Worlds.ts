import { AbstractModel } from "abstracts";
import { MODEL } from "constant";
import { IWorld } from "interfaces";
import { Schema } from "mongoose";

class Worlds extends AbstractModel<IWorld> {
  constructor() {
    super({name : MODEL.worlds})
    this.schema = new Schema<IWorld>({
    }, {
      timestamps : true
    })
  }
}

export default Worlds