import { AbstractRouter } from 'abstracts'
import { WorldController } from 'controllers'


export default class WorldRouter extends AbstractRouter<WorldController> {
  constructor() {
    super('worlds', WorldController)
    this.routes = [
      {
        param: ':id?',
        method: 'GET',
        ref: this.controller.get,
        authorized : false
      },
    ]
    this.regisRouter()
  }
}
