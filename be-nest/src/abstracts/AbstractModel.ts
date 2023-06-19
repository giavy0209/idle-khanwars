import { Connection, Model, Schema } from 'mongoose'
import { getDbName } from 'utils'

export abstract class AbstractModel<D > {
  Doc: D
  tenant?: string
  name: string
  schema: Schema<D>
  model: Model<D>
  connection: Connection
  constructor(
    connection: Connection,
    {
      name,
      schema,
      tenant,
    }: { name: string; schema: Schema<D>; tenant?: string }
  ) {
    this.name = name
    this.tenant = tenant?.trim()
    this.schema = schema
    this.connection = connection.useDb(getDbName(this.tenant))
    this.model = this.getModel()
  }

  getCollectionName(name?: string) {
    if (name) {
      return `${this.tenant ? this.tenant + '_' : ''}${name}`
    }
    return `${this.tenant ? this.tenant + '_' : ''}${this.name}`
  }

  getModel() {
    let modelObject = this.connection.models[this.name]
    if (!modelObject) {
      modelObject = this.connection.model<D>(this.name, this.schema)
    }
    return modelObject
  }
}
