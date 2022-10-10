import { AbstractService } from "abstracts"
import { MODEL } from "constant"
import { IWorld } from "interfaces"
export default class WorldService extends AbstractService<IWorld>  {
  constructor() {
    super(MODEL.worlds)
  }
  
}