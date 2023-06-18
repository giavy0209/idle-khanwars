import { Module } from '@nestjs/common';
import { WorldsService } from './worlds.service';
import { WorldsController } from './worlds.controller';
import { World, WorldSchema } from './worlds.schema'
import { COLLECTION } from 'enums'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name : COLLECTION.worlds,
        schema : WorldSchema
      }
    ]),
  ],
  controllers: [WorldsController],
  providers: [WorldsService, World]
})
export class WorldsModule {}
