import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { IBuilding } from '../building/building.interface'
import { BuildingService } from '../building/building.service'
import { SOCKET } from '../socket/socket.enum'
import { SocketService } from '../socket/socket.service'
import { IUpgrade, IUpgradeFully } from './upgrade.interface'

@Injectable({ providedIn: 'root' })
export class UpgradeService {
  socketService = inject(SocketService)
  httpClient = inject(HttpClient)
  buildingService = inject(BuildingService)
  upgrades$ = new BehaviorSubject<IUpgradeFully[]>([])
  set upgrades(upgrade: IUpgradeFully[]) {
    this.upgrades$.next(upgrade)
  }
  get upgrades() {
    return this.upgrades$.value
  }

  listen() {
    this.socketService.socket.on(SOCKET.EVENT.UPGRADE, this.replace)
  }

  replace = (upgrade: IUpgrade) => {
    const building = this.buildingService.buildings.find(o => o._id === upgrade.building) as IBuilding
    const index = this.upgrades.findIndex(o => o._id === upgrade._id)
    if (index !== -1) {
      if (upgrade.deletedAt) {
        this.upgrades.splice(index, 1)
      } else {
        this.upgrades.splice(index, 1, { ...upgrade, building: building })
      }
    } else {
      this.upgrades.push({ ...upgrade, building })
    }
    this.upgrades = this.upgrades
  }

  replaceAll(upgrades: IUpgrade[]) {
    this.upgrades = upgrades.map(upgrade => {
      const building = this.buildingService.buildings.find(o => o._id === upgrade.building) as IBuilding
      return {
        ...upgrade,
        building
      }
    })
  }

  clear() {
    this.upgrades = []
  }

  cancel(id: string) {
    return this.httpClient.delete(`/upgrades/${id}`)
  }
}