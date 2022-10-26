import { AbstractService } from "abstracts"
import { MODEL, POPULATE_TRAINING } from "constant"
import { IUserFullyPopulate } from "interfaces/IUser"
import ITraining, { ITrainingPullPopulate } from "interfaces/ITraining"
import { IUnitFullyPopulate } from "interfaces/IUnit"
import { IPostInput } from "./ITrainingService"
import { AdvancedError } from "utils"
import CastleService from "services/CastleService"
import { Types } from "mongoose"
import UnitService from "services/UnitService"
import ResourceService from "services/ResourceService"
import BuildingService from "services/BuildingService"
export default class TrainingService extends AbstractService<ITraining, ITrainingPullPopulate>  {
  constructor(user: IUserFullyPopulate) {
    super(MODEL.trainings, user)
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
    return await this.find({ castle }, {})
  }

  // async isEnoughPopulation(castle: string | Types.ObjectId) {
  //   // const buildingService = new BuildingService(this.user)
  //   // const dwelling = buildingService.findByKey({ castle, key: BUILDING.DWELLING })
  //   // const training = await this.find({ castle }, { populate: })
  // }

  async post({ unit, total }: IPostInput) {
    total = Number(total)
    if (!total) {
      throw new AdvancedError({
        statusCode: 400,
        message: 'Invalid total'
      })
    }

    const unitService = new UnitService(this.user)
    const findUnit = await unitService.findById(unit, true)
    const buildingService = new BuildingService(this.user)

    const buildingOfUnit = await buildingService.findById(findUnit.building._id)
    const upgradeOfBuilding = await this.DefaultUpgrade.findById(buildingOfUnit?.upgrade.current)
    if (upgradeOfBuilding?.level === 0) {
      throw new AdvancedError({
        message: `Please upgrade ${buildingOfUnit?.default.name} before training ${findUnit.default.name}`
      })
    }

    await this.exists({
      building: findUnit.building._id
    }, 'IF_EXISTS', `You have an unit training in ${findUnit.building.default.name}`)

    const castleService = new CastleService(this.user)
    await castleService.isOwner(findUnit.castle)

    const resourceNeed: {
      type: Types.ObjectId
      value: number
    }[] = []

    findUnit.default.resources.asArray.forEach(({ type, value }) => {
      resourceNeed.push({
        type: type._id,
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