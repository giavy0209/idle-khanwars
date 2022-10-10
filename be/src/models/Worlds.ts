import { AbstractModel } from "abstracts";
import { MODEL } from "constant";
import { STATUS } from "constant/enums";
import { IWorld } from "interfaces";
import { Schema } from "mongoose";

class Worlds extends AbstractModel<IWorld> {
  constructor() {
    super({name : MODEL.worlds})
    this.schema = new Schema<IWorld>({
      name : {type : String},
      tenant : {type : String},
      speed : {type : Number},
      status : {type : String, enum : Object.values(STATUS) }
    }, {
      timestamps : true
    })
  }
}

export default Worlds