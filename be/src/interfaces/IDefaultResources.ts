export interface IDefaultResources {
  name: string
  key: string
  path: string
}

export type DefaultResourcesDoc = MongooseDocument<IDefaultResources>