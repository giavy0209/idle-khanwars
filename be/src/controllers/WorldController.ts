import { AbstractController } from "abstracts";
import { Request, Response } from "express";
import { WorldService } from "services";
import { ResponseResult } from "utils";
import initTenant from "utils/initTenant";

export default class WorldController extends AbstractController<WorldService> {
  constructor() {
    super(WorldService)
  }
  async post(req: Request, res: Response) {
    const { tenant, name, speed } = req.body
    const service = this.createService()
    const world = await service.model.create({
      name,
      speed,
      tenant
    })
    await initTenant(world)
    res.send(new ResponseResult({
      data: world
    }))
  }
}

