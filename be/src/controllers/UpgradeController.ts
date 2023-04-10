import { AbstractController } from "abstracts";
import { Request, Response } from "express";
import { UpgradeService } from "services";
import { ResponseResult } from "utils";

export default class UpgradeController extends AbstractController<UpgradeService> {
  constructor() {
    super(UpgradeService)
  }


  async get(req: Request, res: Response) {
    const {
      user,
      query: {
        castle,
        progress
      }
    } = req
    const service = this.createService(user)
    const { data } = await service.get({ castle: castle as string, progress: progress as string })
    res.send(new ResponseResult({
      data,
      message: "Get upgrade queue successfully"
    }))
  }

  async post(req: Request, res: Response) {
    const { building } = req.body
    const service = this.createService(req.user)
    const data = await service.post({ building })
    res.send(new ResponseResult({
      data,
      message: 'Upgrade successfully'
    }))
  }
}

