import { AbstractWorker } from "abstracts";
import { MODEL, POPULATE_BUILDING, POPULATE_DEFAULT_UPGRADE } from "constant";
import { EVENT_SOCKET } from "constant/enums";
import { IUpgrade, IWorld } from "interfaces";
import { IDefaultUpgradePullPopulate } from "interfaces/IDefaultUpgrade";
import { IUpgradeFullyPopulate } from "interfaces/IUpgrade";
import DefaultUpgrade from "models/DefaultUpgrades";
import socketHandler from "socket";

export default class HandleUpgradeWorker extends AbstractWorker<IUpgrade> {
  constructor(world: IWorld) {
    super(world, { modelName: MODEL.upgrades })
  }

  startWorker() {
    const DefaultUpgradeModel = new DefaultUpgrade(this.world.tenant).getInstance()
    this.startWithoutQueue(async () => {
      const upgrades = await this.model.find({ endAt: { $lte: new Date() } }).populate<IUpgradeFullyPopulate>(POPULATE_BUILDING)
      for (const upgrade of upgrades) {
        const upgradeNext = await DefaultUpgradeModel.findOne({ building: upgrade.building.default._id, level: upgrade.building.upgrade.next.level + 1 })
          .populate<IDefaultUpgradePullPopulate>(POPULATE_DEFAULT_UPGRADE)

        if (!upgradeNext) {
          await upgrade.remove()
          continue
        }

        upgrade.building.upgrade.current = upgrade.building.upgrade.next
        upgrade.building.upgrade.next = upgradeNext
        await upgrade.building.save()
        socketHandler(upgrade.castle, EVENT_SOCKET.BUILDING, upgrade.building)

        await upgrade.remove()
        socketHandler(upgrade.castle, EVENT_SOCKET.UPGRADE, upgrade._id)
      }
    })
  }
}