import { NestMiddleware } from '@nestjs/common'
import { NextFunction, Request } from 'express'

export class TenantMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    req.tenantId = req.user.tenant
    next()
  }
}
