import { AbstractRouter } from 'abstracts'
import { UnitController } from 'controllers'


export default class UnitRouter extends AbstractRouter<UnitController> {
  constructor() {
    super('units', UnitController)
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
    ]
    this.regisRouter()
  }
}
