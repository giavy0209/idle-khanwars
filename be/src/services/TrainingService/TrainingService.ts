import { AbstractService } from "abstracts"
import { MODEL, POPULATE_TRAINING } from "constant"
import { IUserFullyPopulate } from "interfaces/IUser"
import ITraining, { ITrainingPullPopulate } from "interfaces/ITraining"
import { IUnitFullyPopulate } from "interfaces/IUnit"
export default class TrainingService extends AbstractService<ITraining, ITrainingPullPopulate>  {
  constructor(user: IUserFullyPopulate) {
    super(MODEL.trainings, user)
    this.populate = POPULATE_TRAINING
  }

  calcTrainingTime(unit: IUnitFullyPopulate, total: number) {
    let trainingOne = unit.default.time / this.user.world.speed
    trainingOne = trainingOne * unit.building.upgrade.current.generate * 1000
    return {
      one: trainingOne,
      total: trainingOne * total
    }
  }
  
  async get({castle}:{castle : string}){
    return await this.find({castle})
  }
}