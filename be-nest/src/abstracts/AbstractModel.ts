import { Connection, Document, Model, Schema } from 'mongoose'

export abstract class AbstractModel<D extends Document> {
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
    this.connection = connection
    this.name = name
    this.tenant = tenant
    this.schema = schema
    this.model = this.getModel()
  }

  getCollectionName(name?: string) {
    if (name) {
      return `${this.tenant ? this.tenant + '_' : ''}${name}`
    }
    return `${this.tenant ? this.tenant + '_' : ''}${this.name}`
  }

  getModel() {
    const collectionName = this.getCollectionName()
    let modelObject = this.connection.models[collectionName]
    if (!modelObject) {
      modelObject = this.connection.model<D>(collectionName, this.schema)
    }
    return modelObject
  }
}
