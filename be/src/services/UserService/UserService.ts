import { AbstractService } from "abstracts"
import { MODEL } from "constant"
import { IUser, IWorld } from "interfaces"
export default class UserService extends AbstractService<IUser>  {
  constructor(user: IUser & { world: IWorld }) {
    super(MODEL.users, user)
  }
}