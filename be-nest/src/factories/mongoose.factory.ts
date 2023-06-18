import { REQUEST } from '@nestjs/core'
import { COLLECTION } from 'enums'
import { Request } from 'express'
import { Schema } from 'mongoose'

export interface OptionalQueryOptions {
  idsOnly?: boolean
  count?: boolean
}
export function mongooseModuleFunction<T = any>(
  name: COLLECTION,
  schema: Schema<T>
) {
  return {
    name: name,
    useFactory: mongooseFactory<T>(name, schema),
    inject: [REQUEST],
  }
}
export function mongooseFactory<T = any>(name: COLLECTION, schema: Schema<T>) {
  return async (req: Request) => {
    const tenant = req.user?.tenant || ''
    const collectionName = tenant ? `${tenant}_${name}` : name
    schema.set('collection', collectionName)

    return schema
  }
}
