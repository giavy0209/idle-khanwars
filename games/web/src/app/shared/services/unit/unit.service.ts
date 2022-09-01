import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { DEFAULT_BUILDING } from 'app/shared/interfaces/default-building.interface'
import { BehaviorSubject } from 'rxjs'
import { IBuilding } from '../building/building.interface'
import { BuildingService } from '../building/building.service'
import { SOCKET } from '../socket/socket.enum'
import { SocketService } from '../socket/socket.service'
import { IUnit, IUnitFully } from './unit.interface'

@Injectable({ providedIn: 'root' })
export class UnitService {
  httpClient = inject(HttpClient)
  socketService = inject(SocketService)
  buildingService = inject(BuildingService)

  selectedUnit$ = new BehaviorSubject<IUnitFully | undefined>(undefined);

  units$ = new BehaviorSubject<IUnitFully[]>([]);
  set units(units: IUnitFully[]) {
    this.units$.next(units)
  }
  get units() {
    return this.units$.value
  }

  listen() {
    this.socketService.socket.on(SOCKET.EVENT.UNIT, this.replace)
  }

  selectUnit(id: string) {
    const unit = this.units$.value.find(o => o._id === id)
    this.selectedUnit$.next(unit)
  }

  getUnitsByBuilding(buildingKey: DEFAULT_BUILDING.KEY) {
    return this.units.filter(unit => unit.building.default.key === buildingKey)
  }

  replace = (unit: IUnit) => {
    const units = this.units
    const index = units.findIndex(b => b._id === unit._id)
    if (index === -1) return
    units.splice(index, 1, { ...unit, building: this.buildingService.buildings.find(building => building._id === unit.building) as IBuilding })
    this.units = units
  }

  replaceAll = (units: IUnit[]) => {
    this.units = units.map(o => {
      return {
        ...o,
        building: this.buildingService.buildings.find(building => building._id === o.building) as IBuilding
      }
    })
  }

  clear() {
    this.units$.next([])
  }

}