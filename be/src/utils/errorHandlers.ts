import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
class ErrorHandler {
  public internalServerError(
    error: any,
    _: Request,
    res: Response,
    __: NextFunction,
  ) {
    let { errors: data, message } = error
    const { statusCode = 500 } = error
    const listMessage: string[] = []
    if(data) {
      data = Object.keys(data).map(key => {
        const errorField: {
          kind: string
          message: string
          properties: any
          path: string
        } = data[key]
        const { message: defaultMessage, properties: values } = errorField
        let { path = key, kind = 'invalid' } = errorField
        if (statusCode === 500) {
          const castError = [
            'Number',
            'String',
            'Boolean',
            'ObjectID',
            'Date',
          ]
          if (castError.includes(kind)) kind = `is${kind}`
        }
        kind = kind.replace(/length$/i, '')
        path = path.replace(/\.\d+$/, '')
        let id = [kind, path]
        listMessage.push(defaultMessage)
        return { id: id.join('.'), defaultMessage, values }
      })
    }
    if (!message) message = listMessage.join('. ')
    const resData = {
      status: error.name as string,
      statusCode: 400,
      data,
      message,
    }
    res.status(resData.statusCode).send(resData)
  }
  public PageNotFound(req: Request, res: Response, _err: ErrorRequestHandler) {
    res
      .status(404)
      .send({ message: 'Route ' + req.url + ' Not found.' })
  }
}

export default new ErrorHandler()
