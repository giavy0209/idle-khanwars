import { AbstractWorker } from "abstracts";
import { MODEL } from "constant";
import { EVENT_SOCKET } from "constant/enums";
import { IBuilding, IWorld } from "interfaces";
import socketHandler from "socket";

export default class HandleUpgradeWorker extends AbstractWorker<IBuilding> {
  constructor(world: IWorld) {
    super(world, { modelName: MODEL.buildings })
  }

  startWorker() {
    this.startWithoutQueue(async () => {
      const buildingsOnUpgrade = await this.model.find({ endAt: { $lte: new Date() }, isUpgrading: true }).populate('default')
      for (const building of buildingsOnUpgrade) {
        building.isUpgrading = false
        building.level++
        await building.save()
        socketHandler(building.castle, EVENT_SOCKET.BUILDING , building)
      }
    })
  }
}