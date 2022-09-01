import { Injectable, inject } from '@angular/core'
import { io } from 'socket.io-client'
import { ConfigService } from '../config/config.service'
import { StorageService } from '../storage/storage.service'
@Injectable({ providedIn: 'root' })
export class SocketService {
  storageService = inject(StorageService)
  configService = inject(ConfigService)
  socket = io(this.configService.API_HOST, {
    path: `${this.configService.API_CONTEXT}/socket.io`,
    auth: (cb) => {
      cb({
        token: this.storageService.getToken()
      })
    },
  })
  constructor() {
    this.socket.on('connect', () => {
      console.log('connected')
    })
  }
}