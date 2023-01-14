import { Connection, Model, Schema } from "mongoose"

export default abstract class AbtractModel<I> {
  tenantId?: string
  name: string
  schema: Schema
  collectionName: string
  DB: Connection
  constructor({ tenantId, name }: { tenantId?: string, name: string }) {
    this.DB = DB[getDbName(tenantId)]
    this.name = name
    this.tenantId = tenantId
  }

  getCollectionName(name?: string) {
    if (name) {
      return name
    } else {
      return this.name
    }
  }
  getInstance() {
    let modelObject: Model<I> = this.DB.models[this.name]
    if (!modelObject) {
      modelObject = this.DB.model<I>(this.name, this.schema)
    }
    return modelObject
  }
}