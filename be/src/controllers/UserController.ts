import { AbstractController } from "abstracts";
import { Request, Response } from "express";
import { IUser } from "interfaces";
import { IUserFullyPopulate } from "interfaces/IUser";
import { UserService, WorldService } from "services";
import { ResponseResult } from "utils";

export default class UserController extends AbstractController<IUser, UserService> {
  constructor() {
    super(UserService)
  }
  async getMy(req: Request, res: Response) {
    const service = this.createService(req.user)
    const data = await service.findById(req.user._id, true)
    res.send(new ResponseResult({
      data,
      message: 'Get current user successfully'
    }))
  }
  async post(req: Request, res: Response) {
    const { username, password, world } = req.body
    const worldService = new WorldService()
    const foundWorld = await worldService.findOne({ _id: world }, true)

    const service = this.createService({ world: foundWorld } as IUserFullyPopulate)
    const data = await service.post({ username, password, world })
    res.send(new ResponseResult({
      data,
      message: 'Signup successfully, please login'
    }))
  }
  async login(req: Request, res: Response) {
    const { username, password, world } = req.body
    const worldService = new WorldService()
    const foundWorld = await worldService.findOne({ _id: world }, true)
    const service = this.createService({ world: foundWorld } as IUserFullyPopulate)
    const data = await service.login({ username, password, world })
    res.send(new ResponseResult({
      data,
      message: 'Login successfully'
    }))
  }
}

