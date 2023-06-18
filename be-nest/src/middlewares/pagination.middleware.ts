import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class PaginationMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    const query = req.query
    const page: number | undefined = !Number.isNaN(Number(query.page))
      ? Number(query.page)
      : undefined

    let skip: number | undefined = !Number.isNaN(Number(query.skip))
      ? Number(query.skip)
      : undefined

    const limit: number | undefined = !Number.isNaN(Number(query.limit))
      ? Number(query.limit)
      : undefined

    if (!Number.isNaN(page) && !Number.isNaN(limit)) {
      skip = ((page as number) - 1) * (limit as number)
    }

    req.strictPagination = {
      skip: skip || 0,
      limit: limit || Number.MAX_SAFE_INTEGER,
    }
    delete req.query.page
    delete req.query.limit
    next()
  }
}
