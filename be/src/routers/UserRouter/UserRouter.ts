import { AbstractRouter } from 'abstracts'
import { UserController } from 'controllers'
import path from 'path'
const filename = path.basename(__filename)
const ext = path.extname(filename)
const param = filename.replace(ext, '')


export default class UserRouter extends AbstractRouter<UserController> {
  constructor() {
    super(param, UserController)
    this.routes = [
      {
        param: ':id?',
        method: 'GET',
        ref: this.controller.get
      },
      {
        param: '',
        method: 'POST',
        ref: this.controller.post
      },
      {
        param: ':id?',
        method: 'PUT',
        ref: this.controller.put
      },
      {
        param: ':id',
        method: 'PATCH',
        ref: this.controller.delete
      },
      {
        param: ':id',
        method: 'DELETE',
        ref: this.controller.delete
      },
    ]
    this.regisRouter()
  }
}
