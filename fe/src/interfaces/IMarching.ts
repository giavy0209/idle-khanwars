export interface IMarching {
  _id: string,
  startAt: Date
  arriveAt: Date
  homeAt: Date
  speed: number
  castle: string
  population: number
  target: {
    castle: string
    coordinate: {
      x: number
      y: number
    }
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

export enum ACTION {
  ATTACK = 'ATTACK',
  SPY = 'SPY',
  PATROL = 'PATROL',
  CARAVAN = 'CARAVAN',
}