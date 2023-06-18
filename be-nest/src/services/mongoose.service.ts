import { Inject, Injectable, Scope } from '@nestjs/common'
import { MongooseOptionsFactory, MongooseModuleOptions } from '@nestjs/mongoose'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { getDbName } from 'utils'

@Injectable({ scope: Scope.REQUEST })
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(
    @Inject(REQUEST) private readonly request: Request) {
  }

  createMongooseOptions(): MongooseModuleOptions {
    const dbName = getDbName(this.request?.tenantId)
    return {
      uri: `${global.Config.MONGODB_URI}/${dbName}`,
    }
  }
}