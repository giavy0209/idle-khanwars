import { AbstractService } from "abstracts"
import { IBuilding } from "interfaces"
import { MODEL, POPULATE_BUILDING } from "constant"
import { IUserFullyPopulate } from "interfaces/IUser"
import { Types } from "mongoose"
import { IBuildingPullPopulate } from "interfaces/IBuilding"
import { IGetInput } from "./IBuildingService"
import ResourceService from "services/ResourceService"
import socketHandler from "socket"
import { BUILDING, EVENT_SOCKET } from "constant/enums"
export default class BuildingService extends AbstractService<IBuilding, IBuildingPullPopulate>  {
  constructor(user: IUserFullyPopulate) {
    super(MODEL.buildings, user)
    this.populate = POPULATE_BUILDING
  }
  async get({ castle }: IGetInput) {
    return await this.find(
      {
        castle
      },
      {
        populate: this.populate
      }
    )
  }
  async create(castle: Types.ObjectId) {
    const defaultBuildings = await this.DefaultBuildings.find({})
    for (const defaultBuilding of defaultBuildings) {
      const upgrade0 = await this.DefaultUpgrade.findOne({ building: defaultBuilding._id, level: 0 })
      const upgrade = await this.DefaultUpgrade.findOne({ building: defaultBuilding._id, level: 1 })
      let value = 0
      if (defaultBuilding.resource) {
        value = 20 * this.user.world.speed
      } else if (defaultBuilding.key === BUILDING.STORAGE) {
        value = 500
      } else {
        value = 0
      }
      await this.model.create({
        castle,
        default: defaultBuilding._id,
        value,
        upgrade: {
          current: upgrade0?._id,
          next: upgrade?._id
        }
      })
    }
  }
  async postUpgrade(building: string) {
    const findBuilding = await this.findById(building, true)
    await this.exists({
      castle: findBuilding.castle,
      isUpgrading: true,
    }, 'IF_EXISTS', 'There is a building upgrading')

    const resourceService = new ResourceService(this.user)
    await resourceService.isEnoughResource(findBuilding.upgrade.next.resources.asArray, findBuilding.castle._id)

    findBuilding.startAt = new Date()
    findBuilding.endAt = new Date(Date.now() + findBuilding.upgrade.next.time * 1000)
    findBuilding.isUpgrading = true
    await findBuilding.save()
    socketHandler(findBuilding.castle._id, EVENT_SOCKET.BUILDING, findBuilding)
    return findBuilding
  }
}

