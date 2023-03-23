import { AbstractWorker } from "abstracts";
import { MODEL, POPULATE_MARCHING, } from "constant";
import { EVENT_SOCKET, MARCHING } from "constant/enums";
import { ChangeUnit } from "eventEmitter";
import { IMarching, IMarchingPullPopulate, IUserFullyPopulate, IWorld } from "interfaces";
import { MarchingService } from "services";
import socketHandler from "socket";

export default class HandleMarchingWorker extends AbstractWorker<IMarching> {
  constructor(world: IWorld) {
    super(world, { modelName: MODEL.marchings })
  }
  startWorker() {
    const marchingService = new MarchingService({ world: this.world } as IUserFullyPopulate)
    this.startWithoutQueue(async () => {
      const marchings = await this.model.find({
        $or: [
          {
            status: MARCHING.STATUS.TO_TARGET,
            arriveAt: { $lte: Date.now() }
          },
          {
            status: MARCHING.STATUS.GO_HOME,
            homeAt: { $lte: Date.now() }
          }
        ]
      })
        .populate<IMarchingPullPopulate>(POPULATE_MARCHING)

      for (const marching of marchings) {
        if (marching.status === MARCHING.STATUS.TO_TARGET) {
          marching.status = MARCHING.STATUS.GO_HOME
          const { distance, movingTime, speed } = marchingService.calcMarchingStats({
            from: marching.from.coordinate,
            to: marching.to ? marching.to.coordinate : marching.coordinates,
            units: marching.units.map(marchingUnit => marchingUnit.unit)
          })
          const now = Date.now()
          marching.set({
            distance,
            speed,
            arriveAt: now,
            homeAt: now + movingTime
          })

          socketHandler(marching.from.user._id, EVENT_SOCKET.MARCHING, marching)
          if (marching.to) {
            socketHandler(marching.to.user._id, EVENT_SOCKET.MARCHING_DONE, marching._id)
          }
        } else {
          marching.status = MARCHING.STATUS.DONE
          socketHandler(marching.from.user._id, EVENT_SOCKET.MARCHING_DONE, marching._id)
          const units = marching.units
          units.forEach(unit => {
            ChangeUnit(
              this.world.tenant,
              {
                _id: unit.unit._id,
                value: -unit.total,
              }
            )
          })
        }
        await marching.save()
      }
    })
  }

}

