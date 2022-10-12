import { AbstractWorker } from "abstracts";
import { MODEL } from "constant";
import { EVENT_SOCKET } from "constant/enums";
import { IResource, IWorld } from "interfaces";
import { Types } from "mongoose";
import socketHandler from "socket";
export interface IChangeResourceWorker {
  _id: Types.ObjectId
  value: number
  updateAt?: Date | number
}

export default class ChangeResourceWorker extends AbstractWorker<IResource, IChangeResourceWorker> {
  constructor(world: IWorld) {
    super(world, { modelName: MODEL.resources, sleep: 1 })
  }
  startWorker() {
    this.start(async ({ _id, value, updateAt }) => {
      const resource = await this.model.findById(_id).populate('building default')
      if (!resource) return
      resource.value = resource.value + value
      resource.lastUpdate = updateAt ? new Date(updateAt) : resource.lastUpdate
      await resource.save()
      socketHandler(resource.castle, EVENT_SOCKET.RESOURCE, resource)
    })
  }
}