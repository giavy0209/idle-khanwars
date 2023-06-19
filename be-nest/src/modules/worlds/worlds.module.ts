import { Module } from '@nestjs/common'
import { WorldsController } from './worlds.controller'
import { WorldModel } from './worlds.schema'
import { WorldsService } from './worlds.service'

@Module({
  controllers: [WorldsController],
  providers: [WorldsService, WorldModel]
})
export class WorldsModule {}
