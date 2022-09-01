import {
  HttpEvent,
  HttpHandlerFn,
  HttpParams,
  HttpRequest
} from '@angular/common/http'

import { Observable } from 'rxjs'
import { PAGINATION } from './context'

export function paginationInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const pagination = req.context.get(PAGINATION)

  const reqWithHeader = req.clone({
    params: (req.params || new HttpParams()).appendAll({
      ...pagination
    })
  })
  return next(reqWithHeader)
}