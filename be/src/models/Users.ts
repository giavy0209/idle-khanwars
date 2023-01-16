import { AbstractModel } from "abstracts";
import { MODEL } from "constant";
import { STATUS } from "constant/enums";
import { IUser } from "interfaces";
import { Schema } from "mongoose";
import Worlds from "./Worlds";
class Users extends AbstractModel<IUser> {
  constructor(tenantId: string) {
    super({ name: MODEL.users, tenantId })
    this.schema = new Schema<IUser>({
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      world: { type: Schema.Types.ObjectId, ref: new Worlds().getInstance() },
      lastLogin: { type: Date, default: Date.now },
      status: { type: String, enum: Object.values(STATUS), default: STATUS.ACTIVE },
      isSelectStart: { type: Boolean, default: false }
    }, {
      timestamps: true
    })
  }
}

export default Users