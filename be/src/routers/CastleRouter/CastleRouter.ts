import { AbstractRouter } from 'abstracts'
import { CastleController } from 'controllers'

export default class CastleRouter extends AbstractRouter<CastleController> {
  constructor() {
    super('castles', CastleController)
    this.routes = [
      {
        param: '',
        method: 'GET',
        ref: this.controller.get
      },
      {
        param: 'map',
        method: 'GET',
        ref: this.controller.getMap
      },
      {
        param: 'place',
        method: 'POST',
        ref: this.controller.place
      },
    ]
    this.regisRouter()
  }
}
