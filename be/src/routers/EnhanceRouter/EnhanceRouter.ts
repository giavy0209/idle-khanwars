import { AbstractRouter } from 'abstracts'
import { EnhanceController } from 'controllers'


export default class EnhanceRouter extends AbstractRouter<EnhanceController> {
  constructor() {
    super('enhances', EnhanceController)
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
        ref: this.controller.patch
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
