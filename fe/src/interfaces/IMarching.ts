import { ICastle } from "./ICastle"
export namespace MARCHING {
  export enum STATUS {
    TO_TARGET = "TO_TARGET",
    GO_HOME = "GO_HOME",
    DONE = "DONE",
  }
  export enum ACTION {
    ATTACK = 'ATTACK',
    SPY = 'SPY',
    PATROL = 'PATROL',
    CARAVAN = 'CARAVAN',
  }
}
export interface IMarching {
  _id: string,
  startAt: string
  arriveAt: string
  status: MARCHING.STATUS
  action: MARCHING.ACTION
  homeAt: string
  speed: number
  population: number
  from: ICastle
  to?: ICastle
  coordinate: {
    x: number
    y: number
  }
  units: {
    type: string
    value: number
  }[]
  cargo: {
    asArray: {
      type: string
      value: number
    }[]
    asObject: {
      gold: number
      iron: number
      wood: number
      food: number
    }
  }
}
