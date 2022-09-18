import { AbstractModel } from "abstracts";
import { MODEL } from "constant";
import { IUser } from "interfaces";
import { Schema } from "mongoose";

class Users extends AbstractModel<IUser> {
  constructor() {
    super({name : MODEL.users})
    this.schema = new Schema<IUser>({
    }, {
      timestamps : true
    })
    this.isTenant = false
  }
}

export default Users