import { AbstractWorker } from "abstracts";
import { MODEL, POPULATE_TRAINING } from "constant";
import { EVENT_SOCKET } from "constant/enums";
import { ITraining, IWorld } from "interfaces";
import { ITrainingPullPopulate } from "interfaces/ITraining";
import { IUserFullyPopulate } from "interfaces/IUser";
import { TrainingService } from "services";
import socketHandler from "socket";

export default class HandleTrainingWorker extends AbstractWorker<ITraining> {
  constructor(world: IWorld) {
    super(world, { modelName: MODEL.trainings })
  }

  startWorker() {
    const trainingService = new TrainingService({ world: this.world } as IUserFullyPopulate)
    this.startWithoutQueue(async () => {
      const trainings = await this.model.find({ nextAt: { $lte: Date.now() }, left: { $gt: 0 } }).populate<ITraining & ITrainingPullPopulate>(POPULATE_TRAINING)
      for (const training of trainings) {
        const { total, one } = trainingService.calcTrainingTime(training.unit, training.total)
        training.left--
        training.trained++
        training.nextAt = new Date(Date.now() + one)
        training.endAt = new Date(Date.now() + total)
        await training.save()

        socketHandler(training.unit.castle._id, EVENT_SOCKET.TRAINING, training)
      }
    })
  }
}