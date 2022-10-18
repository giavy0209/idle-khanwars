import { AbstractController } from "abstracts";
import { Request, Response } from "express";
import { IUnit } from "interfaces";
import { UnitService } from "services";
import { ResponseResult } from "utils";

export default class UnitController extends AbstractController<IUnit, UnitService> {
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
  async post(req: Request, res: Response) {
    const { total, unit } = req.body
    const service = this.createService(req.user)
    await service.post({ total, unit })
    res.send(new ResponseResult({
      message: 'Traning successfully'
    }))
  }
}

