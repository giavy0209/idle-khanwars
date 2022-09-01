/** @format */

import { Module } from '@nestjs/common';
import { ModelModule } from '@vypham0209/nestjs-common';
import { DefaultBuildingModule } from 'modules/default-building/default-building.module';
import { DefaultUpgradeModule } from 'modules/default-upgrade/default-upgrade.module';
import { BuildingController } from './building.controller';
import { Building } from './building.schema';
import { BuildingService } from './building.service';

@Module({
  imports: [
    ModelModule.register([Building]),
    DefaultBuildingModule,
    DefaultUpgradeModule,
  ],
  controllers: [BuildingController],
  providers: [BuildingService],
  exports: [BuildingService],
})
export class BuildingModule {}
