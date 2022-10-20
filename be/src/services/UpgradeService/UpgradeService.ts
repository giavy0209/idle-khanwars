import { AbstractService } from "abstracts"
import { IUpgrade } from "interfaces"
import { MODEL } from "constant"
import { IUserFullyPopulate } from "interfaces/IUser"
import { BuildingService, CastleService, ResourceService } from "services"
export default class UpgradeService extends AbstractService<IUpgrade>  {
  constructor(user: IUserFullyPopulate) {
    super(MODEL.upgrades, user)
  }
  async get({ castle }: { castle: string }) {
    return await this.find({ castle }, {})
  }
  async post({ building }: { building: string }) {
    const buildingService = new BuildingService(this.user)
    const findBuilding = await buildingService.findById(building, true)

    await this.exists({
      castle: findBuilding.castle,
    }, 'IF_EXISTS', 'There is a building upgrading')

    const castleService = new CastleService(this.user)
    await castleService.isOwner(findBuilding.castle._id)

    const resourceService = new ResourceService(this.user)
    await resourceService.isEnoughResource(findBuilding.upgrade.next.resources.asArray, findBuilding.castle._id)

    const upgrade = await this.model.create({
      castle: findBuilding.castle,
      building: findBuilding,
      endAt: new Date(Date.now() + findBuilding.upgrade.next.time * 1000)
    })

    await upgrade.populate('building')
    return upgrade
  }
}