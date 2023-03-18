import { AbstractService } from "abstracts"
import { IBuilding } from "interfaces"
import { POPULATE_BUILDING } from "constant"
import { IUserFullyPopulate } from "interfaces/IUser"
import { Types } from "mongoose"
import { IBuildingPullPopulate } from "interfaces/IBuilding"
import { IGetInput } from "./IBuildingService"
import { BUILDING } from "constant/enums"
import { AdvancedError } from "utils"
import { Buildings } from "models"
export default class BuildingService extends AbstractService<IBuilding, IBuildingPullPopulate>  {
  constructor(user: IUserFullyPopulate) {
    super(Buildings, user)
    this.populate = POPULATE_BUILDING
  }
  async get({ castle }: IGetInput) {
    return await this.find(
      {
        query: { castle }
      }
    )
  }
  async findByKey({ castle, key }: { castle: string | Types.ObjectId, key: string }) {
    const defaultBuilding = await this.DefaultBuildings.findOne({ key })
    if (!defaultBuilding) {
      throw new AdvancedError({
        message: `${key} not found`, statusCode: 404
      })
    }
    return await this.findOne({ castle, default: defaultBuilding._id }, true)
  }
  async isUpgradeArmyBuilding(building: Types.ObjectId | string) {
    const buildingOfUnit = await this.findById(building)
    const upgradeOfBuilding = await this.DefaultUpgrades.findById(buildingOfUnit?.upgrade.current)
    if (upgradeOfBuilding?.level === 0) {
      throw new AdvancedError({
        message: `Please upgrade ${buildingOfUnit?.default.name} before training`
      })
    }
  }
  async create(castle: Types.ObjectId) {
    const defaultBuildings = await this.DefaultBuildings.find({})
    for (const defaultBuilding of defaultBuildings) {
      const upgrade0 = await this.DefaultUpgrades.findOne({ building: defaultBuilding._id, level: 0 })
      const upgrade = await this.DefaultUpgrades.findOne({ building: defaultBuilding._id, level: 1 })
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
}

