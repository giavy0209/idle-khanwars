import { AbstractRouter } from 'abstracts'
import { TrainingController } from 'controllers'

export default class TraningRouter extends AbstractRouter<TrainingController> {
  constructor() {
    super('trainings', TrainingController)
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
        param: ':id',
        method: 'DELETE',
        ref: this.controller.delete
      },
    ]
    this.regisRouter()
  }
}
