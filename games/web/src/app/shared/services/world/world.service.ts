import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { setNotToastSuccess } from 'app/http-interceptors/context'
import { Response } from 'types'
import { IWorld } from './world.interface'

@Injectable({ providedIn: 'root' })
export class WorldService {
  httpClient = inject(HttpClient)
  getWorld$ = this.httpClient.get<Response<IWorld[]>>('/worlds', { context: setNotToastSuccess })
}