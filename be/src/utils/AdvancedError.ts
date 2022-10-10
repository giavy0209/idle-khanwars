import { HTTPSTATUS, VALIDATE_ERROR } from "constant"

export default class AdvancedError extends Error {
  public name: string
  public statusCode: number
  constructor(errorData?: { statusCode?: number, message?: string }) {
    super()
    errorData?.message ? (this.name = errorData.message) : (this.name = VALIDATE_ERROR)
    errorData?.statusCode ? (this.statusCode = errorData.statusCode) : (this.statusCode = HTTPSTATUS.BAD_REQUEST)
  }

}