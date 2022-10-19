import { MODEL } from 'constant'
import { EventEmitter } from 'events'
import { IChangeResourceWorker } from 'workers/ChangeResourceWorker'
import { IChangeUnitWorker } from 'workers/ChangeUnitWorker'

const eventEmitter = new EventEmitter()

export const ChangeResource = (tenant : string, data : IChangeResourceWorker) => {
  eventEmitter.emit(`${tenant}_${MODEL.resources}`, data)
}

export const ChangeUnit = (tenant :string , data :IChangeUnitWorker) =>{
  eventEmitter.emit(`${tenant}_${MODEL.units}`, data)
}

export default eventEmitter 