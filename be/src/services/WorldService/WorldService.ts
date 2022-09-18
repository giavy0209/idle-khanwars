import { AbstractService } from "abstracts"
import { IWorld, IUser, IWorld } from "interfaces"
export default class WorldService extends AbstractService<IWorld>  {
  constructor(user: IUser & { world: IWorld }) {
    super(Worlds, user)
  }
}