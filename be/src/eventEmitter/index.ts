import { MODEL } from 'constant'
import { EventEmitter } from 'events'
import { IChangeResourceWorker } from 'workers/ChangeResourceWorker'

const eventEmitter = new EventEmitter()

export const ChangeResource = (tenant : string, data : IChangeResourceWorker) => {
  eventEmitter.emit(`${tenant}_${MODEL.resources}`, data)
}

export default eventEmitter