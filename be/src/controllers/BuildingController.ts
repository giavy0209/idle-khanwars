import { AbstractController } from "abstracts";
import { IBuilding } from "interfaces";
import { BuildingService } from "services";

export default class BuildingController extends AbstractController<IBuilding, BuildingService> {
  constructor() {
    super(BuildingService)
  }
}

