import { Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { InjectConnection } from '@nestjs/mongoose'
import { AbstractService } from 'abstracts'
import { COLLECTION } from 'enums'
import { Request } from 'express'
import { Connection } from 'mongoose'
import { CreateWorldDto } from './dto/createWorld.dto'
import { World } from './worlds.schema'

@Injectable()
export class WorldsService extends AbstractService<World> {
  constructor(
    @InjectConnection() connection : Connection,
    @Inject(REQUEST) req : Request
  ) {
    super(
      connection,
      World,
      COLLECTION.worlds,
      undefined,
      {
        user : req.user
      }
    )
  }
  create(createWorldDto: CreateWorldDto) {
    return this.model.create(createWorldDto)
  }
}
