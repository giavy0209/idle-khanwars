import { AbstractService } from "abstracts"
import { IResource, IResourcePullPopulate } from 'interfaces'
import { HTTPSTATUS, POPULATE_RESOURCE } from "constant"
import { IUserFullyPopulate } from "interfaces/IUser"
import { Types } from "mongoose"
import { IGetInput, IisEnoughResourceInput } from "./IResourceService"
import { AdvancedError } from "utils"
import { ChangeResource } from "eventEmitter"
import { BuildingService } from "services"
import { Resources } from "models"

export default class ResourceService extends AbstractService<IResource, IResourcePullPopulate>  {
  constructor(user: IUserFullyPopulate) {
    super(Resources, user)
    this.populate = POPULATE_RESOURCE
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

  async isEnoughResource(need: IisEnoughResourceInput[], castle: Types.ObjectId) {
    const resourcesFound = await Promise.all(need.map(async o => {
      const resources = await this.findOne({
        castle: castle,
        default: o.type._id,
        value: { $gte: o.value }
      })
      return resources
    }))
    for (const resourceFound of resourcesFound) {
      if (!resourceFound) {
        throw new AdvancedError({
          statusCode: HTTPSTATUS.NOT_ACCEPTABLE,
          message: 'Not enouggh resource'
        })
      }
    }
    for (const resourceFound of resourcesFound) {
      if (!resourceFound) continue
      const needValue = need.find(o => o.type._id.toString() === resourceFound.default._id.toString())
      if (!needValue) continue

      ChangeResource(this.tenant as string, {
        value: -needValue.value,
        _id: resourceFound._id
      })
    }
  }

  async create(castle: Types.ObjectId) {
    const defaultResources = await this.DefaultResources.find({})
    const buildingService = new BuildingService(this.user)
    for (const defaultResource of defaultResources) {
      const defaultBuilding = await this.DefaultBuildings.findOne({ resource: defaultResource._id })
      const buildingOfThis = await buildingService.findOne({ castle, default: defaultBuilding?._id })
      await this.model.create({
        castle,
        default: defaultResource._id,
        building: buildingOfThis?._id
      })
    }
  }
}