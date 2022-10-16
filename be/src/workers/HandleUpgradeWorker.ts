import { AbstractWorker } from "abstracts";
import { MODEL, POPULATE_BUILDING, POPULATE_DEFAULT_UPGRADE } from "constant";
import { EVENT_SOCKET } from "constant/enums";
import { IBuilding, IWorld } from "interfaces";
import { IBuildingFullyPopulate } from "interfaces/IBuilding";
import { IDefaultUpgradePullPopulate } from "interfaces/IDefaultUpgrade";
import DefaultUpgrade from "models/DefaultUpgrades";
import socketHandler from "socket";

export default class HandleUpgradeWorker extends AbstractWorker<IBuilding> {
  constructor(world: IWorld) {
    super(world, { modelName: MODEL.buildings })
  }

  startWorker() {
    const DefaultUpgradeModel = new DefaultUpgrade(this.world.tenant).getInstance()
    this.startWithoutQueue(async () => {
      const buildingsOnUpgrade = await this.model.find({ endAt: { $lte: new Date() }, isUpgrading: true }).populate<IBuildingFullyPopulate>(POPULATE_BUILDING)
      for (const building of buildingsOnUpgrade) {
        const upgradeNext = await DefaultUpgradeModel.findOne({ building: building.default._id, level: building.upgrade.next.level + 1 })
          .populate<IDefaultUpgradePullPopulate>(POPULATE_DEFAULT_UPGRADE)
        if (!upgradeNext) continue
        building.isUpgrading = false
        building.upgrade.current = building.upgrade.next
        building.upgrade.next = upgradeNext
        await building.save()
        socketHandler(building.castle._id, EVENT_SOCKET.BUILDING, building)
      }
    })
  }
}