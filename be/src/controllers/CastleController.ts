import { AbstractController } from "abstracts";
import { Request, Response } from "express";
import { ICastle } from "interfaces";
import { CastleService } from "services";
import { ResponseResult } from "utils";

export default class CastleController extends AbstractController<ICastle, CastleService> {
  constructor() {
    super(CastleService)
  }
  async get(req: Request, res: Response) {
    const service = this.createService(req.user)
    const data = await service.get()
    res.send(new ResponseResult({
      data,
      message: 'Get castle successfully'
    }))
  }

  async getMap(req: Request, res: Response) {
    const { start, end } = req.body
    const service = this.createService(req.user)
    const data = await service.getMap({ start, end })
    res.send(new ResponseResult({
      data,
      message: 'Get map successfully'
    }))
  }
}

