import { AbstractRouter } from 'abstracts'
import { MarchingController } from 'controllers'
export default class MarchingRouter extends AbstractRouter<MarchingController> {
  constructor() {
    super('marchings', MarchingController)
    this.routes = [
      {
        param: '',
        method: 'GET',
        ref: this.controller.get
      },
      {
        param: '',
        method: 'POST',
        ref: this.controller.post
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
