import { AbstractRouter } from 'abstracts'
import { UserController } from 'controllers'
import { body } from 'express-validator'
export default class UserRouter extends AbstractRouter<UserController> {
  constructor() {
    super('users', UserController)
    this.routes = [
      {
        param: ':id',
        method: 'GET',
        ref: this.controller.get
      },
      {
        param: 'my',
        method: 'GET',
        ref: this.controller.getMy
      },
      {
        param: '',
        method: 'POST',
        middlewares: [body(['username', 'password']).isString()],
        authorized: false,
        ref: this.controller.post,
      },
      {
        param: 'login',
        method: 'POST',
        middlewares: [body(['username', 'password']).isString()],
        authorized: false,
        ref: this.controller.login,
      },
    ]
    this.regisRouter()
  }
}
