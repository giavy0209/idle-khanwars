import { AbstractController } from "abstracts";
import { Request, Response } from "express";
import { MarchingService } from "services";
import { ResponseResult } from "utils";

export default class MarchingController extends AbstractController<MarchingService> {
  constructor() {
    super(MarchingService)
  }
  async get(req: Request, res: Response) {
    const service = this.createService(req.user)
    const data = await service.get()
    res.send(new ResponseResult({ ...data, message: "Get marchings successfully" }))
  }

  async post(req: Request, res: Response) {
    const service = this.createService(req.user)
    const input = service.validPostInput(req.body)
    const data = await service.post(input)
    res.send(new ResponseResult({
      data,
      message: `Send unit for ${input.action} successfully`
    }))
  }

  async patch(req: Request, res: Response) {
    const { id } = req.params
    const { action } = req.body
    const service = this.createService(req.user)
    const data = await service.patch(id, { action })
    res.send(new ResponseResult({
      data,
      message: `Send command ${action} to marching successfully`
    }))
  }
}

