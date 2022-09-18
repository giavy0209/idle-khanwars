import { AbstractModel } from "abstracts";
import { IUser } from "interfaces";
import { Schema } from "mongoose";

class Users extends AbstractModel<IUser> {
  constructor() {
    super({name : 'models'})
    this.schema = new Schema<IUser>({
    }, {
      timestamps : true
    })
  }
}

export default Users