import { AbstractService } from "abstracts"
import { POPULATE_UPGRADE } from "constant"
import { IUserFullyPopulate } from "interfaces/IUser"
import { BuildingService, CastleService, ResourceService } from "services"
import socketHandler from "socket"
import { EVENT_SOCKET, PROGRESS } from "constant/enums"
import { Upgrades } from "models"
export default class UpgradeService extends AbstractService<Upgrades>  {
  constructor(user: IUserFullyPopulate) {
    super(Upgrades, user)
    this.populate = POPULATE_UPGRADE
  }
  async get({ castle, progress }: { castle: string, progress: string }) {
    return await this.find({
      query: { castle, progress }
    })
  }
  async post({ building }: { building: string }) {
    const buildingService = new BuildingService(this.user)
    const findBuilding = await buildingService.findById(building, true)

    await this.exists({
      castle: findBuilding.castle,
      progress: PROGRESS.PENDING
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