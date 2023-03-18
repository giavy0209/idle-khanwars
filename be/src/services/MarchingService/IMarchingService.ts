import { MARCHING } from "constant/enums"

export interface IPostInput {
  to?: string
  coordinates?: {
    x: number,
    y: number
  }
  action: MARCHING.ACTION
  units: {
    _id: string
    selected: number
    [k: string]: any
  }[]
}
