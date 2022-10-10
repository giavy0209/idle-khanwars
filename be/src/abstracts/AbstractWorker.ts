import eventEmitter from "eventEmitter"
import { Model, models } from "mongoose"
import { sleep } from "utils"

export default abstract class AbstractWorker<I, Q> {
  tenant: string
  model: Model<I>
  sleep: number
  eventName: string
  queue: Q[] = []
  startAt: number

  constructor(tenant: string, modelName: string, eventName: string, sleep?: number) {
    this.tenant = tenant
    this.model = models[`${tenant}_${modelName}`]
    this.sleep = sleep || 1000
    this.eventName = eventName

  }
  async sleeping() {
    const now = Date.now()
    if (now - this.startAt < this.sleep) {
      await sleep(now - this.startAt)
    }
  }
  listen() {
    eventEmitter.on(this.eventName, (data: Q) => {
      this.queue.push(data)
    })
  }

  async start(job: (payload: Q) => Promise<any>) {
    this.listen()
    this.startAt = Date.now()
    while (true) {
      const payload = this.queue.shift()
      if (!payload) {
        await this.sleeping()
        continue
      }
      await job(payload)
    }
  }
}