import { AbstractWorker } from "abstracts";
import { MODEL, POPULATE_MARCHING, } from "constant";
import { MARCHING } from "constant/enums";
import { IMarching, IMarchingPullPopulate, IUserFullyPopulate, IWorld } from "interfaces";
import { MarchingService } from "services";

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
        } else {
          marching.status = MARCHING.STATUS.DONE
        }
        await marching.save()
      }
    })
  }

}

