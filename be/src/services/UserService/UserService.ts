import { AbstractService } from "abstracts"
import { IUser, IUser, IWorld } from "interfaces"
export default class UserService extends AbstractService<IUser>  {
  constructor(user: IUser & { world: IWorld }) {
    super(Users, user)
  }
}