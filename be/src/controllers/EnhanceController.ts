import { AbstractController } from "abstracts";
import { PROGRESS } from "constant/enums";
import { Request, Response } from "express";
import { IEnhance } from "interfaces";
import { EnhanceService } from "services";
import { ResponseResult } from "utils";

export default class EnhanceController extends AbstractController<IEnhance, EnhanceService> {
  constructor() {
    super(EnhanceService)
  }
  async get(req: Request, res: Response) {
    const { castle } = req.query
    const service = this.createService(req.user)
    const data = await service.find({
      query: { castle, progress: PROGRESS.PENDING }
    })
    res.send(new ResponseResult({ message: "Get Enhance successfully", ...data }))
  }
  async post(req: Request, res: Response) {
    const { type, unit } = req.body
    const service = this.createService(req.user)
    const input = service.validPostInput({ type, unit })
    await service.post({ ...input, unit })
    res.send(new ResponseResult({ message: "Enhance successfully" }))
  }

}

