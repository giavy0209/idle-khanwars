import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
class ErrorHandler {
  public internalServerError(
    error: any,
    _: Request,
    res: Response,
    __:NextFunction
  ) {

    let { name, statusCode = 400 } = error
    
    const resData = {
      code: statusCode,
      message: name,
    }
    res.status(statusCode).send(resData)
  }
  public PageNotFound(req: Request, res: Response, _err: ErrorRequestHandler) {
    res
      .status(404)
      .send({ message: 'Route ' + req.url + ' Not found.' })
  }
}

export default new ErrorHandler()
