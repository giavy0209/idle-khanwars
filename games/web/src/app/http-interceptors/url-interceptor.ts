import {
  HttpEvent,
  HttpHandlerFn,
  HttpRequest
} from '@angular/common/http'
import { inject } from '@angular/core'
import { ConfigService } from 'app/shared/services/config/config.service'

import { Observable } from 'rxjs'

export function urlInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const API_URL = inject(ConfigService).API_URL

  const reqWithURL = req.clone({
    url: `${API_URL}${req.url}`
  })
  return next(reqWithURL)
}