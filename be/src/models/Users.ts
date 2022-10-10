import { AbstractModel } from "abstracts";
import { MODEL } from "constant";
import { STATUS } from "constant/enums";
import { IUser } from "interfaces";
import { Schema } from "mongoose";

class Users extends AbstractModel<IUser> {
  constructor(tenant : string) {
    super({name : MODEL.users,tenantId : tenant})
    this.schema = new Schema<IUser>({
      username : {type : String , required : true, unique : true},
      password : {type : String, required : true},
      world : {type : Schema.Types.ObjectId, ref : MODEL.worlds},
      lastLogin : {type : Date, default : Date.now},
      status : {type : String, enum : Object.values(STATUS), default : STATUS.ACTIVE}
    }, {
      timestamps : true
    })
  }
}

export default Users