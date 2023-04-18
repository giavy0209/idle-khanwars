import { UNIT } from "constant/enums"

export interface IDefaultUnitType {
  name: UNIT.TYPE
  key: string
  order: number
}

export type DefaultUnitTypeDoc = MongooseDocument<IDefaultUnitType>