import { AbstractService } from "abstracts"
import { IUser, IWorld } from "interfaces"
import { Users } from "models"
export default class UserService extends AbstractService<IUser>  {
  constructor(user: IUser & { world: IWorld }) {
    super(Users, user)
  }
}