import { AbstractRouter } from 'abstracts'
import { UserController } from 'controllers'
import { body } from 'express-validator'
import path from 'path'
const filename = path.basename(__filename)
const ext = path.extname(filename)
const param = filename.replace(ext, '')


export default class UserRouter extends AbstractRouter<UserController> {
  constructor() {
    super(param, UserController)
    this.routes = [
      {
        param: 'signin',
        method: 'POST',
        authorized: false,

        middlewares: [body(['username', 'password']).isString()],
        ref: this.controller.signin
      },
      {
        param: 'signup',
        method: 'POST',
        authorized: false,
        validate: {
          username: {
            isLength: {
              errorMessage: 'Username should be at least 6 chars long',
              options: { min: 6 , max : 20},
            },
          },
          password: {
            isLength: {
              errorMessage: 'Password should be at least 6 chars long',
              options: { min: 6 , max : 20},
            },
          }
        },
        ref: this.controller.signup
      },
      {
        method: 'GET',
        ref: this.controller.get
      },
      {
        param: 'my',
        method: 'GET',
        ref: this.controller.getMy
      }
    ]
  }
}
