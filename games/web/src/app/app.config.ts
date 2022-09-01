import { ApplicationConfig } from '@angular/core'
import { provideRouter, withComponentInputBinding } from '@angular/router'

import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { provideAnimations } from '@angular/platform-browser/animations'
import { provideIcons } from '@ng-icons/core'
import { faSolidCircleChevronDown, faSolidCircleChevronLeft, faSolidCircleChevronRight, faSolidCircleChevronUp, faSolidCircleMinus, faSolidCirclePlus } from '@ng-icons/font-awesome/solid'
import { provideToastr } from 'ngx-toastr'
import { routes } from './app.routes'
import { authInterceptor } from './http-interceptors/auth-interceptor'
import { paginationInterceptor } from './http-interceptors/pagination-interceptor'
import { responseInterceptor } from './http-interceptors/response-interceptor'
import { urlInterceptor } from './http-interceptors/url-interceptor'
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([urlInterceptor, authInterceptor, paginationInterceptor, responseInterceptor])),
    provideAnimations(),
    provideToastr(),
    provideIcons({ faSolidCircleChevronDown, faSolidCircleChevronUp, faSolidCircleChevronLeft, faSolidCircleChevronRight, faSolidCirclePlus, faSolidCircleMinus })
  ]
}
