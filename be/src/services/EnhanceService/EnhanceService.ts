import { AbstractService } from "abstracts"
import { POPULATE_ENHANCE } from "constant"
import { BUILDING, ENHANCE_TYPE, EVENT_SOCKET, PROGRESS } from "constant/enums"
import { Request } from "express"
import { IBuildingFullyPopulate, IEnhancePullPopulate } from "interfaces"
import { IUserFullyPopulate } from "interfaces/IUser"
import { Enhances } from "models"
import BuildingService from "services/BuildingService"
import CastleService from "services/CastleService"
import ResourceService from "services/ResourceService"
import UnitService from "services/UnitService"
import socketHandler from "socket"
import { AdvancedError } from "utils"
import { IPostInput } from "./IEnhanceService"
export default class EnhanceService extends AbstractService<Enhances, IEnhancePullPopulate>  {
  constructor(user: IUserFullyPopulate) {
    super(Enhances, user)
    this.populate = POPULATE_ENHANCE
  }
  validPostInput({ type }: IPostInput | Request['body']) {
    if (!Object.values(ENHANCE_TYPE).includes(type)) {
      throw new AdvancedError({ message: "Invalid type" })
    }
    return { type }
  }

  calcEnhanceTime(baseTime: number, blacksmith: IBuildingFullyPopulate) {
    return Math.round(baseTime * (1 - blacksmith.upgrade.current.generate / 100))
  }

  async post({ type, unit }: IPostInput) {
    const unitService = new UnitService(this.user)
    const foundUnit = await unitService.findById(unit, true)

    const castleService = new CastleService(this.user)
    await castleService.isOwner(foundUnit.castle)

    const buildingService = new BuildingService(this.user)
    const blacksmith = await buildingService.findByKey({ castle: foundUnit.castle, key: BUILDING.BLACKSMITH })
    if (blacksmith.upgrade.current.level === 0) {
      throw new AdvancedError({ message: "Please upgrade blacksmith first" })
    }

    await this.exists({ castle: foundUnit.castle._id, progress: PROGRESS.PENDING }, 'IF_EXISTS', 'There is an unit in enhance queue')

    const enhance = foundUnit.enhance.next[type.toLowerCase() as 'hp' | 'attack' | 'cargo']
    const costs = enhance.resources.asArray

    const resourceService = new ResourceService(this.user)
    await resourceService.isEnoughResource(costs, foundUnit.castle)
    const enhanceTime = this.calcEnhanceTime(enhance.time * 1000, blacksmith)
    const createEnhance = await this.model.create({
      unit: foundUnit._id,
      castle: foundUnit.castle,
      type,
      endAt: Date.now() + enhanceTime
    })
    await createEnhance.populate(this.populate)
    socketHandler(createEnhance.castle, EVENT_SOCKET.ENHANCE, createEnhance)
  }
}