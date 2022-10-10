import { AbstractController } from "abstracts";
import { Request, Response } from "express";
import { IBuilding } from "interfaces";
import { BuildingService } from "services";
import { ResponseResult } from "utils";

export default class BuildingController extends AbstractController<IBuilding, BuildingService> {
  constructor() {
    super(BuildingService)
  }
  async get(req: Request, res: Response) {
    const { castle } = req.query
    const service = this.createService(req.user)
    const { data, total } = await service.get({ castle: castle as string })
    res.send(new ResponseResult({
      data,
      total,
      message: 'Found building'
    }))
  }

  async getUpgrade(req: Request, res: Response) {
    const { building } = req.query
    const service = this.createService(req.user)
    const data = await service.getUpgrade({ building: building as string })
    res.send(new ResponseResult({
      data,
      message: 'Found upgrade cost'
    }))
  }

  async postUpgrade(req: Request, res: Response) {
    const { id } = req.params
    const service = this.createService(req.user)
    const data = await service.postUpgrade(id)
    res.send(new ResponseResult({
      data,
      message: 'Upgrade successfully'
    }))
  }

}

