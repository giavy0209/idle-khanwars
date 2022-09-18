import { model, Model, models, Schema } from "mongoose"

export default abstract class AbtractModel<I> {
  tenantId?: string
  name: string
  schema: Schema
  collectionName : string
  isTenant : boolean = true
  constructor({tenantId , name}: {tenantId? : string, name : string}) {
    this.name = name
    this.tenantId = tenantId
  }
  generateCollectionName () {
    if(this.isTenant) {
      this.collectionName = `${this.tenantId}_${this.name}`
    }else {
      this.collectionName = this.name
    }
  }
  getInstance() {
    this.generateCollectionName()
    let modelObject: Model<I> = models[this.collectionName]
    if (!modelObject) {
      modelObject = model<I>(this.collectionName, this.schema)
    }
    return modelObject
  }
}