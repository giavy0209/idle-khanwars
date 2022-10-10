import { HTTPSTATUS, SUCCESS } from "constant"

export default class ResponseResult {
  public code: number = HTTPSTATUS.OK
  public message?: string
  public status: string = SUCCESS
  public data?: any[] | any

  public total?: number
  public sum?: number

  constructor({
    status,
    code,
    message,
    data,
    total,
  }: {
    status?: string
    code?: number
    message?: string
    data?: any
    total?: number
    sum?: number
  } = {}) {
    this.status = status || this.status
    this.code = code || this.code
    this.message = message
    this.data = data
    this.total = total
  }
}
