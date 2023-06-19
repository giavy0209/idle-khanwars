import { Injectable } from '@nestjs/common'
import { AbstractService } from 'abstracts'
import { CreateWorldDto } from './dto/createWorld.dto'
import { WorldModel } from './worlds.schema'

@Injectable()
export class WorldsService extends AbstractService<WorldModel> {
  constructor(model: WorldModel) {
    super(model)
  }
  create(createWorldDto: CreateWorldDto) {
    return this.model.create(createWorldDto)
  }
}
