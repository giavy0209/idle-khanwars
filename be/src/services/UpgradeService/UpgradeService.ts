import { AbstractService } from "abstracts"
import { IUpgrade } from "interfaces"
import { MODEL, POPULATE_UPGRADE } from "constant"
import { IUserFullyPopulate } from "interfaces/IUser"
import { BuildingService, CastleService, ResourceService } from "services"
import socketHandler from "socket"
import { EVENT_SOCKET } from "constant/enums"
export default class UpgradeService extends AbstractService<IUpgrade>  {
  constructor(user: IUserFullyPopulate) {
    super(MODEL.upgrades, user)
    this.populate = POPULATE_UPGRADE
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
      castle: findBuilding.castle._id,
      building: findBuilding,
      endAt: new Date(Date.now() + findBuilding.upgrade.next.time * 1000)
    })

    await upgrade.populate(POPULATE_UPGRADE)
    socketHandler(upgrade.castle, EVENT_SOCKET.UPGRADE, upgrade)
    return upgrade
  }
}