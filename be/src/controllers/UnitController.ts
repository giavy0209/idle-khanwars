import { AbstractController } from "abstracts";
import { IUnit } from "interfaces";
import { UnitService } from "services";

export default class UnitController extends AbstractController<IUnit, UnitService> {
  constructor() {
    super(UnitService)
  }
}

