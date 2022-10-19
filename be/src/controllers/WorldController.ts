import { AbstractController } from "abstracts";
// import { Request, Response } from "express";
import { IWorld } from "interfaces";
import { WorldService } from "services";

export default class WorldController extends AbstractController<IWorld, WorldService> {
  constructor() {
    super(WorldService)
  }
  async post (req:Request,res:Response){
    const {tenant, name, speed}=req.body
    const service = await this.createService()
    const world = await service.create({
      name, 
      speed,
      tenant
    })
    
  }
}

