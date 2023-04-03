import { Types } from "mongoose";

export interface IDefaultBuilding {
  name: string
  key: string
  description: string
  type: string
  path: string
  resource: Types.ObjectId
}

export type DefaultBuildingDoc = MongooseDocument<IDefaultBuilding>
