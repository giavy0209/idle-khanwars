import { AbstractController } from "abstracts";
import { Request, Response } from "express";
import { UnitService } from "services";
import { ResponseResult } from "utils";

export default class UnitController extends AbstractController<UnitService> {
  constructor() {
    super(UnitService)
  }
  async get(req: Request, res: Response) {
    const { castle } = req.query
    const service = this.createService(req.user)
    const data = await service.get(castle as string)

    res.send(new ResponseResult({
      data,
      message: 'Get unit successfully'
    }))
  }
  async move(req: Request, res: Response) {
    const { unit, type, value } = req.body
    const service = this.createService(req.user)
    const data = await service.move({ unit, type, value })

    res.send(new ResponseResult({
      data,
      message: 'Move unit successfully'
    }))
  }
}

