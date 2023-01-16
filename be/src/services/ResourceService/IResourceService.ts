import { IDefaultResources } from "interfaces"

export interface IGetInput {
  castle: string
}

export interface IisEnoughResourceInput {
  type: IDefaultResources
  value: number
}