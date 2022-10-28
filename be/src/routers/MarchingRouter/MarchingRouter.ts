import { AbstractRouter } from 'abstracts'
import { MarchingController } from 'controllers'
import path from 'path'
const filename = path.basename(__filename)
const ext = path.extname(filename)
const param = filename.replace(ext, '')


export default class MarchingRouter extends AbstractRouter<MarchingController> {
  constructor() {
    super(param, MarchingController)
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
