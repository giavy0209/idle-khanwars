import eventEmitter from "eventEmitter"
import { IWorld } from "interfaces"
import { Model, models } from "mongoose"
import { sleep } from "utils"

export default abstract class AbstractWorker<I, Q = {}> {
  world: IWorld
  model: Model<I>
  sleep: number
  eventName: string
  queue: Q[] = []
  startAt: number

  constructor(world: IWorld, { modelName, sleep }: { modelName?: string, sleep?: number }) {
    this.world = world
    if (modelName) {
      this.eventName = `${this.world.tenant}_${modelName}`
      this.model = models[this.eventName]
    }
    this.sleep = sleep || 1000
  }
  async sleeping() {
    const now = Date.now()
    if (now - this.startAt < this.sleep) {
      await sleep(this.sleep - (now - this.startAt))
    }
  }
  listen() {
    eventEmitter.on(this.eventName, (data: Q) => {
      this.queue.push(data)
    })
  }

  async start(job: (payload: Q) => Promise<any>) {
    this.listen()
    while (true) {
      this.startAt = Date.now()
      const payload = this.queue.shift()
      if (!payload) {
        await this.sleeping()
        continue
      }
      await job(payload)
      await this.sleeping()
    }
  }
  async startWithoutQueue(job: () => Promise<any>) {
    while (true) {
      this.startAt = Date.now()
      await job()
      if(this.sleep) {
        await this.sleeping()
      }
    }
  }
}