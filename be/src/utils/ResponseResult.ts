import { HTTPSTATUS, SUCCESS } from "constant"

export default class ResponseResult {
  public statusCode: number = HTTPSTATUS.OK
  public message?: string
  public status: string = SUCCESS
  public data?: any[] | any

  public total?: number
  public sum?: number

  constructor({
    status,
    statusCode,
    message,
    data,
    total,
    sum,
  }: {
    status?: string
    statusCode?: number
    message?: string
    data?: any
    total?: number
    sum?: number
  } = {}) {
    this.status = status || this.status
    this.statusCode = statusCode || this.statusCode
    this.message = message
    this.data = data
    this.total = total
    this.sum = sum
  }
}
