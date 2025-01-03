import { ResourceData } from "./Utils"

export interface IDefaultUnit {
  name: string
  key: string
  order: number
  description: string
  path: string
  type: {
    name: string
    key: string
    order: number
  }
  time: number
  speed: number
  cargo: number
  life: number
  range: number
  population: number
  resources: ResourceData
  strength: {
    asArray: {
      type: {
        name: string
        key: string
        order: number
      }
      value: number
    }[]
    asObject: {
      infantry: number,
      archers: number,
      cavalry: number,
      siege: number
      wall: number
    }
  },
}