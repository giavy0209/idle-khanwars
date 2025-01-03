import { AbstractWorker } from "abstracts";
import { MODEL, POPULATE_DEFAULT_UPGRADE, POPULATE_UPGRADE } from "constant";
import { EVENT_SOCKET, PROGRESS } from "constant/enums";
import { IUpgrade, IWorld, IUpgradePullPopulate } from "interfaces";
import { IDefaultUpgradePullPopulate } from "interfaces/IDefaultUpgrade";
import DefaultUpgrade from "models/DefaultUpgrades";
import socketHandler from "socket";

export default class HandleUpgradeWorker extends AbstractWorker<IUpgrade> {
  constructor(world: IWorld) {
    super(world, { modelName: MODEL.upgrades })
  }

  startWorker() {
    const DefaultUpgradeModel = new DefaultUpgrade(this.world.tenant).getInstance()
    this.startWithoutQueue(async () => {
      const upgrades = await this.model.find({ endAt: { $lte: new Date() }, progress: PROGRESS.PENDING }).populate<IUpgradePullPopulate>(POPULATE_UPGRADE)
      for (const upgrade of upgrades) {
        const upgradeNext = await DefaultUpgradeModel.findOne({ building: upgrade.building.default._id, level: upgrade.building.upgrade.next.level + 1 })
          .populate<IDefaultUpgradePullPopulate>(POPULATE_DEFAULT_UPGRADE)

        upgrade.building.upgrade.current = upgrade.building.upgrade.next
        upgrade.building.upgrade.next = upgradeNext || upgrade.building.upgrade.current
        await upgrade.building.save()
        socketHandler(upgrade.castle, EVENT_SOCKET.BUILDING, upgrade.building)
        upgrade.progress = PROGRESS.FINISH
        await upgrade.save()
        socketHandler(upgrade.castle, EVENT_SOCKET.UPGRADE_DONE, upgrade._id)
      }
    })
  }
}