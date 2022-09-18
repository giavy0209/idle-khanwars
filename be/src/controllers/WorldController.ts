import { AbstractController } from "abstracts";
import { IWorld } from "interfaces";
import { WorldService } from "services";

export default class WorldController extends AbstractController<IWorld, WorldService> {
  constructor() {
    super(WorldService)
  }
}

