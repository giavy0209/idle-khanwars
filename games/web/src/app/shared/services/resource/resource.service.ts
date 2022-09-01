import { Injectable, inject } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { SOCKET } from '../socket/socket.enum'
import { SocketService } from '../socket/socket.service'
import { IResource } from './resource.interface'

@Injectable({ providedIn: 'root' })
export class ResourceService {
  socketService = inject(SocketService)

  set resources(resources: IResource[]) {
    this.resources$.next(resources.map(resource => {
      return {
        ...resource,
        value: Math.floor(resource.value)
      }
    }))
  }
  get resources() {
    return this.resources$.value
  }
  resources$ = new BehaviorSubject<IResource[]>([])

  listen() {
    this.socketService.socket.on(SOCKET.EVENT.RESOURCES, this.replace)
  }

  replace = (resource: IResource) => {
    const index = this.resources.findIndex(res => res._id === resource._id)
    if (index === -1) return
    this.resources.splice(index, 1, { ...resource, value: Math.floor(resource.value) })
    this.resources = this.resources
  }
  clear() {
    this.resources = []
    this.socketService.socket.removeAllListeners(SOCKET.EVENT.RESOURCES)
  }
}