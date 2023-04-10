import { AbstractController } from "abstracts";
import { TrainingService } from "services";
import { Request, Response } from "express";
import { ResponseResult } from "utils";
export default class TraningController extends AbstractController<TrainingService> {
  constructor() {
    super(TrainingService)
  }
  async get(req: Request, res: Response) {
    const {
      user,
      query: {
        castle
      }
    } = req
    const service = this.createService(user)
    const { data } = await service.get({ castle: castle as string })
    res.send(new ResponseResult({
      data,
      message: "Get training queue successfully"
    }))
  }

  async post(req: Request, res: Response) {
    const { total, unit } = req.body
    const service = this.createService(req.user)
    const data = await service.post({ total, unit })
    res.send(new ResponseResult({
      data,
      message: 'Traning successfully'
    }))
  }
}

