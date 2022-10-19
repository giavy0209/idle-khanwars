import { AbstractController } from "abstracts";
import { ITraining } from "interfaces";
import { TrainingService } from "services";

export default class TraningController extends AbstractController<ITraining, TrainingService> {
  constructor() {
    super(TrainingService)
  }
}

