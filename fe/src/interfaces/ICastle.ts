import { IUser } from "./IUser"

export interface ICastle {
  _id: string
  loyal: number
  population: number
  name: string
  user?: IUser
  isCapital: boolean
  coordinate: {
    x: number
    y: number
  }
}