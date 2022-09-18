import { AbstractService } from "abstracts"
import { MODEL } from "constant"
import { IWorld, IUser } from "interfaces"
export default class WorldService extends AbstractService<IWorld>  {
  constructor(user: IUser & { world: IWorld }) {
    super(MODEL.worlds, user)
  }
}