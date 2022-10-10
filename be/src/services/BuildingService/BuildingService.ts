import { AbstractService } from "abstracts"
import { IBuilding } from "interfaces"
import { HTTPSTATUS, MODEL } from "constant"
import { IUserFullyPopulate } from "interfaces/IUser"
import { Types } from "mongoose"
import { IBuildingPullPopulate } from "interfaces/IBuilding"
import { IGetInput, IUpgradeInput } from "./IBuildingService"
import { AdvancedError } from "utils"
import ResourceService from "services/ResourceService"
const populatePath = [
  {
    path: 'castle default'
  }
]
export default class BuildingService extends AbstractService<IBuilding, IBuildingPullPopulate>  {
  static populatePath = populatePath
  constructor(user: IUserFullyPopulate) {
    super(MODEL.buildings, user)
    this.populate = populatePath
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
      await this.model.create({
        castle,
        default: defaultBuilding._id
      })
    }
  }

  async getUpgrade({ building }: IUpgradeInput) {
    const findBuilding = await this.findById(building, true)
    const upgradeCost = await this.DefaultUpgrade.findOne({
      building: findBuilding.default._id,
      level: findBuilding.level + 1
    }).populate('resources.asArray.type building')
    if (!upgradeCost) {
      throw new AdvancedError({
        message: 'Unknown error',
        statusCode: HTTPSTATUS.INTERNAL_SERVER_ERROR
      })
    }
    return upgradeCost
  }

  async postUpgrade(building: string) {
    const findBuilding = await this.findById(building, true)
    const upgradeCost = await this.DefaultUpgrade.findOne({
      building: findBuilding.default._id,
      level: findBuilding.level + 1
    }).populate('resources.asArray.type building')
    if (!upgradeCost) {
      throw new AdvancedError({
        message: 'Unknown error',
        statusCode: HTTPSTATUS.INTERNAL_SERVER_ERROR
      })
    }
    await this.exists({
      castle: findBuilding.castle,
      isUpgrading: true,
    }, 'IF_EXISTS', 'There is a building upgrading')

    const resourceService = new ResourceService(this.user)
    await resourceService.isEnoughResource(upgradeCost.resources.asArray, findBuilding.castle._id)
  }
}