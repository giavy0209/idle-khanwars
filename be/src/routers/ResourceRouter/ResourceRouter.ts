import { AbstractRouter } from 'abstracts'
import { ResourceController } from 'controllers'
export default class ResourceRouter extends AbstractRouter<ResourceController> {
  constructor() {
    super('resources', ResourceController)
    this.routes = [
      {
        param: '',
        method: 'GET',
        ref: this.controller.get
      },
    ]
    this.regisRouter()
  }
}
