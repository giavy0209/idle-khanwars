import { AbstractService } from "abstracts"
import { IWorld } from "interfaces"
import { Worlds } from "models"
export default class WorldService extends AbstractService<IWorld>  {
  constructor() {
    super(Worlds)
  }
}