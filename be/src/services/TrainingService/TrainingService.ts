import { AbstractService } from "abstracts"
import { POPULATE_TRAINING } from "constant"
import { IUserFullyPopulate } from "interfaces/IUser"
import { IDefaultResources, ITraining, ITrainingPullPopulate } from "interfaces"
import { IUnitFullyPopulate } from "interfaces/IUnit"
import { IPostInput } from "./ITrainingService"
import { AdvancedError } from "utils"
import CastleService from "services/CastleService"
import { Types } from "mongoose"
import UnitService from "services/UnitService"
import ResourceService from "services/ResourceService"
import BuildingService from "services/BuildingService"
import { BUILDING } from "constant/enums"
import { Trainings } from "models"
export default class TrainingService extends AbstractService<ITraining, ITrainingPullPopulate>  {
  constructor(user: IUserFullyPopulate) {
    super(Trainings, user)
    this.populate = POPULATE_TRAINING
  }

  calcTrainingTime(unit: IUnitFullyPopulate, total: number) {
    let trainingOne = unit.default.time * 1000
    trainingOne = Math.round(trainingOne * (1 - unit.building.upgrade.current.generate / 100))
    return {
      one: trainingOne,
      total: trainingOne * total
    }
  }

  async get({ castle }: { castle: string }) {
    return await this.find({
      query: { castle, left: { $gt: 0 } }
    })
  }

  async isEnoughPopulation(castle: string | Types.ObjectId, newTotal: number) {
    const castleService = new CastleService(this.user)
    const { population } = await castleService.findById(castle, true)

    const buildingService = new BuildingService(this.user)
    const dwelling = await buildingService.findByKey({ castle, key: BUILDING.DWELLINGS })
    const trainings = await this.find({
      query: { castle },
      count: false
    })
    let totalTraining = population + newTotal
    trainings.forEach(training => {
      totalTraining += (training.left * training.unit.default.population)
    })
    const dwellingVolume = dwelling.upgrade.current.generate
    if (dwellingVolume < totalTraining) {
      throw new AdvancedError({ message: "You don't have enough space in dwelling, upgrade dwelling first", statusCode: 400 })
    }
    return totalTraining
  }

  async post({ unit, total }: IPostInput) {
    total = Number(total)
    if (!total || total < 1) {
      throw new AdvancedError({
        statusCode: 400,
        message: 'Invalid total'
      })
    }
    const unitService = new UnitService(this.user)
    const findUnit = await unitService.findById(unit, true)

    const buildingService = new BuildingService(this.user)
    await buildingService.isUpgradeArmyBuilding(findUnit.building._id)

    await this.exists({
      building: findUnit.building._id,
      left: { $gt: 0 }
    }, 'IF_EXISTS', `You have an unit training in ${findUnit.building.default.name}`)

    const castleService = new CastleService(this.user)
    await castleService.isOwner(findUnit.castle)

    await this.isEnoughPopulation(findUnit.castle, total * findUnit.default.population)

    const resourceNeed: {
      type: IDefaultResources
      value: number
    }[] = []

    findUnit.default.resources.asArray.forEach(({ type, value }) => {
      resourceNeed.push({
        type: type,
        value: value * total
      })
    })

    const resourceService = new ResourceService(this.user)
    await resourceService.isEnoughResource(resourceNeed, findUnit.castle)

    const trainingTime = this.calcTrainingTime(findUnit, total)
    const training = await this.model.create({
      building: findUnit.building,
      castle: findUnit.castle,
      unit: findUnit._id,
      total,
      left: total,
      endAt: new Date(Date.now() + trainingTime.total),
      nextAt: new Date(Date.now() + trainingTime.one)
    })
    await training.populate(POPULATE_TRAINING)

    return training
  }
}