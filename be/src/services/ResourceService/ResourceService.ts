import { AbstractService } from "abstracts"
import { IResource } from "interfaces"
import { HTTPSTATUS, MODEL } from "constant"
import { IUserFullyPopulate } from "interfaces/IUser"
import { Types } from "mongoose"
import BuildingService from "services/BuildingService"
import { IGetInput, IisEnoughResourceInput } from "./IResourceService"
import { AdvancedError } from "utils"

const populatePath = [
  {
    path: 'default'
  },
  {
    path: 'building',
    populate: {
      path: 'castle default'
    }
  }
]
export default class ResourceService extends AbstractService<IResource>  {
  constructor(user: IUserFullyPopulate) {
    super(MODEL.resources, user)
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

  async isEnoughResource(need: IisEnoughResourceInput[], castle: Types.ObjectId) {
    const resourcesFound = await Promise.all(need.map(async o => {
      const resources = await this.findOne({
        castle: castle,
        default: o.type,
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