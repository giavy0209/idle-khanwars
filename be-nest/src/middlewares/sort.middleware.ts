import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
export const ORDER_BY: { [k: string]: any } = {
  ASC: 1,
  DESC: -1,
}
@Injectable()
export class SortMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    const { sort } = req.query
    let mapSort: { [k: string]: number } | undefined = undefined
    if (Array.isArray(sort) && sort.length > 0) {
      mapSort = {}
      for (const item of sort) {
        const [sortName, value] = item.toString().split(':')
        if (!sortName || !value) continue
        if (ORDER_BY[value.toUpperCase()]) {
          mapSort[sortName] = ORDER_BY[value.toUpperCase()]
        }
      }
    }
    req.sort = mapSort
    delete req.query.sort
    next()
  }
}
