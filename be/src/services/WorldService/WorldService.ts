import { AbstractService } from "abstracts"
import { IWorld, IUser } from "interfaces"
import { Worlds } from "models"
export default class WorldService extends AbstractService<IWorld>  {
  constructor(user: IUser & { world: IWorld }) {
    super(Worlds, user)
  }
}