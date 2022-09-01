import { IResourceCost } from './resource-cost.interface'

export namespace DEFAULT_ENHANCE {
  export enum TYPE {
    HP = 'HP',
    ATTACK = 'ATTACK',
    CARGO = 'CARGO',
  }
  export const TYPES = Object.values(TYPE)
}
export interface IDefaultEnhance {
  level: number
  unit: string
  value: number
  time: number
  type: DEFAULT_ENHANCE.TYPE
  resources: IResourceCost[]
}