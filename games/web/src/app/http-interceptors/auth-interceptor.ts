import {
  HttpEvent,
  HttpHandlerFn,
  HttpRequest
} from '@angular/common/http'
import { inject } from '@angular/core'
import { StorageService } from 'app/shared/services/storage/storage.service'

import { Observable } from 'rxjs'

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authToken = inject(StorageService).getToken()

  const reqWithHeader = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${authToken}`),
  })
  return next(reqWithHeader)
}