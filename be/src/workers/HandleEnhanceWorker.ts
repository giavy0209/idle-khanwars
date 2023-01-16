import { AbstractWorker } from "abstracts";
import { MODEL, POPULATE_DEFAULT_ENHANCE, POPULATE_ENHANCE } from "constant";
import { EVENT_SOCKET, PROGRESS } from "constant/enums";
import { IDefaultEnhancePullPopulate, IEnhance, IEnhancePullPopulate, IWorld } from "interfaces";
import socketHandler from "socket";
import { DefaultEnhances } from "models";

export default class HnadleEnhanceWorker extends AbstractWorker<IEnhance> {
  constructor(world: IWorld) {
    super(world, { modelName: MODEL.enhances })
  }

  startWorker() {
    const DefaultEnhanceModel = new DefaultEnhances(this.world.tenant).getInstance()
    this.startWithoutQueue(async () => {
      const enhances = await this.model.find({ endAt: { $lte: Date.now() }, progress: PROGRESS.PENDING }).populate<IEnhancePullPopulate>(POPULATE_ENHANCE)

      for (const enhance of enhances) {
        const type = enhance.type.toLowerCase() as 'hp' | 'cargo' | 'attack'
        const enhanceNext = await DefaultEnhanceModel.findOne({ unit: enhance.unit.default._id, type: enhance.type, level: enhance.unit.enhance.next[type].level + 1 }).populate<IDefaultEnhancePullPopulate>(POPULATE_DEFAULT_ENHANCE)
        enhance.unit.enhance.current[type] = enhance.unit.enhance.next[type]
        enhance.unit.enhance.next[type] = enhanceNext || enhance.unit.enhance.current[type]
        await enhance.unit.save()
        socketHandler(enhance.castle, EVENT_SOCKET.ENHANCE_DONE, enhance._id)
        enhance.progress = PROGRESS.FINISH
        await enhance.save()
        socketHandler(enhance.castle, EVENT_SOCKET.UNIT, enhance.unit)
      }
    })
  }
}