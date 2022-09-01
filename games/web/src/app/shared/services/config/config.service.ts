import { Injectable } from '@angular/core'
import { environment } from 'environments/environment'

@Injectable({ providedIn: 'root' })
export class ConfigService {
  API_HOST = environment.API_HOST
  API_CONTEXT = environment.API_CONTEXT
  API_URL = `${this.API_HOST}${this.API_CONTEXT}`
}