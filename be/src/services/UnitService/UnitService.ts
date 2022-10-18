import { AbstractService } from "abstracts"
import { IUnit } from "interfaces"
import { MODEL, POPULATE_UNIT } from "constant"
import { IUserFullyPopulate } from "interfaces/IUser"
import { Types } from "mongoose"
import BuildingService from "services/BuildingService"
import { IPostInput } from "./IUnitService"
import { AdvancedError } from "utils"
import { IUnitFullyPopulate, IUnitPullPopulate } from "interfaces/IUnit"
import ResourceService from "services/ResourceService"
import CastleService from "services/CastleService"
import TrainingService from "services/TrainingService"
export default class UnitService extends AbstractService<IUnit, IUnitPullPopulate>  {
  constructor(user: IUserFullyPopulate) {
    super(MODEL.units, user)
    this.populate = POPULATE_UNIT
  }
  async create(castle: Types.ObjectId) {
    const defaultUnits = await this.DefaultUnits.find({})
    for (const defaultUnit of defaultUnits) {
      const defaultBuilding = await this.DefaultBuildings.findOne({ _id: defaultUnit.building })
      const buildingService = new BuildingService(this.user)
      const buildingOfThis = await buildingService.findOne({ default: defaultBuilding?._id, castle })
      await this.model.create({
        castle,
        building: buildingOfThis?._id,
        default: defaultUnit._id,
      })
    }
  }

  async get(castle: string) {
    return await this.model.find({ castle }).populate(this.populate)
  }

  calcTrainingTime(unit: IUnitFullyPopulate, total: number) {
    let trainingOne = unit.default.time * 1000
    trainingOne = Math.round(trainingOne * (1 - unit.building.upgrade.current.generate / 100))
    return {
      one: trainingOne,
      total: trainingOne * total
    }
  }

  async post({ unit, total }: IPostInput) {
    total = Number(total)
    if (!total) {
      throw new AdvancedError({
        statusCode: 400,
        message: 'Invalid total'
      })
    }

    const findUnit = await this.findById(unit, true)

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
    resourceService.isEnoughResource(resourceNeed, findUnit.castle)

    const trainingTime = this.calcTrainingTime(findUnit, total)

    const trainingService = new TrainingService(this.user)
    await trainingService.model.create({
      unit: findUnit._id,
      total,
      left: total,
      endAt: new Date(Date.now() + trainingTime.total),
      nextAt: new Date(Date.now() + trainingTime.one)
    })
  }
}