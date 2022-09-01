/** @format */

import { Module } from '@nestjs/common';
import { ModelModule } from '@vypham0209/nestjs-common';
import { Building } from 'modules/building/building.schema';
import { DefaultBuildingModule } from 'modules/default-building/default-building.module';
import { DefaultResourceModule } from 'modules/default-resource/default-resource.module';
import { SocketModule } from 'modules/socket/socket.module';
import { ResourceController } from './resource.controller';
import { Resource } from './resource.schema';
import { ResourceService } from './resource.service';

@Module({
  imports: [
    ModelModule.register([Resource, Building]),
    SocketModule,
    DefaultResourceModule,
    DefaultBuildingModule,
  ],
  controllers: [ResourceController],
  providers: [ResourceService],
  exports: [ResourceService],
})
export class ResourceModule {}
