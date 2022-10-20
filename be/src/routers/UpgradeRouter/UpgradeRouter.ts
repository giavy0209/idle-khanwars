import { AbstractRouter } from 'abstracts'
import { UpgradeController } from 'controllers'


export default class UpgradeRouter extends AbstractRouter<UpgradeController> {
  constructor() {
    super('upgrades', UpgradeController)
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
