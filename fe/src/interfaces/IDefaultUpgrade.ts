export interface IDefaultUpgrade {
  building: {
    type: string
    key: string
  }
  level: number
  generate: number
  time: number
  resources: {
    asArray: {
      type: {
        name: string
        key: string
        path: string
      }
      _id: string
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