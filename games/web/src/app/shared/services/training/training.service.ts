import { Injectable, inject } from '@angular/core'
import { DEFAULT_BUILDING } from 'app/shared/interfaces/default-building.interface'
import { BehaviorSubject } from 'rxjs'
import { SOCKET } from '../socket/socket.enum'
import { SocketService } from '../socket/socket.service'
import { IUnitFully } from '../unit/unit.interface'
import { UnitService } from '../unit/unit.service'
import { ITraining, ITrainingUnit } from './training.interface'

@Injectable({ providedIn: 'root' })
export class TrainingService {
  socketService = inject(SocketService)
  unitService = inject(UnitService)

  trainings$ = new BehaviorSubject<ITrainingUnit[]>([])
  set trainings(trainings: ITrainingUnit[]) {
    this.trainings$.next(trainings)
  }
  get trainings() {
    return this.trainings$.value
  }

  listen() {
    this.socketService.socket.on(SOCKET.EVENT.TRAINING, this.replace)
  }

  getTrainingsByBuilding(buildingKey: DEFAULT_BUILDING.KEY) {
    return this.trainings.filter(training => training.unit.building.default.key === buildingKey)
  }

  replace = (training: ITraining) => {
    const findTrainingUnit = {
      ...training,
      unit: this.unitService.units.find(unit => unit._id === training.unit) as IUnitFully
    }
    const index = this.trainings.findIndex(o => o._id === training._id)

    if (training.deletedAt) {
      if (index !== -1) {
        this.trainings.splice(index, 1)
        this.trainings = this.trainings
      }
      return findTrainingUnit
    }

    if (index === -1) {
      this.trainings.push(findTrainingUnit)
    } else {
      this.trainings.splice(index, 1, findTrainingUnit)
    }
    this.trainings = this.trainings
    return findTrainingUnit
  }

  replaceAll = (trainings: ITraining[]) => {
    this.trainings = trainings.map(o => {
      return {
        ...o,
        unit: this.unitService.units.find(unit => unit._id === o.unit) as IUnitFully
      }
    })
  }

  clear() {
    this.trainings = []
    this.socketService.socket.removeAllListeners(SOCKET.EVENT.TRAINING)
  }
}
