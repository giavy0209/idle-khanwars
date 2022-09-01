export interface IItemList {
  _id: string
  name: string
  path?: string
  router?: string
  info?: {
    name: number | string
    value: number | string
  }[]
}