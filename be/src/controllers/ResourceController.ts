import { AbstractController } from "abstracts";
import { Request, Response } from "express";
import { IResource } from "interfaces";
import { ResourceService } from "services";
import { ResponseResult } from "utils";

export default class ResourceController extends AbstractController<IResource, ResourceService> {
  constructor() {
    super(ResourceService)
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
}

