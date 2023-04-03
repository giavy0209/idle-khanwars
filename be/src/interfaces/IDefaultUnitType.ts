export interface IDefaultUnitType {
  name: string
  key: string
  order: number
}

export type DefaultUnitTypeDoc = MongooseDocument<IDefaultUnitType>