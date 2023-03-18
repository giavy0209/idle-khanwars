import { AbstractService } from "abstracts"
import { MARCHING } from "constant/enums"
import { ChangeUnit } from "eventEmitter"
import { IMarching, IMarchingPullPopulate } from "interfaces"
import { IUserFullyPopulate } from "interfaces/IUser"
import { Marchings } from "models"
import { isValidObjectId } from "mongoose"
import CastleService from "services/CastleService"
import UnitService from "services/UnitService"
import { AdvancedError } from "utils"
import { IPostInput } from "./IMarchingService"

const validAction = Object.values(MARCHING.ACTION)
export default class MarchingService extends AbstractService<IMarching, IMarchingPullPopulate>  {
  constructor(user: IUserFullyPopulate) {
    super(Marchings, user)
  }

  async get() {
    const castleService = new CastleService(this.user)
    const castles = (await castleService.model.find()).map(castle => castle._id)
    const marchings = await this.find({
      query: {
        $or: [
          {
            from: { $in: castles },
            status: { $in: [MARCHING.STATUS.TO_TARGET, MARCHING.STATUS.GO_HOME] }
          },
          {
            to: { $in: castles },
            status: MARCHING.STATUS.TO_TARGET
          }
        ]
      }
    })
    return marchings
  }

  validPostInput({
    action,
    units,
    coordinates,
    to
  }: Partial<IPostInput>) {
    if (!action || !validAction.includes(action)) {
      throw new AdvancedError({ message: `${action} is invalid action` })
    }
    if (!Array.isArray(units) || units.length === 0) {
      throw new AdvancedError({ message: "You are not select unit" })
    }
    const selectedUnit = units.filter(unit => unit.selected > 0)
    if (!selectedUnit[0]) {
      throw new AdvancedError({ message: "You are not select unit" })
    }
    switch (action) {
      case MARCHING.ACTION.ATTACK:
      case MARCHING.ACTION.SPY:
        if (!to || !isValidObjectId(to)) {
          throw new AdvancedError({ message: `You cannot ${action} this target` })
        }
        break
      case MARCHING.ACTION.CARAVAN:
      case MARCHING.ACTION.PATROL:
        if (!isValidObjectId(to) || (Number.isInteger(coordinates?.x) || Number.isInteger(coordinates?.y))) {
          throw new AdvancedError({ message: `Invalid target` })
        }
        break;
      default:
        break;
    }

    return {
      action,
      units: selectedUnit,
      coordinates,
      to
    }
  }

  async post({
    action,
    units,
    coordinates,
    to
  }: IPostInput) {
    const castleService = new CastleService(this.user)
    const unitService = new UnitService(this.user)
    const unitIds = units.map(o => o._id)

    const findUnits = await unitService.isFromOneCastle(unitIds)
    if (!findUnits) {
      throw new AdvancedError({ message: "All unit have to be same one castle" })
    }

    const fromCastle = await castleService.findById(findUnits[0].castle, true)
    const population = unitService.calcPopulation(findUnits)

    const unitWithSelected = unitService.isEnoughUnit(findUnits, units)

    const createMarching = new this.model({
      population,
      action,
      from: fromCastle._id,
      units: unitWithSelected,
    })

    const marchingStats = {
      movingTime: 0,
      distance: 0,
      speed: 0
    }
    switch (action) {
      case MARCHING.ACTION.ATTACK:
      case MARCHING.ACTION.SPY:
        const findTarget = await castleService.findById(to || '', true)
        createMarching.to = findTarget._id
        break;
      case MARCHING.ACTION.CARAVAN:
      case MARCHING.ACTION.PATROL:
        if (!coordinates) return
        marchingStats.distance = castleService.calcDistance(fromCastle.coordinate, coordinates)
        const target = await castleService.model.findOne({ coordinate: coordinates })
        if (target) {
          createMarching.to = target._id
        }
        break;
      default:
        break;
    }
    const { movingTime, speed } = unitService.calcMovingTime(findUnits, marchingStats.distance)
    marchingStats.movingTime = movingTime
    marchingStats.speed = speed
    createMarching.distance = marchingStats.distance
    createMarching.speed = marchingStats.speed
    createMarching.arriveAt = new Date(Date.now() + marchingStats.movingTime)
    createMarching.homeAt = new Date(Date.now() + marchingStats.movingTime * 2)

    unitWithSelected.forEach(unit => {
      ChangeUnit(
        this.user.world.tenant,
        {
          _id: unit._id,
          value: -unit.total,
        }
      )
    })
    await createMarching.save()
    return createMarching
  }
}