import { DefaultResourcesDoc } from "interfaces"

export interface IGetInput {
  castle: string
}

export interface IisEnoughResourceInput {
  type: DefaultResourcesDoc
  value: number
}