import { AbstractRouter } from 'abstracts'
import { BuildingController } from 'controllers'
import { query } from 'express-validator'

export default class BuildingRouter extends AbstractRouter<BuildingController> {
  constructor() {
    super('buildings', BuildingController)
    this.routes = [
      {
        param: '',
        method: 'GET',
        middlewares: [query(['castle']).isString()],
        ref: this.controller.get
      },
      {
        param: 'upgrade/:id',
        method: 'POST',
        ref: this.controller.postUpgrade
      },
    ]
    this.regisRouter()
  }
}
