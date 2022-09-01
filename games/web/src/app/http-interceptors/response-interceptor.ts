import { HttpEvent, HttpEventType, HttpHandlerFn, HttpRequest, HttpStatusCode } from '@angular/common/http'
import { inject } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { Observable, catchError, of, tap } from 'rxjs'
import { Response } from 'types'
import { IS_TOAST_ERROR, IS_TOAST_SUCCESS } from './context'


export function responseInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const toastr = inject(ToastrService)
  return next(req).pipe(
    catchError((error) => {
      const isToastError = req.context.get(IS_TOAST_ERROR)
      if (isToastError) {
        if (error?.error?.statusCode) {
          if (error?.error?.statusCode === 401) {
            toastr.error('Session timeout, please login again')
          } else {
            if (Array.isArray(error?.error?.message)) {
              error.error.message.forEach((msg: string) => {
                toastr.error(msg)
              })
            } else {
              toastr.error(error.error.message)
            }
          }
        } else {
          toastr.error(error.message)
        }
      }
      return of(error)
    }),
    tap(event => {
      if (event.type === HttpEventType.Response) {
        const isToastSuccess = req.context.get(IS_TOAST_SUCCESS)

        switch (event.status) {
          case HttpStatusCode.Ok:
          case HttpStatusCode.Created:
            if (isToastSuccess) {
              toastr.success((event.body as Response<unknown>).message)
            }
            break
          default:

            break
        }
      }
    })

  )
}