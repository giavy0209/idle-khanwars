import { AbstractWorker } from "abstracts";
import { ChangeResource } from "eventEmitter";
import { IBuilding, IWorld } from "interfaces";
import { Resources } from "models";

export default class GenerateResourceWorker extends AbstractWorker<any, any> {
  constructor(world: IWorld) {
    super(world, {sleep : 10000})
  }
  startWorker() {
    const ResourcesModel = new Resources(this.world.tenant).getInstance()
    this.startWithoutQueue(async () => {
      
      const resources = await ResourcesModel.find({})
        .limit(100)
        .sort({ lastUpdate: 1 })
        .populate<{ building: IBuilding }>({
          path: 'building',
        })

      for (const resource of resources) {
        const now = Date.now()
        const diffTime = (now - new Date(resource.lastUpdate).getTime()) / 1000
        const percentDiffTimePerHour = diffTime / 3600
        const generate = resource.building.value * this.world.speed
        const value = generate * percentDiffTimePerHour
        ChangeResource(this.world.tenant, {
          _id: resource._id,
          value,
          updateAt : now
        })
      }
    })
  }
}