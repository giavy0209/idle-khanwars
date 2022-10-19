import { AbstractController } from "abstracts";
import { ITraining } from "interfaces";
import { TrainingService } from "services";
import { Request, Response } from "express";
import { ResponseResult } from "utils";
export default class TraningController extends AbstractController<ITraining, TrainingService> {
  constructor() {
    super(TrainingService)
  }
  async get(req :Request , res:Response){
    const {
      user,
      query :{
        castle
      }
    } = req
    const service = this.createService(user)
    const data = await service.get({castle :castle as string})
    res.send(new ResponseResult({
      data,
      message:"Get training queue successfully"
    })
  }
}
