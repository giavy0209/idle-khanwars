import { HTTPSTATUS, VALIDATE_ERROR } from "constant"

export interface IValidationError {
  [key: string]: {
    kind?: string
    path?: string
    message: string
    properties?: {
      [key: string]: any
    }
    reportCode?: string
  }
}

export default class AdvancedError extends Error {
  public name: string
  public statusCode: number
  public errors: IValidationError
  constructor(errors: IValidationError, errorData?: { statusCode?: number, message?: string }) {
    super()
    errorData?.message ? (this.name = errorData.message) : (this.name = VALIDATE_ERROR)

    errorData?.statusCode ? (this.statusCode = errorData.statusCode) : (this.statusCode = HTTPSTATUS.BAD_REQUEST)
    this.errors = errors
  }

}