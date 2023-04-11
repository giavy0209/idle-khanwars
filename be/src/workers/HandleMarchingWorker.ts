import { AbstractWorker } from "abstracts";
import { MODEL, } from "constant";
import { EVENT_SOCKET, MARCHING } from "constant/enums";
import { ChangeUnit } from "eventEmitter";
import { IMarching, IUserFullyPopulate, IWorld } from "interfaces";
import { MarchingService } from "services";
import socketHandler from "socket";

export default class HandleMarchingWorker extends AbstractWorker<IMarching> {
  constructor(world: IWorld) {
    super(world, { modelName: MODEL.marchings })
  }
  startWorker() {
    const marchingService = new MarchingService({ world: this.world } as IUserFullyPopulate)
    this.startWithoutQueue(async () => {
      const marchings = await marchingService.find({
        query: {
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
        },
        count: false
      })


      for (const marching of marchings) {
        switch (marching.status) {
          case MARCHING.STATUS.TO_TARGET:
            marching.status = MARCHING.STATUS.GO_HOME
            const { distance, movingTime, speed } = marchingService.calcMarchingStats({
              from: marching.from.coordinate,
              to: marching.to ? marching.to.coordinate : marching.coordinates,
              units: marching.units.map(marchingUnit => marchingUnit.type)
            })
            const now = Date.now()
            marching.set({
              distance,
              speed,
              arriveAt: now,
              homeAt: now + movingTime
            })

            switch (marching.action) {
              case MARCHING.ACTION.ATTACK:
                await marchingService.handleMarching(marching)
                break;

              default:
                break;
            }

            socketHandler(marching.from.user._id, EVENT_SOCKET.MARCHING, marching)
            if (marching.to) {
              socketHandler(marching.to.user._id, EVENT_SOCKET.MARCHING_DONE, marching._id)
            }
            break;
          case MARCHING.STATUS.GO_HOME:
            marching.status = MARCHING.STATUS.DONE
            socketHandler(marching.from.user._id, EVENT_SOCKET.MARCHING_DONE, marching._id)
            const units = marching.units
            units.forEach(unit => {
              ChangeUnit(
                this.world.tenant,
                {
                  _id: unit.type._id,
                  value: unit.total,
                }
              )
            })
            break;
          default:
            break;
        }
        await marching.save()
      }
    })
  }

}

