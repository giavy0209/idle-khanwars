import { AbstractService } from "abstracts"
import { Worlds } from "models"
export default class WorldService extends AbstractService<Worlds>  {
  constructor() {
    super(Worlds)
  }
}