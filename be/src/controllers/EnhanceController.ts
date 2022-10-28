import { AbstractController } from "abstracts";
import { IEnhance } from "interfaces";
import { EnhanceService } from "services";

export default class EnhanceController extends AbstractController<IEnhance, EnhanceService> {
  constructor() {
    super(EnhanceService)
  }
}

