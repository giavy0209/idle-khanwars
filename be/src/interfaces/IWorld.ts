export interface IWorld {
  name: string
  speed: number
  tenant: string
  status: string
}

export type WorldDoc = MongooseDocument<IWorld>