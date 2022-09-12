import { Request, Response, NextFunction, Router } from "express";
import { IUser } from "interfaces";
import { checkSchema, Schema, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import { AbstractController } from "abstracts";
import { AdvancedError } from "utils";
import PromiseRouter from "express-promise-router";

export default abstract class AbstractRouter<C extends AbstractController<any, any, any>> {
  router: Router = PromiseRouter()
  routes: {
    param?: string,
    method: string,
    authorized?: boolean
    ref?: (req: Request, res: Response) => void,
    validate?: Schema ,
    middlewares?: any[]
  }[] = [
      { method: 'GET' },
      { method: 'POST' },
      { method: 'PATCH' },
      { method: 'PUT' },
      { method: 'DELETE' },
    ]
  prefix: string
  controller: C
  constructor(prefix: string, Controller: new () => C) {
    this.prefix = prefix
    this.controller = new Controller()
  }
  regisRouter: () => void = () => {
    this.routes.forEach(({
      ref,
      authorized = true,
      method,
      param = '',
      validate,
      middlewares = []
    }) => {
      const methodName = method.toLowerCase() as 'get' | 'post' | 'put' | 'patch' | 'delete'
      const ags = []

      if (!ref) return
      if (authorized) {
        ags.push(this.isAuthorized)
      }
      if (validate) {
        ags.push(...checkSchema(validate))
        ags.push(this.isValidateError);
      }
      if (middlewares.length > 0) {
        ags.push(...middlewares);
      }
      if (methodName === 'get') {
        ags.push(this.checkPagination)
      }
      ags.push(ref.bind(this.controller))

      const routePath = `/${this.prefix}/${param}`

      this.router[methodName](routePath, ...ags)
    })
  }
  isAuthorized(req: Request, _: Response, next: NextFunction) {
    if (req?.headers?.authorization?.split(' ')[0] !== 'Bearer') {
      throw new AdvancedError(
        {
          jwt: {
            kind: 'missing',
            message: 'JWT is missing'
          },
        },
        { statusCode: 400 }
      )
    }
    let token = req.headers.authorization.split(' ')[1]
    const payload = jwt.verify(token, global.Config.JWT_SECRET) as IUser
    req.user = payload
    return next()
  }

  checkPagination(req: Request, _: Response, next: NextFunction) {
    let page = Number(req.query.page)
    let skip = Number(req.query.skip)
    let limit = Number(req.query.limit)
    if (Number.isNaN(limit)) {
      limit = 10
    }
    if (!Number.isNaN(page)) {
      skip = (page - 1) * limit
    }
    if (Number.isNaN(skip)) {
      skip = 0
    }
    req.pagin = {
      skip,
      limit
    }
    next()
  }

  isValidateError(req: Request, _: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let objErrors = {}
      errors.array().forEach(({ param, msg }: any) => {
        let objParam = {
          path: param,
          message: msg,
          kind: 'invalid',
          properties: {},
        }
        if (Array.isArray(msg)) {
          const message = msg[msg.length - 1]
          const [kind, values]: any = msg
          objParam = { ...objParam, message, kind }
          if (msg.length === 3) {
            objParam = { ...objParam, properties: { [kind]: values } }
          }
        }
        objErrors = {
          ...objErrors,
          [param]: objParam,
        }
      })

      throw new AdvancedError(objErrors)
    } else {
      next()
    }
  }
}

