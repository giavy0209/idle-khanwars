import { AbstractController } from "abstracts";
import { IMarching } from "interfaces";
import { MarchingService } from "services";

export default class MarchingController extends AbstractController<IMarching, MarchingService> {
  constructor() {
    super(MarchingService)
  }
}

