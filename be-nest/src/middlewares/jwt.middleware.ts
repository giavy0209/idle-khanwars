import { NestMiddleware } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { NextFunction, Request } from 'express'

export class JWTValidationMiddware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    try {
      const jwtService = new JwtService({
        secret: global.Config.JWT_SECRET,
      })
      const [type, token] = req.headers.authorization?.split(' ') ?? []
      if (type !== 'Bearer') {
        throw Error
      }
      const payload = jwtService.verify(token) as JWTPayload
      req.user = payload
    } catch (error) {
      const user = { tenant: '' }
      if (req?.body?.tenant) {
        user.tenant = req.body.tenant
      }
      if (req?.query?.tenant) {
        user.tenant = req.query.tenant as string
      }
      req.user = user as JWTPayload
      req.isAuthorization = false
    }
    next()
  }
}
