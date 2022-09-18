import { AbstractModel } from "abstracts";
import { IWorld } from "interfaces";
import { Schema } from "mongoose";

class Worlds extends AbstractModel<IWorld> {
  constructor() {
    super({name : 'models'})
    this.schema = new Schema<IWorld>({
    }, {
      timestamps : true
    })
  }
}

export default Worlds