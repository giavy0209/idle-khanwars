import { ICastle } from "./ICastle"
import { IUnit } from "./IUnit"
import { ResourceData } from "./Utils"
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
  coordinates: {
    x: number
    y: number
  }
  units: {
    type: IUnit
    total: number
    _id: string
  }[]
  cargo: ResourceData
}
