import { AbstractWorker } from "abstracts";
import { BUILDING } from "constant/enums";
import { ChangeResource } from "eventEmitter";
import { IDefaultUpgrade, IWorld } from "interfaces";
import { IBuildingFullyPopulate } from "interfaces/IBuilding";
import { Buildings, DefaultBuildings, Resources } from "models";
import { Types } from "mongoose";

export default class GenerateResourceWorker extends AbstractWorker<any, any> {
  DefaultStorage: Types.ObjectId
  constructor(world: IWorld) {
    super(world, { sleep: 3000 })
  }
  async startWorker() {
    this.DefaultStorage = (await new DefaultBuildings(this.world.tenant).getInstance().findOne({ key: BUILDING.STORAGE }))?._id as Types.ObjectId
    const ResourcesModel = new Resources(this.world.tenant).getInstance()
    const BuildingModel = new Buildings(this.world.tenant).getInstance()

    this.startWithoutQueue(async () => {

      const resources = await ResourcesModel.find({})
        .limit(100)
        .sort({ lastUpdate: 1 })
        .populate<{ building: IBuildingFullyPopulate }>({
          path: 'building',
          populate: {
            path: "upgrade.current upgrade.next"
          }
        })

      for (const resource of resources) {
        const storage = await BuildingModel.findOne({ castle: resource.castle, default: this.DefaultStorage })
          .populate<{ upgrade: { current: IDefaultUpgrade } }>({
            path: "upgrade.current"
          })
        if (!storage) continue
        const now = Date.now()
        const diffTime = (now - new Date(resource.lastUpdate).getTime()) / 1000
        const percentDiffTimePerHour = diffTime / 3600
        const generate = resource.building.upgrade.current.generate
        let value = generate * percentDiffTimePerHour


        if (storage.upgrade.current.generate < resource.value + value) {
          value = storage.upgrade.current.generate - resource.value
        }
        ChangeResource(this.world.tenant, {
          _id: resource._id,
          value,
          updateAt: now
        })
      }
    })
  }
}