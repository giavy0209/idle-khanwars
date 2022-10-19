import { AbstractService } from "abstracts"
import { DATA_CREATED, DATA_DELETED, DATA_FOUND, DATA_UPDATED } from "constant";
import { NextFunction, Request, Response } from "express";
import { IUserFullyPopulate } from "interfaces/IUser";
import { FilterQuery, isValidObjectId } from "mongoose";
import { ResponseResult } from "utils";

export default class AbtractController<I, S extends AbstractService<I, any>> {
  Service: new (user?: IUserFullyPopulate) => S;
  constructor(Service: new (user?: IUserFullyPopulate) => S) {
    this.Service = Service
  }
  createService(user?: IUserFullyPopulate) {
    return new this.Service(user)
  }
  async get(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const query = req.query as FilterQuery<I>
    const service = this.createService(req.user)
    const { skip, limit } = req.pagin

    if (id) {
      if (isValidObjectId(id)) {
        const data = await service.findById(id, true)
        if (data) {
          res.send(new ResponseResult({
            data,
            message: DATA_FOUND
          }))
        } else {
          return next()
        }
      } else {
        return next()
      }
    }
    const { data, total } = await service.find(query, { skip, limit })
    res.send(new ResponseResult({
      data,
      total,
      message: DATA_FOUND
    }))
  }
  async post(req: Request, res: Response) {
    const service = this.createService(req.user)
    const data = await service.model.create(req.body)
    res.send(new ResponseResult({
      data,
      message: DATA_CREATED
    }))
  }
  async put(req: Request, res: Response) {
    const { id } = req.params
    const service = this.createService(req.user)
    const data = await service.model.findByIdAndUpdate(id, req.body)
    res.send(new ResponseResult({
      data,
      message: DATA_UPDATED
    }))
  }
  async patch(req: Request, res: Response) {
    const { id } = req.params
    const service = this.createService(req.user)
    const data = await service.model.findByIdAndUpdate(id, req.body)
    res.send(new ResponseResult({
      data,
      message: DATA_UPDATED
    }))
  }
  async delete(req: Request, res: Response) {
    const { id } = req.params
    const service = this.createService(req.user)
    const data = await service.model.findByIdAndDelete(id)
    res.send(new ResponseResult({
      data,
      message: DATA_DELETED
    }))
  }
}