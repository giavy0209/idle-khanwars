export type Response<T> = {
  data: T
  total?: number
  message: string
  statusCode: number
}