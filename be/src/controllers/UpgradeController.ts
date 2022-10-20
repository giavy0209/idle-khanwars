import { AbstractController } from "abstracts";
import { Request, Response } from "express";
import { IUpgrade } from "interfaces";
import { UpgradeService } from "services";
import { ResponseResult } from "utils";

export default class UpgradeController extends AbstractController<IUpgrade, UpgradeService> {
  constructor() {
    super(UpgradeService)
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
    const { building } = req.body
    const service = this.createService(req.user)
    const data = await service.post({ building })
    res.send(new ResponseResult({
      data,
      message: 'Traning successfully'
    }))
  }
}

