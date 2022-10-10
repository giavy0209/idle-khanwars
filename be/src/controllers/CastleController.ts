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
      message : 'Get castle successfully'
    }))
  }
}

